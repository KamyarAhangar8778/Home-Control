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
 * @struct TimerId
 * @brief Strongly typed timer identifier
 * Uses Generational Slot Map pattern for O(1) lookups:
 * [ 16 bits generation | 16 bits pool index ]
 */
struct TimerId {
  uint32_t value;

  bool operator==(const TimerId& other) const { return value == other.value; }
  bool operator!=(const TimerId& other) const { return value != other.value; }
  
  uint16_t getIndex() const { return value & 0xFFFF; }
  uint16_t getGeneration() const { return (value >> 16) & 0xFFFF; }
};

static const TimerId INVALID_TIMER_ID = {0};

/**
 * @enum TimerState
 * @brief Lifecycle state of a TimerNode.
 *
 * Replaces the old single `paused` bool with an explicit state machine so that
 * the "callback currently executing" case (Processing) is first-class. This is
 * what lets pause()/remove() be called safely from *inside* a timer's own
 * callback without the reentrancy bug the old code had.
 */
enum class TimerState : uint8_t {
  Inactive   = 0,  ///< In the free pool (not scheduled)
  Active     = 1,  ///< In active_timers_, waiting to fire
  Paused     = 2,  ///< In paused_timers_, clock frozen
  Processing = 3,  ///< Pulled from active, callback running right now
};

/**
 * @struct TimerNode
 * @brief Unified timer structure representing timeouts, intervals, or custom timers
 */
struct TimerNode {
  TimerId id;                      ///< Unique timer identifier
  unsigned long next_call_ms;      ///< Absolute time for next execution
  unsigned long interval_ms;       ///< Periodic interval (0 for one-shot timeout)

  TimerState state = TimerState::Inactive;  ///< Current lifecycle state
  bool is_interval;                ///< Type indicator (true = interval, false = timeout)
  int repeat_count;                ///< Remaining repeats (-1 = infinite, positive values = repeats)
  unsigned long remaining_ms;      ///< Remaining time when paused

  /// @brief Reentrancy requests made while state == Processing.
  /// Set by pause()/remove() called from inside the node's own callback; the
  /// process() loop honors them once the callback returns. This closes the old
  /// "pause(id) silently fails during callback" bug.
  bool pause_requested = false;
  bool remove_requested = false;

  /// @brief No longer tracks array index, uses lazy evaluation or O(N) lookup.
  
  void reset(TimerId _id, unsigned long _next_call, unsigned long _interval, bool _is_interval, int _repeats) {
    id = _id;
    next_call_ms = _next_call;
    interval_ms = _interval;
    state = TimerState::Active;
    is_interval = _is_interval;
    repeat_count = _repeats;
    remaining_ms = 0;
    pause_requested = false;
    remove_requested = false;
#ifdef TIMER_ENABLE_INTERVAL_UNTIL
    is_until = false;
#endif
  }
  
#ifdef TIMER_ENABLE_INTERVAL_UNTIL
  bool is_until;                   ///< Indicates if this is an interval_until timer
  unsigned long until_timeout_ms;  ///< Absolute time for timeout (only valid if is_until == true)
  
  union {
    TimerCallback<void()> callback;
    struct {
      TimerCallback<bool()> until_callback;
      TimerCallback<void()> until_timeout_callback;
    } until;
  };

  TimerNode() : is_until(false) {
    new (&callback) TimerCallback<void()>();
  }

  // Move constructor
  TimerNode(TimerNode&& other) noexcept :
    id(other.id), next_call_ms(other.next_call_ms), interval_ms(other.interval_ms),
    state(other.state), is_interval(other.is_interval), repeat_count(other.repeat_count),
    remaining_ms(other.remaining_ms), pause_requested(other.pause_requested),
    remove_requested(other.remove_requested),
    is_until(other.is_until), until_timeout_ms(other.until_timeout_ms) {

    if (is_until) {
      new (&until.until_callback) TimerCallback<bool()>(std::move(other.until.until_callback));
      new (&until.until_timeout_callback) TimerCallback<void()>(std::move(other.until.until_timeout_callback));
    } else {
      new (&callback) TimerCallback<void()>(std::move(other.callback));
    }
  }

  // Move assignment
  TimerNode& operator=(TimerNode&& other) noexcept {
    if (this != &other) {
      this->~TimerNode(); // Destroy current state

      id = other.id;
      next_call_ms = other.next_call_ms;
      interval_ms = other.interval_ms;
      state = other.state;
      is_interval = other.is_interval;
      repeat_count = other.repeat_count;
      remaining_ms = other.remaining_ms;
      pause_requested = other.pause_requested;
      remove_requested = other.remove_requested;
      is_until = other.is_until;
      until_timeout_ms = other.until_timeout_ms;

      if (is_until) {
        new (&until.until_callback) TimerCallback<bool()>(std::move(other.until.until_callback));
        new (&until.until_timeout_callback) TimerCallback<void()>(std::move(other.until.until_timeout_callback));
      } else {
        new (&callback) TimerCallback<void()>(std::move(other.callback));
      }
    }
    return *this;
  }

  ~TimerNode() {
    if (is_until) {
      until.until_callback.~FastFunction();
      until.until_timeout_callback.~FastFunction();
    } else {
      callback.~FastFunction();
    }
  }
#else
  TimerCallback<void()> callback;  ///< Callback function (returns void)
  
  TimerNode() = default;
  TimerNode(TimerNode&&) = default;
  TimerNode& operator=(TimerNode&&) = default;
#endif
};

} // namespace uniuno

