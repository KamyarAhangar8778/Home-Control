#pragma once

#include <Future.h>

#ifndef ARDUINO
#include <native/millis.h>
#endif

#define ERROR_FUTURE_TIMEOUT "operation timed out"

namespace uniuno {

/**
 * @brief Wraps a future with a timeout mechanism.
 * 
 * @tparam I The input type.
 * @tparam O The output type.
 * @tparam E The error type.
 * @param future The original future to wrap.
 * @param timeout_ms The timeout in milliseconds.
 * @return A future that will reject if it takes longer than timeout_ms.
 */
template <typename I, typename O, typename E = Error>
Future<I, O, E> create_timeout_future(Future<I, O, E> future,
                                      unsigned long timeout_ms = 5000) {
  unsigned long timeout_time = millis() + timeout_ms;
  return Future<I, O, E>([future = std::move(future), timeout_time](const I& input) mutable {
    if (UNLIKELY(millis() >= timeout_time && future.result.is_pending())) {
      return AsyncResult<O, E>::reject(E(ERROR_FUTURE_TIMEOUT));
    }

    return future.poll(input);
  });
}

/**
 * @brief Wraps a void-input future with a timeout mechanism.
 * 
 * @tparam O The output type.
 * @tparam E The error type.
 * @param future The original future to wrap.
 * @param timeout_ms The timeout in milliseconds.
 * @return A future that will reject if it takes longer than timeout_ms.
 */
template <typename O, typename E = Error>
Future<void, O, E> create_timeout_future(Future<void, O, E> future,
                                         unsigned long timeout_ms = 5000) {
  unsigned long timeout_time = millis() + timeout_ms;
  return Future<void, O, E>([future = std::move(future), timeout_time]() mutable {
    if (UNLIKELY(millis() >= timeout_time && future.result.is_pending())) {
      return AsyncResult<O, E>::reject(E(ERROR_FUTURE_TIMEOUT));
    }

    return future.poll();
  });
}

} // namespace uniuno