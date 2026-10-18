#pragma once

#include "EventStorage.h"

namespace uniuno {

/**
 * @class BaseEventDispatcher
 * @brief Dispatch logic cleanly separated from memory management.
 * Less than 100 lines for maximum readability and single responsibility.
 */
template <size_t MaxEvents = 32, size_t MaxListeners = 8>
class BaseEventDispatcher {
public:
  BaseEventDispatcher() : dispatch_depth_(0), next_listener_id_(1) {}
  virtual ~BaseEventDispatcher() = default;

  uint32_t addListener(uint32_t event_hash, FastFunction<void(void*)> callback, bool is_once = false) {
    if (UNLIKELY(!callback)) return 0;
    
    uint32_t id = next_listener_id_++;
    if (UNLIKELY(next_listener_id_ == 0)) next_listener_id_ = 1;

    auto* group = storage_.getOrCreateGroup(event_hash);
    if (!group) return 0;

    if (UNLIKELY(group->listeners.full())) {
      ErrorHandler::getInstance().reportError("BaseEventDispatcher", "Listeners full", ErrorSeverity::WARNING);
      return 0;
    }

    group->listeners.push_back(ListenerEntry(event_hash, id, std::move(callback), is_once));
    return id;
  }

  bool removeListenerById(uint32_t event_hash, uint32_t listener_id) {
    auto* group = storage_.findGroup(event_hash);
    if (!group) return false;

    auto* current = group->listeners.data();
    auto* end = current + group->listeners.size();

    while (current < end) {
      if (current->get_id() == listener_id) {
        if (dispatch_depth_ > 0) current->mark_for_removal();
        else group->listeners.erase(group->listeners.begin() + (current - group->listeners.data()));
        return true;
      }
      current++;
    }
    return false;
  }

  size_t removeListener(uint32_t event_hash) {
    auto* group = storage_.findGroup(event_hash);
    if (!group) return 0;

    size_t removed = 0;
    if (dispatch_depth_ > 0) {
      for (auto& listener : group->listeners) {
        if (!listener.is_marked_for_removal()) {
          listener.mark_for_removal();
          removed++;
        }
      }
    } else {
      removed = group->listeners.size();
      group->listeners.clear();
      group->active = false; // Mark group as free
    }
    return removed;
  }

  HOT_PATH void dispatchEvent(void* event, uint32_t event_hash) {
    auto* group = storage_.findGroup(event_hash);
    if (UNLIKELY(!group)) return;

    dispatch_depth_++;
    bool needs_cleanup = false;
    
    for (auto& listener : group->listeners) {
      if (LIKELY(!listener.is_marked_for_removal())) {
        listener.invoke(event);
        if (UNLIKELY(listener.is_once())) {
          listener.mark_for_removal();
          needs_cleanup = true;
        }
      } else {
        needs_cleanup = true;
      }
    }
    
    dispatch_depth_--;
    if (UNLIKELY(needs_cleanup && dispatch_depth_ == 0)) cleanupMarkedListeners(group);
  }

  inline void clear() { storage_.clear(); }
  
  inline size_t count() const { 
    size_t total = 0;
    for (const auto& group : storage_.getAllGroups()) {
      if (!group.active) continue;
      for (const auto& listener : group.listeners) {
        if (!listener.is_marked_for_removal()) total++;
      }
    }
    return total;
  }

  size_t count(uint32_t event_hash) const {
    const auto* group = storage_.findGroup(event_hash);
    if (!group) return 0;
    
    size_t cnt = 0;
    for (const auto& listener : group->listeners) {
      if (!listener.is_marked_for_removal()) cnt++;
    }
    return cnt;
  }

private:
  void cleanupMarkedListeners(EventGroup<MaxListeners>* group) {
    size_t write_idx = 0;
    for (size_t read_idx = 0; read_idx < group->listeners.size(); read_idx++) {
      if (!group->listeners[read_idx].is_marked_for_removal()) {
        if (write_idx != read_idx)
          group->listeners[write_idx] = std::move(group->listeners[read_idx]);
        write_idx++;
      }
    }
    while (group->listeners.size() > write_idx) group->listeners.pop_back();
    if (group->listeners.empty()) group->active = false;
  }

  EventStorage<MaxEvents, MaxListeners> storage_;
  uint32_t next_listener_id_;
  uint8_t dispatch_depth_;
};

} // namespace uniuno
