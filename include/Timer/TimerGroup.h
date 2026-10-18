/**
 * @file TimerGroup.h
 * @brief Optional timer group management for batch operations
 * @author uniuno
 * 
 * PURPOSE: Manage multiple timers as a group
 * BENEFIT: Pause/resume/clear multiple timers with one call
 * 
 * ENABLE: Define TIMER_ENABLE_GROUPS in TimerConfig.h
 * 
 * ARCHITECTURE:
 *   - Uses SmallVector for efficient storage
 *   - Stores timer IDs, not handles (lightweight)
 *   - Delegates operations to Timer instance
 * 
 * USAGE:
 * @code
 *   #include <Timer/TimerGroup.h>
 *   
 *   TimerGroup group;
 *   group.add(timer.setTimeout(cb1, 1000));
 *   group.add(timer.setInterval(cb2, 500));
 *   
 *   group.pauseAll();   // Pause all timers in group
 *   group.resumeAll();  // Resume all
 *   group.clearAll();   // Remove all
 * @endcode
 */

#pragma once

#include "TimerConfig.h"

#ifdef TIMER_ENABLE_GROUPS

#include "Timer.h"
#include "TimerHandle.h"

#ifdef TIMER_ENABLE_OPTIMIZATIONS
#include "Optimization/SmallVector.h"
template<typename T> using GroupVector = uniuno::SmallVector<T, 8>;
#else
#include <vector>
template<typename T> using GroupVector = std::vector<T>;
#endif

namespace uniuno {

/**
 * @class TimerGroup
 * @brief Manages a group of timers for batch operations
 * 
 * PATTERN: Composite Pattern
 * OPTIMIZATION: Uses SmallVector (≤8 timers = stack storage)
 * BENEFIT: Batch operations without individual timer management
 */
class TimerGroup {
public:
  /**
   * @brief Constructor
   * @param timer Parent Timer instance (optional, can be set later)
   */
  explicit TimerGroup(Timer* timer = nullptr) 
    : timer_(timer) {}

  /**
   * @brief Set parent Timer instance
   * @param timer Timer instance
   */
  void setTimer(Timer* timer) {
    timer_ = timer;
  }

  /**
   * @brief Add timer to group by ID
   * @param id Timer ID
   */
  void add(unsigned int id) {
    timer_ids_.push_back(id);
  }

  /**
   * @brief Add timer to group by Handle
   * @param handle TimerHandle
   */
  void add(const TimerHandle& handle) {
    timer_ids_.push_back(handle.getId());
  }

  /**
   * @brief Remove timer from group
   * @param id Timer ID
   * @return true if found and removed
   */
  bool remove(unsigned int id) {
    auto it = timer_ids_.begin();
    while (it != timer_ids_.end()) {
      if (*it == id) {
        timer_ids_.erase(it);
        return true;
      }
      ++it;
    }
    return false;
  }

  /**
   * @brief Pause all timers in group
   * @return Number of timers paused
   */
  size_t pauseAll() {
    if (!timer_) return 0;
    
    size_t count = 0;
    for (auto id : timer_ids_) {
      if (timer_->pause(id)) {
        count++;
      }
    }
    return count;
  }

  /**
   * @brief Resume all timers in group
   * @return Number of timers resumed
   */
  size_t resumeAll() {
    if (!timer_) return 0;
    
    size_t count = 0;
    for (auto id : timer_ids_) {
      if (timer_->resume(id)) {
        count++;
      }
    }
    return count;
  }

#ifdef TIMER_ENABLE_CLEAR
  /**
   * @brief Clear all timers in group
   * @return Number of timers cleared
   */
  size_t clearAll() {
    if (!timer_) return 0;
    
    size_t count = 0;
    auto it = timer_ids_.begin();
    while (it != timer_ids_.end()) {
      timer_->clear_timeout(*it);  // Try timeout
      timer_->clear_interval(*it); // Try interval
      it = timer_ids_.erase(it);
      count++;
    }
    return count;
  }
#endif

  /**
   * @brief Get number of timers in group
   * @return Count of timers
   */
  size_t count() const {
    return timer_ids_.size();
  }

  /**
   * @brief Check if group is empty
   * @return true if no timers
   */
  bool empty() const {
    return timer_ids_.empty();
  }

  /**
   * @brief Clear group (remove all timer IDs)
   * 
   * NOTE: This only clears the group, not the timers themselves
   * Use clearAll() to also cancel the timers
   */
  void clear() {
    timer_ids_.clear();
  }

  /**
   * @brief Check if timer is in group
   * @param id Timer ID
   * @return true if in group
   */
  bool contains(unsigned int id) const {
    for (auto timer_id : timer_ids_) {
      if (timer_id == id) return true;
    }
    return false;
  }

private:
  Timer* timer_;
  GroupVector<unsigned int> timer_ids_;
};

} // namespace uniuno

#endif // TIMER_ENABLE_GROUPS
