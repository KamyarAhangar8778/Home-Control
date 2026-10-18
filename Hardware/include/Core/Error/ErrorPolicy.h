/**
 * @file ErrorPolicy.h
 * @brief Error handling policies and strategies
 * @author uniuno
 * 
 * PURPOSE: Define how errors should be handled
 * PATTERN: Strategy Pattern
 * 
 * EXTENSIBILITY: Add custom policies easily
 */

#pragma once

#include "ErrorHandler.h"

namespace uniuno {

/**
 * @class IErrorPolicy
 * @brief Interface for error handling policies
 * 
 * PATTERN: Strategy Pattern
 * BENEFIT: Extensible error handling
 */
class IErrorPolicy {
public:
    virtual ~IErrorPolicy() = default;
    
    /**
     * @brief Handle error according to policy
     * @param info Error information
     * @return true if error handled, false if should propagate
     */
    virtual bool handle(const ErrorInfo& info) = 0;
};

/**
 * @class LogOnlyPolicy
 * @brief Log errors but continue execution
 * 
 * USE CASE: Development, non-critical errors
 */
class LogOnlyPolicy : public IErrorPolicy {
public:
    bool handle(const ErrorInfo& info) override {
        // Just log, don't stop
        return true;  // Error handled
    }
};

/**
 * @class RetryPolicy
 * @brief Retry operation on error
 * 
 * USE CASE: Network operations, sensor reading
 */
class RetryPolicy : public IErrorPolicy {
private:
    uint8_t max_retries_;
    uint8_t retry_count_;

public:
    explicit RetryPolicy(uint8_t max_retries = 3) 
        : max_retries_(max_retries), retry_count_(0) {}
    
    bool handle(const ErrorInfo& info) override {
        retry_count_++;
        
        if (retry_count_ < max_retries_) {
            // Retry
            return false;  // Not handled, retry
        }
        
        // Max retries reached
        retry_count_ = 0;
        return true;  // Give up
    }
    
    void reset() {
        retry_count_ = 0;
    }
};

/**
 * @class ThresholdPolicy
 * @brief Take action after N errors
 * 
 * USE CASE: System stability, auto-restart
 */
class ThresholdPolicy : public IErrorPolicy {
private:
    uint32_t threshold_;
    uint32_t error_count_;
    uniuno::FastFunction<void()> action_;

public:
    ThresholdPolicy(uint32_t threshold, uniuno::FastFunction<void()> action)
        : threshold_(threshold), error_count_(0), action_(std::move(action)) {}
    
    bool handle(const ErrorInfo& info) override {
        error_count_++;
        
        if (error_count_ >= threshold_ && action_) {
            action_();  // Execute action (e.g., restart)
            error_count_ = 0;
        }
        
        return true;
    }
    
    void reset() {
        error_count_ = 0;
    }
};

/**
 * @class SeverityPolicy
 * @brief Handle based on severity
 * 
 * USE CASE: Different actions for different severities
 */
class SeverityPolicy : public IErrorPolicy {
private:
    uniuno::FastFunction<void(const ErrorInfo&)> warning_handler_;
    uniuno::FastFunction<void(const ErrorInfo&)> error_handler_;
    uniuno::FastFunction<void(const ErrorInfo&)> critical_handler_;

public:
    void onWarning(uniuno::FastFunction<void(const ErrorInfo&)> handler) {
        warning_handler_ = std::move(handler);
    }
    
    void onError(uniuno::FastFunction<void(const ErrorInfo&)> handler) {
        error_handler_ = std::move(handler);
    }
    
    void onCritical(uniuno::FastFunction<void(const ErrorInfo&)> handler) {
        critical_handler_ = std::move(handler);
    }
    
    bool handle(const ErrorInfo& info) override {
        switch (info.severity) {
            case ErrorSeverity::WARNING:
                if (warning_handler_) warning_handler_(info);
                break;
            case ErrorSeverity::ERROR:
                if (error_handler_) error_handler_(info);
                break;
            case ErrorSeverity::CRITICAL:
                if (critical_handler_) critical_handler_(info);
                break;
            default:
                break;
        }
        return true;
    }
};

} // namespace uniuno
