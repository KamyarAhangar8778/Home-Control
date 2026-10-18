/**
 * @file TimerGroupsImpl.h
 * @brief Implementation of Timer class group management methods
 * @author uniuno
 */

#pragma once

#ifdef TIMER_ENABLE_GROUPS

#include "Timer/Timer.h"

namespace uniuno {

inline int Timer::findGroup(const char* name) const {
  for (uint16_t i = 0; i < groups_.size(); i++) {
    if (strcmp(groups_[i].name, name) == 0) {
      return i;
    }
  }
  return -1;
}

inline void Timer::createGroup(const char* name) {
  if (findGroup(name) >= 0) return;
  if (groups_.full()) return;
  GroupEntry entry;
  strncpy(entry.name, name, sizeof(entry.name) - 1);
  entry.name[sizeof(entry.name) - 1] = '\0';
  groups_.push_back(std::move(entry));
}

inline void Timer::addToGroup(const char* name, unsigned int id) {
  int idx = findGroup(name);
  if (idx < 0) {
    createGroup(name);
    idx = findGroup(name);
  }
  if (idx >= 0) {
    if (!groups_[idx].timer_ids.full()) {
      if (groups_[idx].timer_ids.find(id) == groups_[idx].timer_ids.end()) {
        groups_[idx].timer_ids.push_back(id);
      }
    }
  }
}

inline void Timer::addToGroup(const char* name, TimerHandle handle) {
  addToGroup(name, handle.getId());
}

inline size_t Timer::pauseGroup(const char* name) {
  int idx = findGroup(name);
  if (idx < 0) return 0;
  
  size_t count = 0;
  for (auto id : groups_[idx].timer_ids) {
    if (pause(id)) count++;
  }
  return count;
}

inline size_t Timer::resumeGroup(const char* name) {
  int idx = findGroup(name);
  if (idx < 0) return 0;
  
  size_t count = 0;
  for (auto id : groups_[idx].timer_ids) {
    if (resume(id)) count++;
  }
  return count;
}

inline size_t Timer::clearGroup(const char* name) {
  int idx = findGroup(name);
  if (idx < 0) return 0;
  
  size_t count = 0;
  for (auto id : groups_[idx].timer_ids) {
    manager_.remove(id);
    count++;
  }
  groups_.erase(idx);
  return count;
}

inline bool Timer::removeFromGroup(const char* name, unsigned int id) {
  int idx = findGroup(name);
  if (idx < 0) return false;
  return groups_[idx].timer_ids.remove(id);
}

inline bool Timer::removeGroup(const char* name) {
  int idx = findGroup(name);
  if (idx < 0) return false;
  groups_.erase(idx);
  return true;
}

inline size_t Timer::groupSize(const char* name) const {
  int idx = findGroup(name);
  if (idx < 0) return 0;
  return groups_[idx].timer_ids.size();
}

inline bool Timer::hasGroup(const char* name) const {
  return findGroup(name) >= 0;
}

} // namespace uniuno

#endif // TIMER_ENABLE_GROUPS
