#pragma once

#include "FutureBase.h"

namespace uniuno {

/**
 * @brief Specialization of Future for void input and void output.
 * 
 * @tparam E The error type.
 */
template <typename E> class Future<void, void, E> {
public:
  Future(FastFunction<AsyncResult<void, E>(), 64> callback) {
    this->poll_callback = std::move(callback);
    this->result = AsyncResult<void, E>::pending();
  }

  static Future<void, void, E> resolve() {
    return Future<void, void, E>(
        []() { return AsyncResult<void, E>::resolve(); });
  }

  static Future<void, void, E> reject(E error) {
    return Future<void, void, E>(
        [error = std::move(error)]() mutable { return AsyncResult<void, E>::reject(error); });
  }

  HOT_PATH AsyncResult<void, E> poll() {
    if (LIKELY(this->result.is_pending())) {
      this->result = this->poll_callback();
    }
    return this->result;
  }

  template <typename N, typename G = Error>
  Future<void, N, G> and_then(Future<void, N, G> next_future) {
    return Future<void, N, G>([this_future = std::move(*this), next_future = std::move(next_future)]() mutable -> AsyncResult<N, G> {
      if (this_future.result.is_pending()) {
        this_future.poll();
      }

      if (this_future.result.is_pending()) {
        return AsyncResult<N, G>::pending();
      }

      if (UNLIKELY(this_future.result.is_rejected())) {
        return AsyncResult<N, G>::reject(G(*this_future.result.get_error()));
      }

      return next_future.poll();
    });
  }

  template <class F> auto and_then(F &&fn) -> Future<void, decltype(fn())> {
    return this->into_future(std::forward<F>(fn));
  }

  AsyncResult<void, E> result;

private:
  template <class F, typename std::enable_if<
                         !std::is_same<typename function_traits<F>::result_type,
                                       void>::value>::type * = nullptr>
  auto into_future(F &&fn) -> Future<void, decltype(fn())> {
    using OutputType = decltype(fn());
    return this->and_then<OutputType>(Future<void, OutputType>(
        [fn = std::forward<F>(fn)]() mutable { return AsyncResult<OutputType>::resolve(fn()); }));
  }

  template <class F, typename std::enable_if<
                         std::is_same<typename function_traits<F>::result_type,
                                      void>::value>::type * = nullptr>
  auto into_future(F &&fn) -> Future<void, decltype(fn())> {
    return this->and_then<void>(Future<void, void>([fn = std::forward<F>(fn)]() mutable {
      fn();
      return AsyncResult<void>::resolve();
    }));
  }

  FastFunction<AsyncResult<void, E>(), 64> poll_callback;
};

} // namespace uniuno
