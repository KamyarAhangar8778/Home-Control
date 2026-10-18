#pragma once

#include "TimerConfig.h"
#include "TimerTypes.h"
#include "Optimization/StaticArray.h"
#include "Optimization/SortStrategy.h"
#include "Optimization/CompilerTraits.h"
#include <algorithm>

namespace uniuno {

/**
 * @class TimerStorage
 * @brief Manages memory pools and O(1) id->node lookups for timers.
 * 
 * Uses Generational Slot Map for absolute O(1) lookup without any Hash Maps.
 * Uses Min-Heap for O(log N) fast insertions.
 */
template <size_t MaxTimers = 32>
class TimerStorage {
public:
  TimerStorage() : timeout_count_(0), interval_count_(0), generation_counter_(0) {
    for (size_t i = 0; i < MaxTimers; i++) {
      free_nodes_.push_back(&pool_[i]);
    }
  }

  ~TimerStorage() = default;

  TimerNode* allocateNode(TimerId& out_id) {
    if (UNLIKELY(free_nodes_.empty())) return nullptr;
    TimerNode* node = free_nodes_.back();
    free_nodes_.pop_back();

    uint16_t index = node - pool_;
    uint16_t gen = ++generation_counter_;
    if (gen == 0) gen = ++generation_counter_; // Skip 0
    
    out_id = TimerId{ ((uint32_t)gen << 16) | index };
    return node;
  }

  void freeNode(TimerNode* node) {
    node->~TimerNode();
    new (node) TimerNode(); // Re-construct to clean state
    node->state = TimerState::Inactive;
    free_nodes_.push_back(node);
  }

  HOT_PATH void addActiveNode(TimerNode* node) {
    if (UNLIKELY(active_timers_.full())) {
      freeNode(node); // Pool leak fix
      return;
    }

    HeapSortStrategy::add_sorted(active_timers_, std::move(node),
      [](const TimerNode* a, const TimerNode* b) {
        return (long)(a->next_call_ms - b->next_call_ms) > 0; // Min-Heap
      });
  }

  TimerNode* lookup(TimerId id) {
    if (id.value == 0) return nullptr;
    uint16_t index = id.getIndex();
    if (index >= MaxTimers) return nullptr;
    TimerNode* node = &pool_[index];
    if (node->id == id && node->state != TimerState::Inactive) return node;
    return nullptr;
  }

  const TimerNode* lookup_const(TimerId id) const {
    if (id.value == 0) return nullptr;
    uint16_t index = id.getIndex();
    if (index >= MaxTimers) return nullptr;
    const TimerNode* node = &pool_[index];
    if (node->id == id && node->state != TimerState::Inactive) return node;
    return nullptr;
  }

  bool removeActiveNode(TimerNode* node) {
    for (size_t i = 0; i < active_timers_.size(); i++) {
      if (active_timers_[i] == node) {
        active_timers_.erase(i);
        std::make_heap(active_timers_.begin(), active_timers_.end(),
          [](const TimerNode* a, const TimerNode* b) {
            return (long)(a->next_call_ms - b->next_call_ms) > 0;
          });
        return true;
      }
    }
    return false;
  }

  bool removePausedNode(TimerNode* node) {
    for (size_t i = 0; i < paused_timers_.size(); i++) {
      if (paused_timers_[i] == node) {
        paused_timers_.erase(i);
        return true;
      }
    }
    return false;
  }

  void clear() {
    active_timers_.clear();
    paused_timers_.clear();
    free_nodes_.clear();
    generation_counter_ = 0;
    for (size_t i = 0; i < MaxTimers; i++) {
      pool_[i].state = TimerState::Inactive;
      free_nodes_.push_back(&pool_[i]);
    }
    timeout_count_ = 0;
    interval_count_ = 0;
  }

  inline size_t count() const { return active_timers_.size() + paused_timers_.size(); }
  inline size_t countTimeouts() const { return timeout_count_; }
  inline size_t countIntervals() const { return interval_count_; }
  
  inline void incTimeouts() { timeout_count_++; }
  inline void decTimeouts() { if (timeout_count_ > 0) timeout_count_--; }
  inline void incIntervals() { interval_count_++; }
  inline void decIntervals() { if (interval_count_ > 0) interval_count_--; }

  StaticArray<TimerNode*, MaxTimers>& getActiveTimers() { return active_timers_; }
  const StaticArray<TimerNode*, MaxTimers>& getActiveTimers() const { return active_timers_; }
  StaticArray<TimerNode*, MaxTimers>& getPausedTimers() { return paused_timers_; }

private:
  TimerNode pool_[MaxTimers];
  StaticArray<TimerNode*, MaxTimers> free_nodes_;
  StaticArray<TimerNode*, MaxTimers> active_timers_;
  StaticArray<TimerNode*, MaxTimers> paused_timers_;

  uint16_t generation_counter_;
  uint16_t timeout_count_;
  uint16_t interval_count_;
};

} // namespace uniuno
