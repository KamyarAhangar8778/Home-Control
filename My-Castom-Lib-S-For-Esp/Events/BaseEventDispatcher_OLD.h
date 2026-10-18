/**
 * @file BaseEventDispatcher_OLD.h
 * @brief BACKUP: Old Flash-oriented version (uses std::vector + std::function)
 * @author uniuno
 * 
 * This is the OLD implementation kept for reference.
 * Use BaseEventDispatcher.h for the new RAM-oriented version.
 */

#pragma once

#include <functional>
#include <vector>
#include <cstdint>
#include "../Core/Error/ErrorHandler.h"

namespace uniuno {

class BaseEventDispatcher {
protected:
  struct ListenerEntry {
    uint32_t event_hash;
    std::function<void(void*)> callback;
    bool is_once;
    bool marked_for_removal;
    
    ListenerEntry(uint32_t hash, std::function<void(void*)> cb, bool once)
      : event_hash(hash), callback(cb), is_once(once), marked_for_removal(false) {}
  };
  
  std::vector<ListenerEntry> listeners_;
  bool is_dispatching_;

public:
  explicit BaseEventDispatcher(size_t reserve_size = 8) 
    : is_dispatching_(false) {
    listeners_.reserve(reserve_size);
  }
  
  virtual ~BaseEventDispatcher() = default;

  void addListener(uint32_t event_hash, std::function<void(void*)> callback, bool is_once = false) {
    if (!callback) return;
    listeners_.emplace_back(event_hash, callback, is_once);
  }

  size_t removeListener(uint32_t event_hash) {
    size_t removed = 0;
    
    if (is_dispatching_) {
      for (auto& listener : listeners_) {
        if (listener.event_hash == event_hash && !listener.marked_for_removal) {
          listener.marked_for_removal = true;
          removed++;
        }
      }
    } else {
      auto it = listeners_.begin();
      while (it != listeners_.end()) {
        if (it->event_hash == event_hash) {
          it = listeners_.erase(it);
          removed++;
        } else {
          ++it;
        }
      }
    }
    
    return removed;
  }

  void dispatchEvent(void* event, uint32_t event_hash) {
    is_dispatching_ = true;
    
    for (auto& listener : listeners_) {
      if (listener.event_hash == event_hash && !listener.marked_for_removal) {
        ErrorHandler::safe([&]() {
          listener.callback(event);
        }, "EventCallback");
        
        if (listener.is_once) {
          listener.marked_for_removal = true;
        }
      }
    }
    
    is_dispatching_ = false;
    cleanupMarkedListeners();
  }

  void clear() {
    listeners_.clear();
  }

  size_t count() const {
    return listeners_.size();
  }

  size_t count(uint32_t event_hash) const {
    size_t cnt = 0;
    for (const auto& listener : listeners_) {
      if (listener.event_hash == event_hash && !listener.marked_for_removal) {
        cnt++;
      }
    }
    return cnt;
  }

protected:
  void cleanupMarkedListeners() {
    auto it = listeners_.begin();
    while (it != listeners_.end()) {
      if (it->marked_for_removal) {
        it = listeners_.erase(it);
      } else {
        ++it;
      }
    }
  }
};

} // namespace uniuno
