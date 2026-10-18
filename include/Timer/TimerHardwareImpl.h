/**
 * @file TimerHardwareImpl.h
 * @brief Implementation of Timer class hardware timer functions
 * @author uniuno
 */

#pragma once

#include "Timer/Timer.h"

namespace uniuno {

template <size_t MaxTimers>
inline bool TimerBase<MaxTimers>::startHardwareTimer(uint64_t interval_us) {
#ifdef ARDUINO
  hw_timer_active_ = HardwareTimerTrigger::start(this, interval_us);
  return hw_timer_active_;
#else
  (void)interval_us;
  return false;
#endif
}

template <size_t MaxTimers>
inline void TimerBase<MaxTimers>::stopHardwareTimer() {
#ifdef ARDUINO
  HardwareTimerTrigger::stop();
  hw_timer_active_ = false;
#endif
}

} // namespace uniuno
