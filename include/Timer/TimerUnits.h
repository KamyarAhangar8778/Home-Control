/**
 * @file TimerUnits.h
 * @brief Time unit conversion helpers
 * @author uniuno
 * 
 * PURPOSE: Provide convenient time unit conversions for better readability
 * 
 * USAGE:
 * @code
 *   timer.set_timeout(callback, seconds(5));
 *   timer.set_timeout(callback, minutes(2));
 *   timer.set_timeout(callback, hours(1));
 * @endcode
 */

#pragma once

namespace uniuno {

/**
 * @brief Convert seconds to milliseconds
 * @param s Seconds
 * @return Milliseconds
 * 
 * @code
 *   timer.set_timeout(callback, seconds(60));  // 60 seconds = 60000ms
 * @endcode
 */
inline constexpr unsigned long seconds(unsigned long s) {
  return s * 1000UL;
}

/**
 * @brief Convert minutes to milliseconds
 * @param m Minutes
 * @return Milliseconds
 * 
 * @code
 *   timer.set_timeout(callback, minutes(5));  // 5 minutes = 300000ms
 * @endcode
 */
inline constexpr unsigned long minutes(unsigned long m) {
  return m * 60000UL;
}

/**
 * @brief Convert hours to milliseconds
 * @param h Hours
 * @return Milliseconds
 * 
 * @code
 *   timer.set_timeout(callback, hours(2));  // 2 hours = 7200000ms
 * @endcode
 */
inline constexpr unsigned long hours(unsigned long h) {
  return h * 3600000UL;
}

/**
 * @brief Convert days to milliseconds
 * @param d Days
 * @return Milliseconds
 * 
 * @note Maximum ~49 days due to unsigned long limit
 * 
 * @code
 *   timer.set_timeout(callback, days(1));  // 1 day = 86400000ms
 * @endcode
 */
inline constexpr unsigned long days(unsigned long d) {
  return d * 86400000UL;
}

} // namespace uniuno
