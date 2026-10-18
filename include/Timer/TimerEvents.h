/**
 * @file TimerEvents.h
 * @brief Event definitions for Timer library
 * @author uniuno
 * 
 * PURPOSE: Define timer events for EventDispatcher integration
 * 
 * CONFIGURATION:
 *   Enable only events you need by defining flags before including Timer.h
 * 
 * USAGE:
 * @code
 *   // In your code, before #include <Timer.h>:
 *   #define TIMER_EVENT_CREATED
 *   #define TIMER_EVENT_EXPIRED
 *   #define TIMER_EVENT_CANCELLED
 *   
 *   #include <Timer.h>
 *   #include <EventDispatcher.h>
 *   
 *   EventDispatcher dispatcher;
 *   Timer timer(&dispatcher);
 *   
 *   dispatcher.on<TimerExpiredEvent>([](TimerExpiredEvent* e) {
 *     Serial.printf("Timer %d expired\n", e->timer_id);
 *   });
 * @endcode
 */

#include "TimerConfig.h"
#include "TimerTypes.h"

#pragma once

namespace uniuno {

// ============================================
// EVENT: Timer Created
// ============================================
#ifdef TIMER_EVENT_CREATED
/**
 * @struct TimerCreatedEvent
 * @brief Dispatched when a new timer is created
 * 
 * USE CASE: Monitoring, statistics, debugging
 */
struct TimerCreatedEvent {
  static constexpr const char* Name = "timer.created";
  
  TimerId timer_id;        ///< Unique timer ID
  unsigned long duration_ms;    ///< Timer duration in milliseconds
  bool is_interval;             ///< true = interval, false = timeout
};
#endif

// ============================================
// EVENT: Timer Expired
// ============================================
#ifdef TIMER_EVENT_EXPIRED
/**
 * @struct TimerExpiredEvent
 * @brief Dispatched when a timer expires and callback executes
 * 
 * USE CASE: Performance monitoring, drift analysis
 */
struct TimerExpiredEvent {
  static constexpr const char* Name = "timer.expired";
  
  TimerId timer_id;        ///< Timer ID that expired
  unsigned long scheduled_ms;   ///< When it was scheduled to run
  unsigned long actual_ms;      ///< When it actually ran
  long drift_ms;                ///< Drift (actual - scheduled)
  bool is_interval;             ///< true = interval, false = timeout
};
#endif

// ============================================
// EVENT: Timer Cancelled
// ============================================
#ifdef TIMER_EVENT_CANCELLED
/**
 * @struct TimerCancelledEvent
 * @brief Dispatched when a timer is cancelled before execution
 * 
 * USE CASE: Debugging, cleanup tracking
 */
struct TimerCancelledEvent {
  static constexpr const char* Name = "timer.cancelled";
  
  TimerId timer_id;        ///< Timer ID that was cancelled
  unsigned long remaining_ms;   ///< Time remaining before expiration
  bool is_interval;             ///< true = interval, false = timeout
};
#endif

// ============================================
// EVENT: Timer Rescheduled (Interval only)
// ============================================
#ifdef TIMER_EVENT_RESCHEDULED
/**
 * @struct TimerRescheduledEvent
 * @brief Dispatched when an interval timer is rescheduled
 * 
 * USE CASE: Interval monitoring, drift tracking
 */
struct TimerRescheduledEvent {
  static constexpr const char* Name = "timer.rescheduled";
  
  TimerId timer_id;        ///< Interval timer ID
  unsigned long next_call_ms;   ///< Next scheduled execution time
  unsigned long interval_ms;    ///< Interval duration
};
#endif

// ============================================
// EVENT: Timer Tick
// ============================================
#ifdef TIMER_EVENT_TICK
/**
 * @struct TimerTickEvent
 * @brief Dispatched on every tick() call
 * 
 * USE CASE: Performance profiling, tick monitoring
 * WARNING: High frequency - use carefully
 */
struct TimerTickEvent {
  static constexpr const char* Name = "timer.tick";
  
  unsigned long current_time;   ///< Current time in milliseconds
  unsigned int active_timeouts; ///< Number of active timeouts
  unsigned int active_intervals;///< Number of active intervals
};
#endif

} // namespace uniuno
