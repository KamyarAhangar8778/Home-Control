#pragma once

#include "TimerConfig.h"
#include "TimerCore.h"
#include "TimerEvents.h"
#include "TimerStorage.h"
#include "TimerProcessor.h"
#include "Optimization/CompilerTraits.h"

#ifdef TIMER_EVENTS_ENABLED
#include <Events/EventDispatcher.h>
#else
namespace uniuno { class EventDispatcher {}; } // Dummy
#endif

namespace uniuno {

/**
 * @class TimerManager
 * @brief Unified timer manager Facade.
 * Delegates to TimerStorage (memory) and TimerProcessor (logic).
 */
template <size_t MaxTimers = 32>
class TimerManager {
public:
  TimerManager(const TimerCore* core, EventDispatcher* dispatcher = nullptr)
    : core_(core), dispatcher_(dispatcher), processor_(core, dispatcher) {}

  TimerId add_timeout(TimerCallback<void()> callback, unsigned long timeout_ms) {
    TimerId id = INVALID_TIMER_ID;
    TimerNode* node = storage_.allocateNode(id);
    if (!node) return INVALID_TIMER_ID;
    node->reset(id, core_->now() + timeout_ms, 0, false, 1);
    node->callback = std::move(callback);
    finalizeNode(node, timeout_ms);
    return id;
  }

  TimerId add_interval(TimerCallback<void()> callback, unsigned long interval_ms, int repeat_count = -1) {
    TimerId id = INVALID_TIMER_ID;
    TimerNode* node = storage_.allocateNode(id);
    if (!node) return INVALID_TIMER_ID;
    node->reset(id, core_->now() + interval_ms, interval_ms, true, (repeat_count == 0) ? -1 : repeat_count);
    node->callback = std::move(callback);
    finalizeNode(node, interval_ms);
    return id;
  }

#ifdef TIMER_ENABLE_INTERVAL_UNTIL
  TimerId add_interval_until(TimerCallback<bool()> callback, unsigned long interval_ms) {
    TimerId id = INVALID_TIMER_ID;
    TimerNode* node = storage_.allocateNode(id);
    if (!node) return INVALID_TIMER_ID;
    node->reset(id, core_->now() + interval_ms, interval_ms, true, -1);
    node->is_until = true;
    node->until.until_callback = std::move(callback);
    node->until.until_timeout_callback = nullptr;
    node->until_timeout_ms = 0;
    finalizeNode(node, interval_ms);
    return id;
  }

  TimerId add_interval_until_with_timeout(TimerCallback<bool()> callback, unsigned long interval_ms,
                                       TimerCallback<void()> on_timeout, unsigned long timeout_ms) {
    TimerId id = INVALID_TIMER_ID;
    TimerNode* node = storage_.allocateNode(id);
    if (!node) return INVALID_TIMER_ID;
    node->reset(id, core_->now() + interval_ms, interval_ms, true, -1);
    node->is_until = true;
    node->until.until_callback = std::move(callback);
    node->until.until_timeout_callback = std::move(on_timeout);
    node->until_timeout_ms = core_->now() + timeout_ms;
    finalizeNode(node, interval_ms);
    return id;
  }
#endif

  bool remove(TimerId id) {
    TimerNode* node = storage_.lookup(id);
    if (!node) return false;

    if (node->state == TimerState::Processing) {
      node->remove_requested = true;
      return true;
    }

    if (node->state == TimerState::Active) storage_.removeActiveNode(node);
    else if (node->state == TimerState::Paused) storage_.removePausedNode(node);

#ifdef TIMER_EVENT_CANCELLED
    if (dispatcher_) {
      unsigned long now = core_->now();
      unsigned long rem = timer_due(now, node->next_call_ms) ? 0 : (node->next_call_ms - now);
      dispatcher_->dispatch(TimerCancelledEvent{node->id, rem, node->is_interval});
    }
#endif

    if (node->is_interval) storage_.decIntervals();
    else storage_.decTimeouts();
    storage_.freeNode(node);
    return true;
  }

  HOT_PATH void process() { process(core_->now()); }

  HOT_PATH void process(unsigned long cached_time) {
    processor_.process(storage_, cached_time);
  }

  bool pause(TimerId id) {
    TimerNode* node = storage_.lookup(id);
    if (!node || node->state == TimerState::Paused) return false;

    if (node->state == TimerState::Processing) {
      node->pause_requested = true;
      return true;
    }

    if (node->state != TimerState::Active) return false;

    unsigned long now = core_->now();
    node->remaining_ms = timer_due(now, node->next_call_ms) ? 0 : (node->next_call_ms - now);
    node->state = TimerState::Paused;

    storage_.removeActiveNode(node);
    storage_.getPausedTimers().push_back(node);
    return true;
  }

  bool resume(TimerId id) {
    TimerNode* node = storage_.lookup(id);
    if (!node || node->state != TimerState::Paused) return false;

    storage_.removePausedNode(node);
    node->next_call_ms = core_->now() + node->remaining_ms;
    node->state = TimerState::Active;
    storage_.addActiveNode(node);
    return true;
  }

  bool isPaused(TimerId id) const {
    const TimerNode* node = storage_.lookup_const(id);
    return node && node->state == TimerState::Paused;
  }

  HOT_PATH FORCE_INLINE bool getNextExpiry(unsigned long& out_expiry) const {
    const auto& active = storage_.getActiveTimers();
    if (active.empty()) return false;
    out_expiry = active[0]->next_call_ms;
    return true;
  }

  void clear() { storage_.clear(); }
  size_t count() const { return storage_.count(); }
  size_t count_timeouts() const { return storage_.countTimeouts(); }
  size_t count_intervals() const { return storage_.countIntervals(); }

private:
  void finalizeNode(TimerNode* node, unsigned long delay_or_interval) {
#ifdef TIMER_EVENT_CREATED
    if (dispatcher_) dispatcher_->dispatch(TimerCreatedEvent{node->id, delay_or_interval, node->is_interval});
#endif
    if (node->is_interval) storage_.incIntervals();
    else storage_.incTimeouts();
    storage_.addActiveNode(node);
  }

  const TimerCore* core_;
  EventDispatcher* dispatcher_;
  TimerStorage<MaxTimers> storage_;
  TimerProcessor<MaxTimers> processor_;
};

} // namespace uniuno
