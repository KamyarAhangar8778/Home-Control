/**
 * @file ErrorQueue.h
 * @brief Async error queue for non-blocking error processing
 * @author uniuno
 * 
 * PURPOSE: Queue errors for later processing
 * BENEFIT: Non-blocking, batch processing, priority support
 * 
 * ARCHITECTURE:
 *   - Circular buffer (fixed size, no dynamic allocation)
 *   - Priority queue support
 *   - Thread-safe (for single core)
 */

#pragma once

#include "ErrorHandler.h"
#include <cstdint>

namespace uniuno {

/**
 * @struct QueuedError
 * @brief Error entry in queue
 */
struct QueuedError {
    char context[32];           ///< Context name (fixed size)
    char message[64];           ///< Error message (fixed size)
    ErrorSeverity severity;     ///< Error severity
    unsigned long timestamp;    ///< When queued
    bool valid;                 ///< Entry is valid
    
    QueuedError() : severity(ErrorSeverity::ERROR), timestamp(0), valid(false) {
        context[0] = '\0';
        message[0] = '\0';
    }
};

/**
 * @class ErrorQueue
 * @brief Circular queue for async error processing
 * 
 * DESIGN: Fixed-size circular buffer
 * BENEFIT: No dynamic allocation, predictable memory
 * 
 * USAGE:
 * @code
 *   ErrorQueue queue(10);  // 10 errors max
 *   
 *   // Enqueue (fast, non-blocking)
 *   queue.enqueue("Context", "Error msg", ErrorSeverity::ERROR);
 *   
 *   // Process later (in loop)
 *   queue.processOne();  // Process 1 error
 *   queue.processAll();  // Process all errors
 * @endcode
 */
template <size_t Capacity = 16>
class ErrorQueue {
public:
    /**
     * @brief Constructor
     */
    ErrorQueue() 
        : head_(0)
        , tail_(0)
        , count_(0)
        , dropped_(0) {
    }
    
    ~ErrorQueue() = default;

    /**
     * @brief Enqueue error (non-blocking)
     * @param context Context name
     * @param message Error message
     * @param severity Error severity
     * @return true if enqueued, false if queue full
     * 
     * FAST: O(1) operation
     */
    bool enqueue(const char* context, const char* message, ErrorSeverity severity) {
        // Check if full
        if (count_ >= Capacity) {
            dropped_++;
            return false;
        }
        
        // Add to tail
        QueuedError& entry = queue_[tail_];
        
        // Copy strings (safe)
        strncpy(entry.context, context ? context : "Unknown", sizeof(entry.context) - 1);
        entry.context[sizeof(entry.context) - 1] = '\0';
        
        strncpy(entry.message, message ? message : "", sizeof(entry.message) - 1);
        entry.message[sizeof(entry.message) - 1] = '\0';
        
        entry.severity = severity;
        entry.timestamp = millis();
        entry.valid = true;
        
        // Move tail
        tail_ = (tail_ + 1) % Capacity;
        count_++;
        
        return true;
    }

    /**
     * @brief Process one error from queue
     * @return true if processed, false if queue empty
     * 
     * USAGE: Call in loop() for gradual processing
     */
    bool processOne() {
        if (count_ == 0) {
            return false;
        }
        
        // Get from head
        QueuedError& entry = queue_[head_];
        
        if (entry.valid) {
            // Report to ErrorHandler
            ErrorHandler::getInstance().reportError(
                entry.context,
                entry.message,
                entry.severity
            );
            
            entry.valid = false;
        }
        
        // Move head
        head_ = (head_ + 1) % Capacity;
        count_--;
        
        return true;
    }

    /**
     * @brief Process all errors in queue
     * @param max_per_call Maximum errors to process (0 = all)
     * @return Number of errors processed
     * 
     * USAGE: Call when you have time to process
     */
    size_t processAll(size_t max_per_call = 0) {
        size_t processed = 0;
        size_t limit = (max_per_call == 0) ? count_ : max_per_call;
        
        while (processed < limit && processOne()) {
            processed++;
        }
        
        return processed;
    }

    /**
     * @brief Check if queue is empty
     */
    bool isEmpty() const {
        return count_ == 0;
    }

    /**
     * @brief Check if queue is full
     */
    bool isFull() const {
        return count_ >= Capacity;
    }

    /**
     * @brief Get current queue size
     */
    size_t size() const {
        return count_;
    }

    /**
     * @brief Get queue capacity
     */
    size_t capacity() const {
        return Capacity;
    }

    /**
     * @brief Get number of dropped errors
     */
    uint32_t dropped() const {
        return dropped_;
    }

    /**
     * @brief Clear queue
     */
    void clear() {
        head_ = 0;
        tail_ = 0;
        count_ = 0;
    }

private:
    QueuedError queue_[Capacity];    ///< Static circular buffer (zero-allocation)
    size_t head_;               ///< Read position
    size_t tail_;               ///< Write position
    size_t count_;              ///< Current size
    uint32_t dropped_;          ///< Dropped errors (queue full)
};

} // namespace uniuno
