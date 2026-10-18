/**
 * @file TimerHardwareImpl.h
 * @brief Implementation of Timer class hardware timer functions
 * @author uniuno
 */

#pragma once

#include "Timer/Timer.h"

namespace uniuno {

inline bool Timer::startHardwareTimer(uint64_t interval_us) {
#ifdef ARDUINO
  hw_timer_active_ = HardwareTimerTrigger::start(this, interval_us);
  return hw_timer_active_;
#else
  (void)interval_us;
  return false;
#endif
}

inline void Timer::stopHardwareTimer() {
#ifdef ARDUINO
  HardwareTimerTrigger::stop();
  hw_timer_active_ = false;
#endif
}

} // namespace uniuno
