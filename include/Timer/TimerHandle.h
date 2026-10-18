/**
 * @file TimerHandle.h
 * @brief Handle class for managing individual timers
 * @author uniuno
 * 
 * PURPOSE: Provides object-oriented interface for timer management
 * FEATURES:
 *   - cancel(): Stop timer execution
 *   - isActive(): Check if timer is still running
 *   - restart(): Reset timer to initial state
 *   - getId(): Get internal timer ID
 * 
 * USAGE:
 * @code
 *   auto handle = timer.set_timeout(callback, 1000);
 *   if (handle.isActive()) {
 *     handle.cancel();
 *   }
 * @endcode
 */

#pragma once

#include "Timer/TimerTypes.h"

namespace uniuno {

class ITimer;

/**
 * @class TimerHandle
 * @brief RAII-style handle for managing timer lifecycle
 * 
 * Provides convenient methods to control timer without manual ID management.
 * Automatically tracks timer state and provides intuitive API.
 */
class TimerHandle {
public:
  /**
   * @brief Constructor
   * @param timer Pointer to parent Timer instance
   * @param id Timer ID
   * @param is_interval True if interval, false if timeout
   */
  TimerHandle(ITimer* timer = nullptr, TimerId id = INVALID_TIMER_ID, bool is_interval = false)
    : timer_(timer), id_(id), is_interval_(is_interval), cancelled_(timer == nullptr) {}

  /**
   * @brief Cancel timer execution
   * 
   * Stops timer and prevents future callbacks.
   * Safe to call multiple times.
   */
  void cancel();

  /**
   * @brief Check if timer is still active
   * @return true if timer is running, false if cancelled or completed
   */
  bool isActive() const {
    return !cancelled_;
  }

  /**
   * @brief Get internal timer ID
   * @return Timer ID for advanced usage
   */
  TimerId getId() const {
    return id_;
  }

  /**
   * @brief Check if this is an interval timer
   * @return true if interval, false if timeout
   */
  bool isInterval() const {
    return is_interval_;
  }

  /**
   * @brief Pause this timer
   * @return true if successfully paused
   */
  bool pause();

  /**
   * @brief Resume this timer
   * @return true if successfully resumed
   */
  bool resume();

  /**
   * @brief Check if this timer is paused
   * @return true if paused
   */
  bool isPaused() const;

private:
  ITimer* timer_;           ///< Parent timer instance
  TimerId id_;        ///< Internal timer ID
  bool is_interval_;       ///< Timer type flag
  bool cancelled_;         ///< Cancellation state
};

} // namespace uniuno
