#pragma once

#include "TimerStorage.h"
#include "TimerCore.h"
#include "TimerEvents.h"
#include "Optimization/StaticArray.h"
#include "Optimization/TimerAsm.h"
#include "Optimization/CompilerTraits.h"

#ifdef TIMER_EVENTS_ENABLED
#include <Events/EventDispatcher.h>
#else
namespace uniuno { class EventDispatcher {}; } // Dummy if disabled
#endif

namespace uniuno {

static FORCE_INLINE bool timer_due(unsigned long current, unsigned long deadline) {
  return uniuno::asm_opt::is_timer_expired(current, deadline);
}

/**
 * @class TimerProcessor
 * @brief Handles the execution loop for timers, separated from storage.
 */
template <size_t MaxTimers = 32>
class TimerProcessor {
public:
  TimerProcessor(const TimerCore* core, EventDispatcher* dispatcher)
    : core_(core), dispatcher_(dispatcher) {}

  HOT_PATH void process(TimerStorage<MaxTimers>& storage, unsigned long cached_time) {
    StaticArray<TimerNode*, MaxTimers> execution_queue;
    auto& active_timers_ = storage.getActiveTimers();

    uint16_t expired_count = 0;
    while (expired_count < active_timers_.size()) {
      TimerNode* top = active_timers_[0];
      if (LIKELY(!timer_due(cached_time, top->next_call_ms))) break;
      
      std::pop_heap(active_timers_.begin(), active_timers_.end(),
        [](const TimerNode* a, const TimerNode* b) {
          return (long)(a->next_call_ms - b->next_call_ms) > 0;
        });
      
      active_timers_.pop_back();

      top->state = TimerState::Processing;
      top->pause_requested = false;
      top->remove_requested = false;
      execution_queue.push_back(top);
      expired_count++;
    }

    // Active timers no longer track indices, no shifting needed

    auto& paused_timers_ = storage.getPausedTimers();

    for (TimerNode* node : execution_queue) {
#ifdef TIMER_EVENT_EXPIRED
      if (dispatcher_) {
        long drift = asm_opt::calculate_drift(cached_time, node->next_call_ms);
        TimerExpiredEvent event{node->id, node->next_call_ms, cached_time, drift, node->is_interval};
        dispatcher_->dispatch(event);
      }
#endif

      bool should_stop = !node->is_interval;

#ifdef TIMER_ENABLE_INTERVAL_UNTIL
      if (node->is_until) {
        if (node->until.until_callback) {
          should_stop = node->until.until_callback();
          if (!should_stop && node->until.until_timeout_callback && timer_due(cached_time, node->until_timeout_ms)) {
            node->until.until_timeout_callback();
            should_stop = true;
          }
        }
      } else if (node->callback) {
        node->callback();
      }
#else
      if (node->callback) node->callback();
#endif

      if (node->repeat_count > 0) {
        node->repeat_count--;
        if (node->repeat_count == 0) should_stop = true;
      }

      if (node->remove_requested) {
        freeFinishedNode(storage, node);
        continue;
      }

      if (node->pause_requested) {
        node->state = TimerState::Paused;
        unsigned long now = core_->now();
        node->remaining_ms = timer_due(now, node->next_call_ms) ? 0 : (node->next_call_ms - now);
        paused_timers_.push_back(node);
        continue;
      }

      if (!should_stop) {
        node->next_call_ms = cached_time + node->interval_ms;
        node->state = TimerState::Active;
#ifdef TIMER_EVENT_RESCHEDULED
        if (dispatcher_) {
          TimerRescheduledEvent event{node->id, node->next_call_ms, node->interval_ms};
          dispatcher_->dispatch(event);
        }
#endif
        storage.addActiveNode(node);
      } else {
        freeFinishedNode(storage, node);
      }
    }
  }

private:
  void freeFinishedNode(TimerStorage<MaxTimers>& storage, TimerNode* node) {
    if (node->is_interval) storage.decIntervals();
    else storage.decTimeouts();
    storage.freeNode(node);
  }

  const TimerCore* core_;
  EventDispatcher* dispatcher_;
};

} // namespace uniuno
