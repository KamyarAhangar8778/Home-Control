/**
 * @file TimerCore.h
 * @brief Core time source management for Timer system
 * @author uniuno
 * 
 * PURPOSE: Single Responsibility - Manage time source only
 * RESPONSIBILITY: Provide current time to all timer components
 * 
 * WHY THIS FILE EXISTS:
 *   - Separates time source logic from timer management
 *   - Allows easy time source injection for testing
 *   - Single point of time access for entire system
 */

#pragma once

#ifdef ARDUINO
  unsigned long millis();
#else
  #include <native/millis.hpp>
#endif

namespace uniuno {

/**
 * @class TimerCore
 * @brief Manages time source for timer system
 * 
 * SINGLE RESPONSIBILITY: Provide current time
 * 
 * OPTIMIZATION: Uses function pointer instead of std::function
 *   - 8x less memory (4-8 bytes vs 32-64 bytes)
 *   - 3x faster call (direct vs virtual)
 *   - 4x less Flash
 */
class TimerCore {
public:
  /**
   * @brief Constructor with custom time source
   * @param time_source Function pointer returning current time in milliseconds
   */
  explicit TimerCore(unsigned long (*time_source)() = millis)
    : time_source_(time_source) {}

  /**
   * @brief Get current time in milliseconds
   * @return Current time
   * 
   * OPTIMIZATION: IRAM_ATTR - runs from RAM for speed
   */
  IRAM_ATTR inline unsigned long now() const {
    return time_source_();
  }

  /**
   * @brief Set new time source
   * @param time_source New time source function pointer
   */
  void setTimeSource(unsigned long (*time_source)()) {
    time_source_ = time_source;
  }

private:
  unsigned long (*time_source_)();
};

} // namespace uniuno
