/**
 * @file ErrorHandler.h
 * @brief Global error handling system with advanced features
 * @author uniuno
 * 
 * PURPOSE:
 *   Centralized error management for embedded systems with comprehensive
 *   tracking, filtering, and debugging capabilities.
 * 
 * FEATURES:
 *   - Error History Buffer (circular buffer, 10 errors)
 *   - Severity Statistics (INFO/WARNING/ERROR/CRITICAL)
 *   - Assert Mechanism (unit testing support)
 *   - Context Stack (nested error contexts)
 *   - Filtering (severity-based)
 *   - Throttling (rate limiting per context)
 *   - Deduplication (ignore repeated errors)
 *   - Fallback mechanism (error recovery)
 * 
 * MEMORY USAGE:
 *   - RAM: ~1.5KB (history buffer + maps)
 *   - Flash: ~300 bytes
 * 
 * USAGE:
 * @code
 *   // Setup callback
 *   ErrorHandler::getInstance().onError([](const ErrorInfo& info) {
 *       Serial.printf("[%s] %s: %s\n", severity, info.context, info.message);
 *   });
 *   
 *   // Report error
 *   ErrorHandler::getInstance().reportError("Context", "Message", ErrorSeverity::ERROR);
 *   
 *   // Use assert in tests
 *   ERROR_ASSERT(condition, "Test failed");
 *   ERROR_ASSERT_EQ(expected, actual, "Values mismatch");
 *   
 *   // Check statistics
 *   uint32_t errors = ErrorHandler::getInstance().getErrorCount();
 *   
 *   // Print history
 *   ErrorHandler::getInstance().printErrorHistory();
 * @endcode
 */

#pragma once

#include <Optimization/FastFunction.h>
#include <Optimization/StaticArray.h>
#include <Optimization/StaticHashMap.h>
#include <Optimization/SmallVector.h>
#include <Optimization/StaticString.h>

namespace uniuno {

class IErrorPolicy; // Forward declaration

// FNV-1a 32-bit string hashing functions
inline uint32_t fnv1a_hash(const char* str) {
    uint32_t hash = 2166136261u;
    while (*str) {
        hash ^= static_cast<uint8_t>(*str++);
        hash *= 16777619u;
    }
    return hash;
}

inline uint32_t fnv1a_hash(const char* str1, const char* str2) {
    uint32_t hash = 2166136261u;
    if (str1) {
        while (*str1) {
            hash ^= static_cast<uint8_t>(*str1++);
            hash *= 16777619u;
        }
    }
    hash ^= 0x55;
    hash *= 16777619u;
    if (str2) {
        while (*str2) {
            hash ^= static_cast<uint8_t>(*str2++);
            hash *= 16777619u;
        }
    }
    return hash;
}

/**
 * @enum ErrorSeverity
 * @brief Error severity levels
 * 
 * INFO:     Informational messages (lowest priority)
 * WARNING:  Potential issues that don't stop execution
 * ERROR:    Errors that affect functionality
 * CRITICAL: Fatal errors requiring immediate attention
 */
enum class ErrorSeverity {
    INFO,
    WARNING,
    ERROR,
    CRITICAL
};

/**
 * @struct ErrorInfo
 * @brief Complete error information container
 * 
 * DESIGN: Fixed-size strings (no dynamic allocation)
 * BENEFIT: Predictable memory usage, safe for embedded systems
 * 
 * FIELDS:
 *   context[32]:     Error context/module name (copied, not pointer)
 *   message[128]:    Error description (copied, not pointer)
 *   severity:        Error severity level
 *   timestamp:       When error occurred (millis())
 *   error_code:      Sequential error number
 *   context_stack:   Full context path (e.g., "Main > Init > Sensor")
 */
struct ErrorInfo {
    char context[32];
    char message[128];
    ErrorSeverity severity;
    unsigned long timestamp;
    uint32_t error_code;
    char context_stack[96];
    
    ErrorInfo() : severity(ErrorSeverity::ERROR), timestamp(0), error_code(0) {
        context[0] = '\0';
        message[0] = '\0';
        context_stack[0] = '\0';
    }
    
    ErrorInfo(const char* ctx, const char* msg, ErrorSeverity sev = ErrorSeverity::ERROR)
        : severity(sev), timestamp(0), error_code(0) {
        strncpy(context, ctx ? ctx : "", sizeof(context) - 1);
        context[sizeof(context) - 1] = '\0';
        strncpy(message, msg ? msg : "", sizeof(message) - 1);
        message[sizeof(message) - 1] = '\0';
        context_stack[0] = '\0';
    }
};

/**
 * @class ErrorHandler
 * @brief Singleton error management system
 * 
 * PATTERN: Singleton (thread-safe for single core)
 * ARCHITECTURE: Centralized error handling with multiple features
 * 
 * CORE FEATURES:
 *   1. Error History: Circular buffer storing last 10 errors
 *   2. Statistics: Count errors by severity
 *   3. Filtering: Report only errors above threshold
 *   4. Throttling: Limit error rate per context
 *   5. Deduplication: Ignore repeated errors in time window
 *   6. Context Stack: Track nested execution contexts
 *   7. Assert: Unit testing support
 * 
 * THREAD SAFETY: Safe for single-core ESP32 (no mutex needed)
 * MEMORY: ~1.5KB RAM (history + maps)
 */
class ErrorHandler {
public:
    /**
     * @brief Get singleton instance
     * @return Reference to ErrorHandler instance
     * 
     * THREAD SAFE: Yes (static local variable)
     * LAZY INIT: Instance created on first call
     */
    static ErrorHandler& getInstance() {
        static ErrorHandler instance;
        return instance;
    }

    ErrorHandler(const ErrorHandler&) = delete;
    ErrorHandler& operator=(const ErrorHandler&) = delete;

    /**
     * @brief Register error callback
     * @param callback Function called when error occurs
     * 
     * USAGE:
     * @code
     *   ErrorHandler::getInstance().onError([](const ErrorInfo& info) {
     *       Serial.printf("[ERROR] %s: %s\n", info.context, info.message);
     *   });
     * @endcode
     * 
     * NOTE: Only one callback supported (last one wins)
     */
    void onError(uniuno::FastFunction<void(const ErrorInfo&)> callback) {
        error_callback_ = std::move(callback);
    }

    /**
     * @brief Register error policy observer
     * @param policy Policy instance to register
     */
    void registerPolicy(IErrorPolicy* policy);

    /**
     * @brief Helper to dispatch error to policies
     * @param info Error information
     */
    void dispatchToPolicies(const ErrorInfo& info);

    /**
     * @brief Enable severity-based filtering
     * @param min_severity Minimum severity to report
     * 
     * EFFECT: Errors below min_severity are counted but not reported
     * 
     * USAGE:
     * @code
     *   // Only report ERROR and CRITICAL
     *   ErrorHandler::getInstance().setFilter(ErrorSeverity::ERROR);
     * @endcode
     */
    void setFilter(ErrorSeverity min_severity) {
        filter_enabled_ = true;
        min_severity_ = min_severity;
    }

    /**
     * @brief Disable severity filter
     * 
     * EFFECT: All errors will be reported regardless of severity
     */
    void disableFilter() {
        filter_enabled_ = false;
    }

    /**
     * @brief Enable throttling for specific context
     * @param context Context name to throttle
     * @param interval_ms Minimum time between errors (milliseconds)
     * 
     * EFFECT: Errors from same context within interval are counted but not reported
     * USE CASE: Prevent spam from noisy sensors or network errors
     * 
     * USAGE:
     * @code
     *   // Max 1 error per second from "SensorRead"
     *   ErrorHandler::getInstance().setThrottle("SensorRead", 1000);
     * @endcode
     */
    void setThrottle(const char* context, unsigned long interval_ms) {
        uint32_t key = fnv1a_hash(context);
        throttle_map_[key] = {0, interval_ms};
    }

    /**
     * @brief Enable error deduplication
     * @param window_ms Time window for deduplication (milliseconds)
     * 
     * EFFECT: Identical errors (same context + message) within window are ignored
     * USE CASE: Prevent duplicate errors from retry loops
     * 
     * USAGE:
     * @code
     *   // Ignore duplicate errors within 5 seconds
     *   ErrorHandler::getInstance().enableDeduplication(5000);
     * @endcode
     */
    void enableDeduplication(unsigned long window_ms) {
        dedup_enabled_ = true;
        dedup_window_ = window_ms;
    }

    /**
     * @brief Disable error deduplication
     */
    void disableDeduplication() {
        dedup_enabled_ = false;
    }

    /**
     * @brief Execute function safely with exception handling
     * @param fn Function to execute
     * @param context Context name for error reporting
     * @return true if successful, false if exception occurred
     * 
     * USE CASE: Wrap risky operations to prevent crashes
     * 
     * USAGE:
     * @code
     *   ErrorHandler::safe([]() {
     *       riskyOperation();
     *   }, "RiskyOp");
     * @endcode
     */
    static bool safe(uniuno::FastFunction<void()> fn, const char* context = "Unknown") {
        return getInstance().executeSafe(std::move(fn), context);
    }

    /**
     * @brief Execute function with fallback on error
     * @param fn Primary function to execute
     * @param fallback Fallback function if primary fails
     * @param context Context name for error reporting
     * @return true if primary succeeded, false if fallback used
     * 
     * USE CASE: Graceful degradation when operation fails
     * 
     * USAGE:
     * @code
     *   ErrorHandler::safeWithFallback(
     *       []() { connectToWiFi(); },
     *       []() { useOfflineMode(); },
     *       "NetworkInit"
     *   );
     * @endcode
     */
    static bool safeWithFallback(uniuno::FastFunction<void()> fn, 
                                  uniuno::FastFunction<void()> fallback,
                                  const char* context = "Unknown") {
        return getInstance().executeSafeWithFallback(std::move(fn), std::move(fallback), context);
    }

    bool executeSafe(uniuno::FastFunction<void()> fn, const char* context) {
        if (!fn) {
            reportError(context, "Null function", ErrorSeverity::WARNING);
            return false;
        }

        try {
            fn();
            return true;
        }
        catch (const std::exception& e) {
            reportError(context, e.what(), ErrorSeverity::ERROR);
            return false;
        }
        catch (...) {
            reportError(context, "Unknown exception", ErrorSeverity::CRITICAL);
            return false;
        }
    }

    bool executeSafeWithFallback(uniuno::FastFunction<void()> fn,
                                  uniuno::FastFunction<void()> fallback,
                                  const char* context) {
        bool success = executeSafe(std::move(fn), context);
        
        if (!success && fallback) {
            try {
                fallback();
            } catch (...) {
                reportError(context, "Fallback also failed", ErrorSeverity::CRITICAL);
            }
        }
        
        return success;
    }

    /**
     * @brief Push context onto stack
     * @param context Context name
     * 
     * USE CASE: Track nested function calls for better error context
     * NOTE: Must be paired with popContext() or use ERROR_CONTEXT macro
     * 
     * USAGE:
     * @code
     *   ErrorHandler::pushContext("Init");
     *   // ... operations ...
     *   ErrorHandler::popContext();
     * @endcode
     */
    static void pushContext(const char* context) {
        getInstance().context_stack_.push_back(context);
    }

    /**
     * @brief Pop context from stack
     * 
     * NOTE: Safe to call even if stack is empty
     */
    static void popContext() {
        if (!getInstance().context_stack_.empty()) {
            getInstance().context_stack_.pop_back();
        }
    }

    /**
     * @brief Get current context stack as string
     * @return Context path (e.g., "Main > Init > Sensor")
     * 
     * USE CASE: Display full execution path in error messages
     */
    static StaticString<128> getContextStack() {
        auto& stack = getInstance().context_stack_;
        if (stack.empty()) return "";
        
        StaticString<128> result = stack[0];
        for (size_t i = 1; i < stack.size(); i++) {
            result += " > ";
            result += stack[i];
        }
        return result;
    }

    /**
     * @brief Report error to system
     * @param context Error context/module name
     * @param message Error description
     * @param severity Error severity level
     * 
     * PROCESS:
     *   1. Check filter (severity threshold)
     *   2. Check throttle (rate limit)
     *   3. Check deduplication (repeated errors)
     *   4. Update statistics
     *   5. Store in history buffer
     *   6. Call error callback
     * 
     * USAGE:
     * @code
     *   ErrorHandler::getInstance().reportError(
     *       "SensorRead",
     *       "Timeout reading sensor",
     *       ErrorSeverity::ERROR
     *   );
     * @endcode
     */
    void reportError(const char* context, const char* message, 
                     ErrorSeverity severity = ErrorSeverity::ERROR) {
        
        // FILTER: Check severity
        if (filter_enabled_ && severity < min_severity_) {
            filtered_count_++;
            return;
        }

        // THROTTLE: Check rate limit
        if (isThrottled(context)) {
            throttled_count_++;
            return;
        }

        // DEDUPLICATION: Check duplicate
        if (isDuplicate(context, message)) {
            duplicate_count_++;
            return;
        }

        // Report error
        total_errors_++;
        last_error_time_ = millis();

        switch (severity) {
            case ErrorSeverity::INFO: info_count_++; break;
            case ErrorSeverity::WARNING: warning_count_++; break;
            case ErrorSeverity::ERROR: error_count_++; break;
            case ErrorSeverity::CRITICAL: critical_count_++; break;
        }

        ErrorInfo info(context, message, severity);
        info.timestamp = last_error_time_;
        info.error_code = total_errors_;
        
        StaticString<128> stack_str = getContextStack();
        if (!stack_str.empty()) {
            strncpy(info.context_stack, stack_str.c_str(), sizeof(info.context_stack) - 1);
            info.context_stack[sizeof(info.context_stack) - 1] = '\0';
            strncat(info.context_stack, " > ", sizeof(info.context_stack) - strlen(info.context_stack) - 1);
        }
        strncat(info.context_stack, context, sizeof(info.context_stack) - strlen(info.context_stack) - 1);

        error_history_[history_index_] = info;
        history_index_ = (history_index_ + 1) % HISTORY_SIZE;
        if (history_count_ < HISTORY_SIZE) history_count_++;

        if (error_callback_) {
            error_callback_(info);
        }

        // Dispatch to registered policies
        dispatchToPolicies(info);
    }

    // === STATISTICS GETTERS ===
    
    /** @brief Get total error count (all severities) */
    uint32_t getTotalErrors() const { return total_errors_; }
    
    /** @brief Get count of filtered errors (below severity threshold) */
    uint32_t getFilteredCount() const { return filtered_count_; }
    
    /** @brief Get count of throttled errors (rate limited) */
    uint32_t getThrottledCount() const { return throttled_count_; }
    
    /** @brief Get count of deduplicated errors (repeated) */
    uint32_t getDuplicateCount() const { return duplicate_count_; }
    
    /** @brief Get timestamp of last error (millis) */
    unsigned long getLastErrorTime() const { return last_error_time_; }

    /** @brief Get count of INFO severity errors */
    uint32_t getInfoCount() const { return info_count_; }
    
    /** @brief Get count of WARNING severity errors */
    uint32_t getWarningCount() const { return warning_count_; }
    
    /** @brief Get count of ERROR severity errors */
    uint32_t getErrorCount() const { return error_count_; }
    
    /** @brief Get count of CRITICAL severity errors */
    uint32_t getCriticalCount() const { return critical_count_; }

    /**
     * @brief Reset all statistics and history
     * 
     * EFFECT: Clears all counters and history buffer
     * USE CASE: Start fresh after test phase or error recovery
     */
    void resetStats() {
        total_errors_ = 0;
        filtered_count_ = 0;
        throttled_count_ = 0;
        duplicate_count_ = 0;
        last_error_time_ = 0;
        warning_count_ = 0;
        error_count_ = 0;
        critical_count_ = 0;
        info_count_ = 0;
        history_index_ = 0;
        history_count_ = 0;
    }

    /**
     * @brief Get error history buffer
     * @param count Output parameter for number of errors in history
     * @return Pointer to history array (circular buffer)
     * 
     * NOTE: History contains last N errors (max 10)
     * 
     * USAGE:
     * @code
     *   size_t count;
     *   const ErrorInfo* history = handler.getErrorHistory(count);
     *   for (size_t i = 0; i < count; i++) {
     *       Serial.printf("%s: %s\n", history[i].context, history[i].message);
     *   }
     * @endcode
     */
    const ErrorInfo* getErrorHistory(size_t& count) const {
        count = history_count_;
        return error_history_;
    }

    /**
     * @brief Print error history to Serial
     * 
     * FORMAT: [timestamp] [severity] context: message
     * USE CASE: Quick debugging, display last errors
     */
    void printErrorHistory() const {
        Serial.println("\n=== Error History ===");
        if (history_count_ == 0) {
            Serial.println("  No errors recorded");
            return;
        }
        
        size_t start = (history_count_ < HISTORY_SIZE) ? 0 : history_index_;
        for (size_t i = 0; i < history_count_ && i < HISTORY_SIZE; i++) {
            size_t idx = (start + i) % HISTORY_SIZE;
            const ErrorInfo& err = error_history_[idx];
            
            const char* sev = 
                err.severity == ErrorSeverity::CRITICAL ? "CRIT" :
                err.severity == ErrorSeverity::ERROR ? "ERR " :
                err.severity == ErrorSeverity::WARNING ? "WARN" : "INFO";
            
            Serial.printf("  [%lu] [%s] %s: %s\n", 
                err.timestamp, sev, err.context, err.message);
        }
        Serial.println("=====================\n");
    }

    /**
     * @brief Assert condition (for unit testing)
     * @param condition Condition to check
     * @param context Test context name
     * @param message Error message if condition fails
     * 
     * EFFECT: Reports CRITICAL error if condition is false
     * USE CASE: Unit testing, validation
     * 
     * USAGE:
     * @code
     *   handler.assertCondition(value > 0, "TestPositive", "Value must be positive");
     * @endcode
     */
    void assertCondition(bool condition, const char* context, const char* message) {
        if (!condition) {
            reportError(context, message, ErrorSeverity::CRITICAL);
        }
    }

    /**
     * @brief Assert equality (for unit testing)
     * @param expected Expected value
     * @param actual Actual value
     * @param context Test context name
     * @param message Error message if values don't match
     * 
     * EFFECT: Reports CRITICAL error with both values if not equal
     * USE CASE: Unit testing, validation
     * 
     * USAGE:
     * @code
     *   handler.assertEqual(5, result, "TestCalc", "Calculation result mismatch");
     * @endcode
     */
    void assertEqual(int expected, int actual, const char* context, const char* message) {
        if (expected != actual) {
            char buf[128];
            snprintf(buf, sizeof(buf), "%s (expected: %d, actual: %d)", message, expected, actual);
            reportError(context, buf, ErrorSeverity::CRITICAL);
        }
    }

private:
    /** @brief Maximum errors in history buffer (circular) */
    static constexpr size_t HISTORY_SIZE = 10;

    /**
     * @brief Private constructor (Singleton pattern)
     * 
     * INITIALIZATION:
     *   - All counters set to 0
     *   - No filter/throttle/dedup enabled by default
     *   - History buffer empty
     */
    ErrorHandler() 
        : total_errors_(0)
        , filtered_count_(0)
        , throttled_count_(0)
        , duplicate_count_(0)
        , last_error_time_(0)
        , error_callback_(nullptr)
        , filter_enabled_(false)
        , min_severity_(ErrorSeverity::INFO)
        , dedup_enabled_(false)
        , dedup_window_(5000)
        , warning_count_(0)
        , error_count_(0)
        , critical_count_(0)
        , info_count_(0)
        , history_index_(0)
        , history_count_(0) {}

    /**
     * @brief Check if error should be throttled
     * @param context Context name
     * @return true if throttled (skip), false if allowed
     * 
     * LOGIC: Check last error time for this context
     */
    bool isThrottled(const char* context) {
        uint32_t key = fnv1a_hash(context);
        auto it = throttle_map_.find(key);
        if (it == nullptr) {
            return false;
        }

        unsigned long now = millis();
        if (now - it->last_time < it->interval) {
            return true;
        }

        it->last_time = now;
        return false;
    }

    /**
     * @brief Check if error is duplicate
     * @param context Context name
     * @param message Error message
     * @return true if duplicate (skip), false if unique
     * 
     * LOGIC: Check if same context+message occurred within dedup window
     */
    bool isDuplicate(const char* context, const char* message) {
        if (!dedup_enabled_) return false;

        uint32_t key = fnv1a_hash(context, message);
        unsigned long now = millis();

        auto it = dedup_map_.find(key);
        if (it != nullptr) {
            if (now - *it < dedup_window_) {
                return true;
            }
        }

        dedup_map_[key] = now;
        return false;
    }

    /**
     * @struct ThrottleInfo
     * @brief Throttling state for a context
     */
    struct ThrottleInfo {
        unsigned long last_time;    ///< Last error timestamp
        unsigned long interval;     ///< Minimum interval between errors
    };

    // === MEMBER VARIABLES ===
    
    uniuno::FastFunction<void(const ErrorInfo&)> error_callback_;  ///< User error callback
    SmallVector<IErrorPolicy*, 4> policies_;                ///< Registered error policies (Observer pattern)
    
    // Statistics
    uint32_t total_errors_;         ///< Total errors reported
    uint32_t filtered_count_;       ///< Errors filtered by severity
    uint32_t throttled_count_;      ///< Errors throttled by rate limit
    uint32_t duplicate_count_;      ///< Errors deduplicated
    unsigned long last_error_time_; ///< Timestamp of last error
    
    // Context stack
    StaticArray<const char*, 10> context_stack_;  ///< Nested context names
    
    // Filtering
    bool filter_enabled_;           ///< Is severity filter active?
    ErrorSeverity min_severity_;    ///< Minimum severity to report
    
    // Throttling
    StaticHashMap<uint32_t, ThrottleInfo, 16> throttle_map_;  ///< Per-context throttle state
    
    // Deduplication
    bool dedup_enabled_;            ///< Is deduplication active?
    unsigned long dedup_window_;    ///< Deduplication time window (ms)
    StaticHashMap<uint32_t, unsigned long, 16> dedup_map_;  ///< Last occurrence time

    // Severity statistics
    uint32_t warning_count_;        ///< Count of WARNING errors
    uint32_t error_count_;          ///< Count of ERROR errors
    uint32_t critical_count_;       ///< Count of CRITICAL errors
    uint32_t info_count_;           ///< Count of INFO errors

    // History buffer (circular)
    ErrorInfo error_history_[HISTORY_SIZE];  ///< Last N errors
    size_t history_index_;          ///< Current write position
    size_t history_count_;          ///< Number of errors in history
};

// === MACROS ===

/**
 * @def SAFE_EXECUTE
 * @brief Execute code safely with exception handling
 * @param context Context name for error reporting
 * @param code Code block to execute
 * 
 * USAGE:
 * @code
 *   SAFE_EXECUTE("Init", {
 *       initSensor();
 *       initNetwork();
 *   });
 * @endcode
 */
#define SAFE_EXECUTE(context, code) \
    ErrorHandler::safe([&]() { code }, context)

/**
 * @def ERROR_ASSERT
 * @brief Assert condition in tests
 * @param condition Boolean condition to check
 * @param message Error message if fails
 * 
 * EFFECT: Reports CRITICAL error if condition is false
 * 
 * USAGE:
 * @code
 *   ERROR_ASSERT(sensor_value > 0, "Sensor value must be positive");
 * @endcode
 */
#define ERROR_ASSERT(condition, message) \
    ErrorHandler::getInstance().assertCondition((condition), __FUNCTION__, message)

/**
 * @def ERROR_ASSERT_EQ
 * @brief Assert equality in tests
 * @param expected Expected value
 * @param actual Actual value
 * @param message Error message if not equal
 * 
 * EFFECT: Reports CRITICAL error with both values if not equal
 * 
 * USAGE:
 * @code
 *   ERROR_ASSERT_EQ(5, calculate(), "Calculation result mismatch");
 * @endcode
 */
#define ERROR_ASSERT_EQ(expected, actual, message) \
    ErrorHandler::getInstance().assertEqual((expected), (actual), __FUNCTION__, message)

/**
 * @class ErrorContextGuard
 * @brief RAII guard for automatic context push/pop
 * 
 * PATTERN: RAII (Resource Acquisition Is Initialization)
 * BENEFIT: Automatic cleanup, exception-safe
 * 
 * USAGE:
 * @code
 *   void initSensor() {
 *       ErrorContextGuard guard("SensorInit");
 *       // ... operations ...
 *       // Context automatically popped when guard goes out of scope
 *   }
 * @endcode
 * 
 * OR use ERROR_CONTEXT macro:
 * @code
 *   void initSensor() {
 *       ERROR_CONTEXT("SensorInit");
 *       // ... operations ...
 *   }
 * @endcode
 */
class ErrorContextGuard {
public:
    /** @brief Constructor - push context */
    explicit ErrorContextGuard(const char* context) {
        ErrorHandler::pushContext(context);
    }
    
    /** @brief Destructor - pop context (automatic cleanup) */
    ~ErrorContextGuard() {
        ErrorHandler::popContext();
    }
};

/**
 * @def ERROR_CONTEXT
 * @brief Automatic context guard (RAII)
 * @param name Context name
 * 
 * BENEFIT: Automatic push/pop, exception-safe
 * 
 * USAGE:
 * @code
 *   void processData() {
 *       ERROR_CONTEXT("DataProcessing");
 *       // ... operations ...
 *       // Context automatically popped at end of scope
 *   }
 * @endcode
 */

#define ERROR_CONTEXT_CONCAT_IMPL(a, b) a##b
#define ERROR_CONTEXT_CONCAT(a, b) ERROR_CONTEXT_CONCAT_IMPL(a, b)
#define ERROR_CONTEXT(name) \
    ErrorContextGuard ERROR_CONTEXT_CONCAT(__ctx_, __COUNTER__)(name)

} // namespace uniuno

#include "Core/Error/ErrorPolicy.h"

namespace uniuno {

inline void ErrorHandler::registerPolicy(IErrorPolicy* policy) {
    policies_.push_back(std::move(policy));
}

inline void ErrorHandler::dispatchToPolicies(const ErrorInfo& info) {
    for (size_t i = 0; i < policies_.size(); i++) {
        policies_[i]->handle(info);
    }
}

} // namespace uniuno
