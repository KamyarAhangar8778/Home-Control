/**
 * @file TimerGroupsImpl.h
 * @brief Implementation of Timer class group management methods
 * @author uniuno
 */

#pragma once

#ifdef TIMER_ENABLE_GROUPS

#include "Timer/Timer.h"

namespace uniuno {

template <size_t MaxTimers>
inline void TimerBase<MaxTimers>::createGroup(const char* name) {
  uint32_t hash = hashString(name);
  if (groups_.find(hash) != nullptr) return;
  if (groups_.full()) return;
  
  GroupEntry entry;
  strncpy(entry.name, name, sizeof(entry.name) - 1);
  entry.name[sizeof(entry.name) - 1] = '\0';
  groups_.insert(hash, std::move(entry));
}

template <size_t MaxTimers>
inline void TimerBase<MaxTimers>::addToGroup(const char* name, TimerId id) {
  uint32_t hash = hashString(name);
  GroupEntry* entry = groups_.find(hash);
  if (entry == nullptr) {
    createGroup(name);
    entry = groups_.find(hash);
  }
  
  if (entry != nullptr) {
    if (!entry->timer_ids.full()) {
      if (entry->timer_ids.find(id) == entry->timer_ids.end()) {
        entry->timer_ids.push_back(id);
      }
    }
  }
}

template <size_t MaxTimers>
inline void TimerBase<MaxTimers>::addToGroup(const char* name, TimerHandle handle) {
  addToGroup(name, handle.getId());
}

template <size_t MaxTimers>
inline size_t TimerBase<MaxTimers>::pauseGroup(const char* name) {
  GroupEntry* entry = findGroup(name);
  if (!entry) return 0;
  
  size_t count = 0;
  for (auto id : entry->timer_ids) {
    if (pause(id)) count++;
  }
  return count;
}

template <size_t MaxTimers>
inline size_t TimerBase<MaxTimers>::resumeGroup(const char* name) {
  GroupEntry* entry = findGroup(name);
  if (!entry) return 0;
  
  size_t count = 0;
  for (auto id : entry->timer_ids) {
    if (resume(id)) count++;
  }
  return count;
}

template <size_t MaxTimers>
inline size_t TimerBase<MaxTimers>::clearGroup(const char* name) {
  uint32_t hash = hashString(name);
  GroupEntry* entry = groups_.find(hash);
  if (entry == nullptr) return 0;
  
  size_t count = 0;
  for (auto id : entry->timer_ids) {
    manager_.remove(id);
    count++;
  }
  groups_.erase(hash);
  return count;
}

template <size_t MaxTimers>
inline bool TimerBase<MaxTimers>::removeFromGroup(const char* name, TimerId id) {
  GroupEntry* entry = findGroup(name);
  if (!entry) return false;
  return entry->timer_ids.remove(id);
}

template <size_t MaxTimers>
inline bool TimerBase<MaxTimers>::removeGroup(const char* name) {
  uint32_t hash = hashString(name);
  if (groups_.find(hash) == nullptr) return false;
  groups_.erase(hash);
  return true;
}

template <size_t MaxTimers>
inline size_t TimerBase<MaxTimers>::groupSize(const char* name) const {
  const GroupEntry* entry = findGroup(name);
  if (!entry) return 0;
  return entry->timer_ids.size();
}

template <size_t MaxTimers>
inline bool TimerBase<MaxTimers>::hasGroup(const char* name) const {
  return findGroup(name) != nullptr;
}

} // namespace uniuno

#endif // TIMER_ENABLE_GROUPS
