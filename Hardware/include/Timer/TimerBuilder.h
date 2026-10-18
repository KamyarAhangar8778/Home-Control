/**
 * @file TimerBuilder.h
 * @brief Builder pattern for Timer configuration
 * @author uniuno
 * 
 * PURPOSE: Provide fluent API for Timer construction
 * 
 * USAGE:
 * @code
 *   Timer timer = TimerBuilder()
 *       .withEventDispatcher(&dispatcher)
 *       .build();
 * @endcode
 */

#pragma once

#include "Timer.h"

namespace uniuno {

/**
 * @class TimerBuilder
 * @brief Fluent builder for Timer configuration
 */
class TimerBuilder {
public:
  TimerBuilder() 
    : time_source_(millis)
#ifdef TIMER_EVENTS_ENABLED
    , dispatcher_(nullptr)
#endif
  {}

  TimerBuilder& withTimeSource(unsigned long (*source)()) {
    time_source_ = source;
    return *this;
  }

#ifdef TIMER_EVENTS_ENABLED
  TimerBuilder& withEventDispatcher(EventDispatcher* dispatcher) {
    dispatcher_ = dispatcher;
    return *this;
  }
#endif

  Timer* build() {
    TimerFeatures features;
#ifdef TIMER_EVENTS_ENABLED
    return new Timer(features, time_source_, dispatcher_);
#else
    return new Timer(features, time_source_);
#endif
  }

private:
  unsigned long (*time_source_)();
#ifdef TIMER_EVENTS_ENABLED
  EventDispatcher* dispatcher_;
#endif
};

} // namespace uniuno
