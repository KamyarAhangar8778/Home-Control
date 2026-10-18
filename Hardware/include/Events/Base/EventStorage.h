#pragma once

#include "ListenerEntry.h"
#include <Optimization/StaticArray.h>
#include <Optimization/CompilerTraits.h>
#include <ErrorHandler.h>

namespace uniuno {

/**
 * @brief Represents a group of listeners for a specific event.
 * Uses 100% pre-allocated RAM to prevent heap fragmentation.
 */
template <size_t MaxListeners = 8>
struct EventGroup {
  uint32_t event_hash = 0;
  bool active = false;
  StaticArray<ListenerEntry, MaxListeners> listeners;
};

/**
 * @class EventStorage
 * @brief Memory management component for Event Dispatcher.
 * Uses ultra-fast contiguous array scanning instead of HashMaps.
 */
template <size_t MaxEvents = 32, size_t MaxListeners = 8>
class EventStorage {
public:
  EventStorage() = default;
  ~EventStorage() = default;

  /**
   * @brief Extremely fast linear scan via L1 cache.
   * Faster than hashing for small N (N<=32).
   */
  HOT_PATH EventGroup<MaxListeners>* findGroup(uint32_t event_hash) {
    auto* current = groups_.data();
    auto* end = current + groups_.size();
    while (current < end) {
      if (current->active && current->event_hash == event_hash) {
        return current;
      }
      current++;
    }
    return nullptr;
  }

  const EventGroup<MaxListeners>* findGroup(uint32_t event_hash) const {
    const auto* current = groups_.data();
    const auto* end = current + groups_.size();
    while (current < end) {
      if (current->active && current->event_hash == event_hash) {
        return current;
      }
      current++;
    }
    return nullptr;
  }

  EventGroup<MaxListeners>* getOrCreateGroup(uint32_t event_hash) {
    auto* existing = findGroup(event_hash);
    if (existing) return existing;

    if (UNLIKELY(groups_.full())) {
      ErrorHandler::getInstance().reportError("EventStorage", "Max events reached", ErrorSeverity::WARNING);
      return nullptr;
    }
    
    EventGroup<MaxListeners> new_group;
    new_group.event_hash = event_hash;
    new_group.active = true;
    groups_.push_back(std::move(new_group));
    return &groups_.back();
  }

  void clear() { groups_.clear(); }
  
  const StaticArray<EventGroup<MaxListeners>, MaxEvents>& getAllGroups() const { return groups_; }
  StaticArray<EventGroup<MaxListeners>, MaxEvents>& getAllGroups() { return groups_; }

private:
  StaticArray<EventGroup<MaxListeners>, MaxEvents> groups_;
};

} // namespace uniuno
