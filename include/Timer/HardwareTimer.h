/**
 * @file HardwareTimer.h
 * @brief Hardware timer integration for ESP32 using esp_timer
 * @author uniuno
 * 
 * PURPOSE: Use ESP32 high-resolution timers (esp_timer) to run tick() automatically
 * BENEFIT: ~0% CPU usage for polling in main loop(), thread-safe, microsecond precision
 * 
 * ARCHITECTURE:
 *   - Uses ESP-IDF's esp_timer component
 *   - Runs in the high-priority esp_timer task context (thread context)
 *   - Safe to execute user callbacks (e.g. Serial, cache access)
 */

#pragma once

#include "TimerConfig.h"
#include "TimerCore.h"

class ITimer;

#ifdef ARDUINO
#include <esp_timer.h>
#endif

namespace uniuno {

/**
 * @class HardwareTimerTrigger
 * @brief Uses ESP32 high-resolution timer to trigger tick() automatically
 * 
 * DESIGN: Singleton - only one hardware timer needed
 * BENEFIT: Eliminates need to call tick() in loop() safely
 */
class HardwareTimerTrigger {
public:
    /**
     * @brief Get singleton instance reference (Meyers Singleton)
     */
    static HardwareTimerTrigger& getInstance() {
        static HardwareTimerTrigger instance;
        return instance;
    }

    /**
     * @brief Start hardware timer to trigger tick()
     * @param timer Pointer to Timer instance
     * @param interval_us Interval in microseconds (default: 1000 = 1ms)
     * @return true if started successfully
     */
    static bool start(ITimer* timer, uint64_t interval_us = 1000) {
        HardwareTimerTrigger& instance = getInstance();
        if (instance.running_) {
            return false;  // Already running
        }
        
        instance.timer_ = timer;
        instance.interval_us_ = interval_us;
        
        return instance.initHardwareTimer();
    }

    /**
     * @brief Stop hardware timer
     */
    static void stop() {
        getInstance().stopHardwareTimer();
    }

    /**
     * @brief Check if hardware timer is running
     */
    static bool isRunning() {
        return getInstance().running_;
    }

    /**
     * @brief Get interval
     */
    static uint64_t getInterval() {
        return getInstance().interval_us_;
    }

    /**
     * @brief Restart with new interval
     */
    static bool restart(ITimer* timer, uint64_t interval_us) {
        stop();
        return start(timer, interval_us);
    }

private:
    HardwareTimerTrigger() 
        : timer_(nullptr)
        , interval_us_(1000)
        , running_(false)
#ifdef ARDUINO
        , timer_handle_(nullptr)
#endif
    {}

    ~HardwareTimerTrigger() {
        stop();
    }

    HardwareTimerTrigger(const HardwareTimerTrigger&) = delete;
    HardwareTimerTrigger& operator=(const HardwareTimerTrigger&) = delete;

    ITimer* timer_;
    uint64_t interval_us_;
    volatile bool running_;
#ifdef ARDUINO
    esp_timer_handle_t timer_handle_;
#endif

    bool initHardwareTimer() {
#ifdef ARDUINO
        esp_timer_create_args_t timer_args = {
            .callback = [](void* arg) {
                (void)arg;
                getInstance().handleCallback();
            },
            .arg = nullptr,
            .dispatch_method = ESP_TIMER_TASK,
            .name = "timer_tick",
            .skip_unhandled_events = true
        };

        esp_err_t err = esp_timer_create(&timer_args, &timer_handle_);
        if (err != ESP_OK) {
            return false;
        }

        err = esp_timer_start_periodic(timer_handle_, interval_us_);
        if (err != ESP_OK) {
            esp_timer_delete(timer_handle_);
            timer_handle_ = nullptr;
            return false;
        }

        running_ = true;
        return true;
#else
        // Fallback for non-ESP32 platforms
        running_ = true;
        return true;
#endif
    }

    void stopHardwareTimer() {
#ifdef ARDUINO
        if (timer_handle_ != nullptr) {
            esp_timer_stop(timer_handle_);
            esp_timer_delete(timer_handle_);
            timer_handle_ = nullptr;
        }
#endif
        running_ = false;
    }

    void handleCallback();
};

// Define handleCallback here since Timer is a complete type when included in Timer.h
inline void HardwareTimerTrigger::handleCallback() {
    if (timer_) {
        timer_->tick();
    }
}

} // namespace uniuno