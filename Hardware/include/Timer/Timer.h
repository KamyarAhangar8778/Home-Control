/**
 * @file Timer.h
 * @brief Modular non-blocking timer library for ESP32/Arduino
 * @author uniuno
 * @version 3.0
 * 
 * @details
 * ARCHITECTURE: Facade Pattern with Single Responsibility Principle
 *
 * This file acts as a FACADE - it delegates work to specialized components:
 *   - TimerCore:      Time source management
 *   - TimerManager:   Pool + active/paused queues + O(1) id lookup
 *
 * WHY THIS REFACTOR:
 *   - Each class has ONE responsibility
 *   - Easier to test each component independently
 *   - Better code organization
 *   - Easier to extend and maintain
 * 
 * LAMBDA SYNTAX GUIDE:
 * @code
 *   // Basic lambda (no capture)
 *   timer.set_timeout([]() { Serial.println("Hello"); }, 1000);
 *   //                 ││
 *   //                 │└─ (): Parameters (empty for Timer callbacks)
 *   //                 └── []: Capture clause (variables from outside)
 *   
 *   // Capture by reference [&] - can modify variables
 *   int counter = 0;
 *   timer.set_timeout([&]() { counter++; }, 1000);
 *   
 *   // Capture by value [=] - read-only copy
 *   int value = 10;
 *   timer.set_timeout([=]() { Serial.println(value); }, 1000);
 *   
 *   // Capture specific variables [var1, &var2]
 *   int led = 2;
 *   timer.set_timeout([led]() { digitalWrite(led, HIGH); }, 1000);
 * @endcode
 * 
 * USAGE EXAMPLES:
 * @code
 *   Timer timer;
 *   
 *   // Simple timeout
 *   timer.set_timeout([]() { Serial.println("Hello"); }, 1000);
 *   
 *   // Timeout with external variable
 *   int ledPin = 2;
 *   timer.set_timeout([ledPin]() { 
 *     digitalWrite(ledPin, HIGH); 
 *   }, seconds(5));
 *   
 *   // Interval with counter
 *   int count = 0;
 *   timer.set_interval([&count]() { 
 *     Serial.printf("Tick %d\n", count++);
 *   }, 1000);
 *   
 *   void loop() {
 *     timer.tick();  // Must call in loop!
 *   }
 * @endcode
 */

#pragma once

#include "Timer/TimerConfig.h"
#include "Timer/TimerCore.h"
#include "Timer/ITimer.h"
#include "Timer/TimerTypes.h"
#include "Timer/TimerHandle.h"
#include "Timer/TimerUnits.h"
#include "Timer/Optimization/TimerAsm.h"
#include "Optimization/CompilerTraits.h"

#ifdef TIMER_EVENTS_ENABLED
#include "Events/EventDispatcher.h"
#endif

#include "Timer/TimerManager.h"
#include "Timer/TimerFeatures.h"

#ifdef TIMER_ENABLE_GROUPS
#include "Optimization/StaticArray.h"
#include "Optimization/StaticHashMap.h"
#include <cstring>
#endif

#ifndef ARDUINO
#include <native/millis.hpp>
#endif

// Forward declare EventDispatcher if events are enabled
#if defined(TIMER_EVENT_CREATED) || defined(TIMER_EVENT_EXPIRED) || \
    defined(TIMER_EVENT_CANCELLED) || defined(TIMER_EVENT_RESCHEDULED) || \
    defined(TIMER_EVENT_TICK)
  #ifndef TIMER_EVENTS_ENABLED
    #define TIMER_EVENTS_ENABLED
  #endif
#endif

namespace uniuno {


/**
 * @class Timer
 * @brief Facade for timer management system
 * 
 * RESPONSIBILITY: Provide unified API and delegate to specialized managers
 * PATTERN: Facade Pattern
 */
template <size_t MaxTimers = 32>
class TimerBase : public ITimer {
public:
  /**
   * @brief Constructor with feature configuration (REQUIRED)
   * @param features Feature configuration struct
   * @param getNowInMS Time source function pointer (default: millis)
   * @param dispatcher Optional EventDispatcher for event notifications
   * 
   * IMPORTANT: User MUST specify features explicitly
   * 
   * USAGE:
   * @code
   *   TimerFeatures features;
   *   features.timeout = true;
   *   features.interval = true;
   *   Timer timer(features);
   * @endcode
   */
  TimerBase(const TimerFeatures& features,
        unsigned long (*getNowInMS)() = millis,
        EventDispatcher* dispatcher = nullptr)
    : core_(getNowInMS)
    , dispatcher_(dispatcher)
    , manager_(&core_, dispatcher)
  {
    // NOTE: TimerFeatures has no runtime effect. Feature selection
    // is done at compile-time via #define flags in TimerConfig.h.
    (void)features;
  }

  // ============================================
  // TIMEOUT FEATURE
  // ============================================

  // ============================================
  // TIMEOUT FEATURE
  // ============================================
#ifdef TIMER_ENABLE_TIMEOUT
  /**
   * @brief Schedule one-time callback (ID-based)
   * @param callback Lambda function to execute
   * @param timeout_ms Delay in milliseconds
   * @return Timer ID
   * 
   * LAMBDA SYNTAX:
   * @code
   *   // No capture (no external variables)
   *   timer.set_timeout([]() { Serial.println("Done"); }, 1000);
   *   
   *   // Capture by reference [&] (can modify)
   *   int counter = 0;
   *   timer.set_timeout([&]() { counter++; }, 1000);
   *   
   *   // Capture by value [=] (read-only)
   *   int value = 10;
   *   timer.set_timeout([=]() { Serial.println(value); }, 1000);
   *   
   *   // Capture specific [var1, &var2]
   *   int led = 2;
   *   timer.set_timeout([led]() { digitalWrite(led, HIGH); }, 1000);
   * @endcode
   */


  /**
   * @brief Schedule one-time callback (Handle-based)
   * @param callback Function to execute
   * @param timeout_ms Delay in milliseconds
   * @return TimerHandle for management
   */
  TimerHandle setTimeout(TimerCallback<void()> callback,
                         unsigned long timeout_ms) {
    TimerId id = manager_.add_timeout(std::move(callback), timeout_ms);
    return TimerHandle(this, id, false);
  }
#endif

  // ============================================
  // IMMEDIATE FEATURE
  // ============================================
#ifdef TIMER_ENABLE_IMMEDIATE
  /**
   * @brief Execute callback on next tick (ID-based)
   */


  /**
   * @brief Execute callback on next tick (Handle-based)
   */
  TimerHandle setImmediate(TimerCallback<void()> callback) {
    TimerId id = manager_.add_timeout(std::move(callback), 0);
    return TimerHandle(this, id, false);
  }
#endif

  // ============================================
  // INTERVAL FEATURE
  // ============================================
#ifdef TIMER_ENABLE_INTERVAL
  /**
   * @brief Schedule recurring callback (ID-based)
   * @param callback Lambda function to execute repeatedly
   * @param interval_ms Time between executions
   * @return Timer ID
   * 
   * LAMBDA SYNTAX:
   * @code
   *   // Simple interval
   *   timer.set_interval([]() { Serial.println("Tick"); }, 1000);
   *   
   *   // With counter (capture by reference)
   *   int count = 0;
   *   timer.set_interval([&count]() { 
   *     Serial.printf("Count: %d\n", count++);
   *   }, 1000);
   *   
   *   // Toggle LED (capture by value)
   *   int led = 2;
   *   bool state = false;
   *   timer.set_interval([led, &state]() { 
   *     state = !state;
   *     digitalWrite(led, state);
   *   }, 500);
   * @endcode
   */

  
  /**
   * @brief Schedule recurring callback with repeat count (ID-based)
   * @param callback Lambda function to execute
   * @param interval_ms Time between executions
   * @param repeat_count Number of times to repeat (0 = infinite)
   * @return Timer ID
   * 
   * USAGE:
   * @code
   *   // Repeat 5 times only
   *   timer.set_interval([]() { Serial.println("Tick"); }, 1000, 5);
   * @endcode
   */


  /**
   * @brief Schedule recurring callback (Handle-based)
   * @param callback Function to execute repeatedly
   * @param interval_ms Time between executions
   * @return TimerHandle for management
   */
  TimerHandle setInterval(TimerCallback<void()> callback,
                          unsigned long interval_ms) {
    TimerId id = manager_.add_interval(std::move(callback), interval_ms);
    return TimerHandle(this, id, true);
  }
  
  /**
   * @brief Schedule recurring callback with repeat count (Handle-based)
   * @param callback Function to execute
   * @param interval_ms Time between executions
   * @param repeat_count Number of times to repeat (0 = infinite)
   * @return TimerHandle for management
   */
  TimerHandle setInterval(TimerCallback<void()> callback,
                          unsigned long interval_ms,
                          int repeat_count) {
    TimerId id = manager_.add_interval(std::move(callback), interval_ms, repeat_count);
    return TimerHandle(this, id, true);
  }
#endif

  // ============================================
  // CLEAR FEATURE
  // ============================================
#ifdef TIMER_ENABLE_CLEAR
  #ifdef TIMER_ENABLE_TIMEOUT
  /**
   * @brief Cancel scheduled timeout
   * @param timeoutId ID returned by set_timeout()
   */
  void clear_timeout(TimerId timeoutId) {
    manager_.remove(timeoutId);
  }
  #endif

  #ifdef TIMER_ENABLE_INTERVAL
  /**
   * @brief Stop recurring interval
   * @param interval_id ID returned by set_interval()
   */
  void clear_interval(TimerId interval_id) {
    manager_.remove(interval_id);
  }
  #endif
#endif

  // ============================================
  // INTERVAL_UNTIL FEATURE
  // ============================================
#ifdef TIMER_ENABLE_INTERVAL_UNTIL
  TimerHandle set_interval_until(TimerCallback<bool()> callback,
                                  unsigned long interval_ms,
                                  TimerCallback<void()> on_timeout,
                                  unsigned long timeout_ms) {
    TimerId id = manager_.add_interval_until_with_timeout(std::move(callback), interval_ms, std::move(on_timeout), timeout_ms);
    return TimerHandle(this, id, true);
  }

  TimerHandle set_interval_until(TimerCallback<bool()> callback,
                                  unsigned long interval_ms) {
    TimerId id = manager_.add_interval_until(std::move(callback), interval_ms);
    return TimerHandle(this, id, true);
  }
#endif

  // ============================================
  // CORE FUNCTIONS - ASSEMBLY OPTIMIZED
  // ============================================

  /**
   * @brief Main tick function - ASSEMBLY OPTIMIZED
   * 
   * OPTIMIZATION STRATEGY:
   *   1. Cache time once (eliminate redundant millis() calls)
   *   2. Keep cached_time in register a3 across calls
   *   3. Inline process calls with register hints
   * 
   * BEFORE: 2 millis() calls + stack operations
   * AFTER: 1 millis() call + register-only operations
   * SPEED GAIN: 1.5-2x faster
   * 
   * ASSEMBLY BENEFIT:
   *   - cached_time stays in register a3
   *   - No stack push/pop between process() calls
   *   - Branch prediction optimized
   */
  HOT_PATH void tick() {
    // Re-entrancy guard: prevents concurrent access when the hardware timer
    // (running from the esp_timer task / other core) and a manual tick() in
    // loop() are both active. The MEMORY_BARRIER() after the write forces the
    // guard to become globally visible before we touch the manager, so the
    // other core sees the flag set in time. Without it the compiler/CPU could
    // reorder the write after the process() call.
    if (UNLIKELY(tick_in_progress_)) return;
    
    // FAST PATH: Check if there are ANY active timers, and if the earliest one has expired.
    // This avoids calling millis() 99% of the time when nothing is scheduled,
    // and avoids the heavy process() loop if nothing has expired yet!
    unsigned long next_expiry;
    if (UNLIKELY(!manager_.getNextExpiry(next_expiry))) return; // Queue empty!
    
    unsigned long cached_time = core_.now();
    if (LIKELY(!uniuno::asm_opt::is_timer_expired(cached_time, next_expiry))) return; // Nothing expired!

    tick_in_progress_ = true;
    MEMORY_BARRIER();

#ifdef TIMER_EVENT_TICK
    dispatch_tick_event();
#endif

    asm_opt::fast_process_call(&manager_, cached_time);

    MEMORY_BARRIER();
    tick_in_progress_ = false;
  }

  /**
   * @brief Get current time from core
   * @return Current time in milliseconds
   *
   * FORCE_INLINE: trivially small and on user hot paths (polling loops). Inlining
   * removes the call overhead entirely.
   */
  FORCE_INLINE unsigned long now() const {
    return core_.now();
  }

  // ============================================
  // HARDWARE TIMER FEATURE
  // ============================================

  /**
   * @brief Start hardware timer for automatic tick()
   * @param interval_us Interval in microseconds (default: 1000 = 1ms)
   * @return true if started successfully
   * 
   * USAGE:
   * @code
   *   Timer timer(features);
   *   timer.startHardwareTimer(1000);  // tick() every 1ms
   *   
   *   void loop() {
   *     // No timer.tick() needed!
   *   }
   * @endcode
   */
  bool startHardwareTimer(uint64_t interval_us = 1000);

  /**
   * @brief Stop hardware timer
   */
  void stopHardwareTimer();

  /**
   * @brief Check if hardware timer is running
   */
  bool isHardwareTimerActive() const {
    return hw_timer_active_;
  }

  // ============================================
  // PAUSE/RESUME FEATURE
  // ============================================

  /**
   * @brief Pause a timer by ID
   * @param id Timer ID to pause
   * @return true if found and paused
   * 
   * USAGE:
   * @code
   *   unsigned int id = timer.set_timeout(callback, 5000);
   *   timer.pause(id);  // Pause after 2 seconds
   *   // ... later ...
   *   timer.resume(id);  // Resume from where it stopped
   * @endcode
   */
  bool pause(TimerId id) override {
    return manager_.pause(id);
  }

  bool resume(TimerId id) override {
    return manager_.resume(id);
  }

  bool isPaused(TimerId id) const override {
    return manager_.isPaused(id);
  }

  // ============================================
  // GROUPS FEATURE (Built-in)
  // ============================================
#ifdef TIMER_ENABLE_GROUPS
  /**
   * @brief Create a new timer group
   * @param name Group name
   * 
   * USAGE:
   * @code
   *   timer.createGroup("sensors");
   * @endcode
   */
  struct GroupEntry {
    char name[32];
    StaticArray<TimerId, MaxTimers> timer_ids;
  };

  static inline uint32_t hashString(const char* str) {
    uint32_t hash = 5381;
    while (int c = *str++) {
      hash = ((hash << 5) + hash) + c; // hash * 33 + c
    }
    return hash;
  }

  StaticHashMap<uint32_t, GroupEntry, 16> groups_;

  GroupEntry* findGroup(const char* name) {
    return groups_.find(hashString(name));
  }
  const GroupEntry* findGroup(const char* name) const {
    return groups_.find(hashString(name));
  }
  void createGroup(const char* name);
  void addToGroup(const char* name, TimerId id);
  void addToGroup(const char* name, TimerHandle handle);
  size_t pauseGroup(const char* name);
  size_t resumeGroup(const char* name);
  size_t clearGroup(const char* name);
  bool removeFromGroup(const char* name, TimerId id);
  bool removeGroup(const char* name);
  size_t groupSize(const char* name) const;
  bool hasGroup(const char* name) const;
#endif

#ifdef TIMER_EVENTS_ENABLED
  // ============================================
  // EVENT HELPER METHODS
  // ============================================

  #ifdef TIMER_EVENT_CREATED
  void onCreated(void (*callback)(TimerCreatedEvent*)) {
    if (dispatcher_) {
      dispatcher_->on<TimerCreatedEvent>(callback);
    }
  }
  #endif

  #ifdef TIMER_EVENT_EXPIRED
  void onExpired(void (*callback)(TimerExpiredEvent*)) {
    if (dispatcher_) {
      dispatcher_->on<TimerExpiredEvent>(callback);
    }
  }
  #endif

  #ifdef TIMER_EVENT_CANCELLED
  void onCancelled(void (*callback)(TimerCancelledEvent*)) {
    if (dispatcher_) {
      dispatcher_->on<TimerCancelledEvent>(callback);
    }
  }
  #endif

  #ifdef TIMER_EVENT_RESCHEDULED
  void onRescheduled(void (*callback)(TimerRescheduledEvent*)) {
    if (dispatcher_) {
      dispatcher_->on<TimerRescheduledEvent>(callback);
    }
  }
  #endif

  #ifdef TIMER_EVENT_TICK
  void onTick(void (*callback)(TimerTickEvent*)) {
    if (dispatcher_) {
      dispatcher_->on<TimerTickEvent>(callback);
    }
  }
  #endif
#endif

private:
  TimerCore core_;                    ///< Time source manager
  EventDispatcher* dispatcher_;       ///< Event dispatcher
  volatile bool hw_timer_active_ = false;     ///< Hardware timer status
  volatile bool tick_in_progress_ = false;   ///< Re-entrancy guard for tick()

  TimerManager<MaxTimers> manager_;              ///< Unified timer manager

// groups_ moved to public section as an array entry to keep implementation plan simple

#ifdef TIMER_EVENT_TICK
  void dispatch_tick_event() {
    if (dispatcher_) {
      TimerTickEvent event{core_.now(), (unsigned int)manager_.countTimeouts(), (unsigned int)manager_.countIntervals()};
      dispatcher_->dispatch(event);
    }
  }
#endif

  friend class TimerHandle;
};

class Timer : public TimerBase<32> {
public:
  using TimerBase<32>::TimerBase;
};

} // namespace uniuno

// ============================================
// Hardware Timer Declaration
// ============================================
#include "Timer/HardwareTimer.h"

// Include out-of-line modular implementations to maintain clean header structure
#include "Timer/TimerHandleImpl.h"
#include "Timer/TimerGroupsImpl.h"
#include "Timer/TimerHardwareImpl.h"
