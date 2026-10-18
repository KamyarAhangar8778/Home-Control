/**
 * @file TimerHandleImpl.h
 * @brief Implementation of TimerHandle class methods
 * @author uniuno
 */

#pragma once

#include "Timer/ITimer.h"
#include "Timer/TimerHandle.h"

namespace uniuno {

inline void TimerHandle::cancel() {
  if (timer_ && !cancelled_) {
#ifdef TIMER_ENABLE_CLEAR
    if (is_interval_) {
      #ifdef TIMER_ENABLE_INTERVAL
      timer_->clear_interval(id_);
      #endif
    } else {
      #ifdef TIMER_ENABLE_TIMEOUT
      timer_->clear_timeout(id_);
      #endif
    }
#endif
    cancelled_ = true;
  }
}

inline bool TimerHandle::pause() {
  if (timer_ && !cancelled_) {
    return timer_->pause(id_);
  }
  return false;
}

inline bool TimerHandle::resume() {
  if (timer_ && !cancelled_) {
    return timer_->resume(id_);
  }
  return false;
}

inline bool TimerHandle::isPaused() const {
  if (timer_ && !cancelled_) {
    return timer_->isPaused(id_);
  }
  return false;
}

} // namespace uniuno
