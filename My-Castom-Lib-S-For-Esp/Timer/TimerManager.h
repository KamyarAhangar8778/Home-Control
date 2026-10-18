/**
 * @file TimerManager.h
 * @brief Unified timer manager to eliminate template duplication and std::vector
 * @author uniuno
 * 
 * PURPOSE: Single implementation of timeout and interval timer management
 * BENEFIT: Zero dynamic allocation, zero template duplication, extremely fast tick()
 */

#pragma once

#include "TimerConfig.h"
#include "TimerCore.h"
#include "TimerTypes.h"
#include "TimerEvents.h"
#include "Optimization/StaticArray.h"
#include "Optimization/TimerAsm.h"

#ifdef TIMER_EVENTS_ENABLED
namespace uniuno { class EventDispatcher; }
#endif

#ifndef ARDUINO
#define IRAM_ATTR
#endif

namespace uniuno {

class EventDispatcher;

/**
 * @class TimerManager
 * @brief Manages a unified list of timeouts and intervals
 */
class TimerManager {
public:
  TimerManager(const TimerCore* core, EventDispatcher* dispatcher = nullptr)
    : core_(core), dispatcher_(dispatcher), paused_bitmap_(0) {}

  void add_timeout(TimerCallback<void()> callback, unsigned long timeout_ms, unsigned int id) {
    TimerNode node;
    node.id = id;
    node.next_call_ms = core_->now() + timeout_ms;
    node.interval_ms = 0;
    node.paused = false;
    node.remaining_ms = 0;
    node.repeat_count = 1;
    node.is_interval = false;
    node.callback = std::move(callback);

#ifdef TIMER_EVENT_CREATED
    if (dispatcher_) {
      TimerCreatedEvent event{id, timeout_ms, false};
      dispatcher_->dispatch(event);
    }
#endif

    add_node(std::move(node));
  }

  void add_interval(TimerCallback<void()> callback, unsigned long interval_ms, unsigned int id, int repeat_count = -1) {
    TimerNode node;
    node.id = id;
    node.next_call_ms = core_->now() + interval_ms;
    node.interval_ms = interval_ms;
    node.paused = false;
    node.remaining_ms = 0;
    node.repeat_count = (repeat_count == 0) ? -1 : repeat_count;
    node.is_interval = true;
    node.callback = std::move(callback);

#ifdef TIMER_EVENT_CREATED
    if (dispatcher_) {
      TimerCreatedEvent event{id, interval_ms, true};
      dispatcher_->dispatch(event);
    }
#endif

    add_node(std::move(node));
  }

#ifdef TIMER_ENABLE_INTERVAL_UNTIL
  void add_interval_until(TimerCallback<bool()> callback, unsigned long interval_ms, unsigned int id) {
    TimerNode node;
    node.id = id;
    node.next_call_ms = core_->now() + interval_ms;
    node.interval_ms = interval_ms;
    node.paused = false;
    node.remaining_ms = 0;
    node.repeat_count = -1;
    node.is_interval = true;
    node.until_callback = std::move(callback);
    node.until_timeout_callback = nullptr;
    node.until_timeout_ms = 0;

#ifdef TIMER_EVENT_CREATED
    if (dispatcher_) {
      TimerCreatedEvent event{id, interval_ms, true};
      dispatcher_->dispatch(event);
    }
#endif

    add_node(std::move(node));
  }

  void add_interval_until_with_timeout(TimerCallback<bool()> callback, unsigned long interval_ms,
                                       TimerCallback<void()> on_timeout, unsigned long timeout_ms, unsigned int id) {
    TimerNode node;
    node.id = id;
    node.next_call_ms = core_->now() + interval_ms;
    node.interval_ms = interval_ms;
    node.paused = false;
    node.remaining_ms = 0;
    node.repeat_count = -1;
    node.is_interval = true;
    node.until_callback = std::move(callback);
    node.until_timeout_callback = std::move(on_timeout);
    node.until_timeout_ms = core_->now() + timeout_ms;

#ifdef TIMER_EVENT_CREATED
    if (dispatcher_) {
      TimerCreatedEvent event{id, interval_ms, true};
      dispatcher_->dispatch(event);
    }
#endif

    add_node(std::move(node));
  }
#endif

  void remove_at(size_t index) {
    if (index < timers_.size()) {
      if (index < timers_.size() - 1) {
        timers_[index] = std::move(timers_.back());
      }
      timers_.pop_back();
      update_paused_bitmap();
    }
  }

  bool remove(unsigned int id) {
    for (size_t i = 0; i < timers_.size(); i++) {
      if (timers_[i].id == id) {
#ifdef TIMER_EVENT_CANCELLED
        if (dispatcher_) {
          unsigned long now = core_->now();
          unsigned long remaining = (timers_[i].next_call_ms > now) 
                                     ? (timers_[i].next_call_ms - now) : 0;
          TimerCancelledEvent event{id, remaining, timers_[i].is_interval};
          dispatcher_->dispatch(event);
        }
#endif
        remove_at(i);
        return true;
      }
    }
    return false;
  }

  void process() {
    process(core_->now());
  }

  void process(unsigned long cached_time) {
    while (true) {
      int expired_idx = -1;
      unsigned long min_next_call = 0xFFFFFFFF;
      
      for (size_t i = 0; i < timers_.size(); i++) {
        if (i < 32) {
          if (paused_bitmap_ & (1U << i)) {
            continue;
          }
        } else {
          if (timers_[i].paused) {
            continue;
          }
        }
        
        const auto& node = timers_[i];
        // Check expiration
        if (asm_opt::is_timer_expired(cached_time, node.next_call_ms)) {
          if (node.next_call_ms < min_next_call) {
            min_next_call = node.next_call_ms;
            expired_idx = i;
          }
        }
      }

      if (expired_idx < 0) {
        break; 
      }

      // Extract and remove from timers_ list
      TimerNode expired_node = std::move(timers_[expired_idx]);
      remove_at(expired_idx);

#ifdef TIMER_EVENT_EXPIRED
      if (dispatcher_) {
        long drift = asm_opt::calculate_drift(cached_time, expired_node.next_call_ms);
        TimerExpiredEvent event{expired_node.id, expired_node.next_call_ms, cached_time, drift, expired_node.is_interval};
        dispatcher_->dispatch(event);
      }
#endif

      // Execute callback
      bool should_stop = !expired_node.is_interval;

#ifdef TIMER_ENABLE_INTERVAL_UNTIL
      if (expired_node.until_callback) {
        should_stop = expired_node.until_callback();
        if (!should_stop && expired_node.until_timeout_callback && cached_time >= expired_node.until_timeout_ms) {
          expired_node.until_timeout_callback();
          should_stop = true;
        }
      } else if (expired_node.callback) {
        expired_node.callback();
      }
#else
      if (expired_node.callback) {
        expired_node.callback();
      }
#endif

      // Handle repeat count
      if (expired_node.repeat_count > 0) {
        expired_node.repeat_count--;
        if (expired_node.repeat_count == 0) {
          should_stop = true;
        }
      }

      if (!should_stop) {
        expired_node.next_call_ms = cached_time + expired_node.interval_ms;
#ifdef TIMER_EVENT_RESCHEDULED
        if (dispatcher_) {
          TimerRescheduledEvent event{expired_node.id, expired_node.next_call_ms, expired_node.interval_ms};
          dispatcher_->dispatch(event);
        }
#endif
        add_node(std::move(expired_node));
      }
    }
  }

  size_t count() const {
    return timers_.size();
  }

  size_t count_timeouts() const {
    size_t count = 0;
    for (size_t i = 0; i < timers_.size(); i++) {
      if (!timers_[i].is_interval) count++;
    }
    return count;
  }

  size_t count_intervals() const {
    size_t count = 0;
    for (size_t i = 0; i < timers_.size(); i++) {
      if (timers_[i].is_interval) count++;
    }
    return count;
  }

  void clear() {
    timers_.clear();
    paused_bitmap_ = 0;
  }

  bool pause(unsigned int id) {
    for (size_t i = 0; i < timers_.size(); i++) {
      if (timers_[i].id == id && !timers_[i].paused) {
        timers_[i].paused = true;
        unsigned long now = core_->now();
        timers_[i].remaining_ms = (timers_[i].next_call_ms > now) ? (timers_[i].next_call_ms - now) : 0;
        if (i < 32) {
          asm_opt::set_bitmap_bit(paused_bitmap_, i);
        }
        return true;
      }
    }
    return false;
  }

  bool resume(unsigned int id) {
    for (size_t i = 0; i < timers_.size(); i++) {
      if (timers_[i].id == id && timers_[i].paused) {
        timers_[i].paused = false;
        timers_[i].next_call_ms = core_->now() + timers_[i].remaining_ms;
        if (i < 32) {
          asm_opt::clear_bitmap_bit(paused_bitmap_, i);
        }
        return true;
      }
    }
    return false;
  }

  bool isPaused(unsigned int id) const {
    for (size_t i = 0; i < timers_.size(); i++) {
      if (timers_[i].id == id) {
        if (i < 32) {
          return asm_opt::test_bitmap_bit(paused_bitmap_, i);
        }
        return timers_[i].paused;
      }
    }
    return false;
  }

private:
  void add_node(TimerNode&& node) {
    if (timers_.full()) {
      return;
    }
    timers_.emplace_back(std::move(node));
    update_paused_bitmap();
  }

  void update_paused_bitmap() {
    paused_bitmap_ = 0;
    for (size_t i = 0; i < timers_.size() && i < 32; i++) {
      if (timers_[i].paused) {
        asm_opt::set_bitmap_bit(paused_bitmap_, i);
      }
    }
  }

  const TimerCore* core_;
  EventDispatcher* dispatcher_;
  StaticArray<TimerNode, TIMER_MAX_TIMERS> timers_;
  uint32_t paused_bitmap_;
};

} // namespace uniuno
