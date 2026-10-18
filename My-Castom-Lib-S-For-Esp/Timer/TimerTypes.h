/**
 * @file TimerTypes.h
 * @brief Shared data structures for Timer library
 * @author uniuno
 * 
 * PURPOSE: Define common types and structures used across Timer components
 * MEMORY: Minimal overhead - only type definitions
 * 
 * REFACTORED: Uses composition for better extensibility
 */

#pragma once

#include "TimerConfig.h"

#include "Optimization/FastFunction.h"
template<typename Sig> using TimerCallback = uniuno::FastFunction<Sig>;

namespace uniuno {

/**
 * @struct TimerNode
 * @brief Unified timer structure representing timeouts, intervals, or custom timers
 */
struct TimerNode {
  unsigned int id;                 ///< Unique timer identifier
  unsigned long next_call_ms;      ///< Absolute time for next execution
  unsigned long interval_ms;       ///< Periodic interval (0 for one-shot timeout)
  TimerCallback<void()> callback;  ///< Callback function (returns void)
#ifdef TIMER_ENABLE_INTERVAL_UNTIL
  TimerCallback<bool()> until_callback; ///< Condition callback (returns true to stop)
  TimerCallback<void()> until_timeout_callback; ///< Callback on timeout
  unsigned long until_timeout_ms;  ///< Absolute time for timeout
#endif
  bool paused;                     ///< Pause state
  unsigned long remaining_ms;      ///< Remaining time when paused
  int repeat_count;                ///< Remaining repeats (-1 = infinite, positive values = repeats)
  bool is_interval;                ///< Type indicator (true = interval, false = timeout)
};

} // namespace uniuno

