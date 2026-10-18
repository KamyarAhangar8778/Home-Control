#pragma once

#include "FutureBase.h"

namespace uniuno {

/**
 * @brief Specialization of Future for void output.
 * 
 * @tparam I The input type.
 * @tparam E The error type.
 */
template <typename I, typename E> class Future<I, void, E> {
public:
  Future(FastFunction<AsyncResult<void, E>(const I&), 64> callback) {
    this->poll_callback = std::move(callback);
    this->result = AsyncResult<void, E>::pending();
  }

  static Future<I, void, E> resolve() {
    return Future<I, void, E>([](const I&) { return AsyncResult<void, E>::resolve(); });
  }

  static Future<I, void, E> reject(E error) {
    return Future<I, void, E>(
        [error = std::move(error)](const I&) mutable { return AsyncResult<void, E>::reject(error); });
  }

  HOT_PATH AsyncResult<void, E> poll(const I& input) {
    if (LIKELY(this->result.is_pending())) {
      this->result = this->poll_callback(input);
    }
    return this->result;
  }

  template <typename N, typename G = Error>
  Future<I, N, G> and_then(Future<void, N, G> next_future) {
    return Future<I, N, G>([this_future = std::move(*this), next_future = std::move(next_future)](const I& input) mutable -> AsyncResult<N, G> {
      if (this_future.result.is_pending()) {
        this_future.poll(input);
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

  template <typename F> auto and_then(F &&fn) -> Future<I, decltype(fn())> {
    using OutputType = decltype(fn());
    return this->and_then<OutputType>(Future<void, OutputType>(
        [fn = std::forward<F>(fn)]() mutable { return AsyncResult<OutputType>::resolve(fn()); }));
  }

  AsyncResult<void, E> result;

private:
  FastFunction<AsyncResult<void, E>(const I&), 64> poll_callback;
};

} // namespace uniuno
