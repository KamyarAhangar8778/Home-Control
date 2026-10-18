#pragma once

#include <Future.h>

#ifndef ARDUINO
#include <native/millis.h>
#endif

namespace uniuno {

/**
 * @brief Helper function to check if the wait time has elapsed.
 * 
 * @param timeout_time The time to wait for in ms.
 * @return Resolved state if elapsed, Pending otherwise.
 */
inline AsyncResult<void> get_wait_async_state(unsigned long timeout_time) {
  if (timeout_time <= millis()) {
    return AsyncResult<void>::resolve();
  }

  return AsyncResult<void>::pending();
}

/**
 * @brief Creates a future that resolves after a specified delay.
 * 
 * @tparam I The input type.
 * @param timeout_ms Delay in milliseconds.
 * @return A future that resolves after the delay.
 */
template <typename I = void>
Future<I, void> create_wait_future(unsigned long timeout_ms) {
  unsigned long timeout_time = millis() + timeout_ms;
  return Future<I, void>(
      [timeout_time](I) { return get_wait_async_state(timeout_time); });
}

/**
 * @brief Creates a void-input future that resolves after a specified delay.
 * 
 * @param timeout_ms Delay in milliseconds.
 * @return A future that resolves after the delay.
 */
template <> inline Future<void, void> create_wait_future(unsigned long timeout_ms) {
  unsigned long timeout_time = millis() + timeout_ms;
  return Future<void, void>(
      [timeout_time]() { return get_wait_async_state(timeout_time); });
}

} // namespace uniuno