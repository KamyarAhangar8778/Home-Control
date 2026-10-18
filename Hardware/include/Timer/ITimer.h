#pragma once

namespace uniuno {

struct TimerId;

/**
 * @class ITimer
 * @brief Abstract interface for Timer instances.
 * Allows handles and decoupled components to manage timers
 * without knowing their template capacity parameters.
 */
class ITimer {
public:
  virtual ~ITimer() = default;
  
  virtual void clear_timeout(TimerId timeoutId) = 0;
  virtual void clear_interval(TimerId interval_id) = 0;
  virtual bool pause(TimerId id) = 0;
  virtual bool resume(TimerId id) = 0;
  virtual bool isPaused(TimerId id) const = 0;
  virtual void tick() = 0;
};

} // namespace uniuno
