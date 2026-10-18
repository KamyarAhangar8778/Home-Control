#pragma once

#include "FutureBase.h"

namespace uniuno {

/**
 * @brief Specialization of Future for void input.
 * 
 * @tparam O The output type.
 * @tparam E The error type.
 */
template <typename O, typename E> class Future<void, O, E> {
public:
  Future(FastFunction<AsyncResult<O, E>(), 64> callback) {
    this->poll_callback = std::move(callback);
    this->result = AsyncResult<O, E>::pending();
  }

  static Future<void, O, E> resolve(O output) {
    return Future<void, O, E>(
        [output = std::move(output)]() mutable { return AsyncResult<O, E>::resolve(output); });
  }

  static Future<void, O, E> reject(E error) {
    return Future<void, O, E>(
        [error = std::move(error)]() mutable { return AsyncResult<O, E>::reject(error); });
  }

  HOT_PATH AsyncResult<O, E> poll() {
    if (LIKELY(this->result.is_pending())) {
      this->result = this->poll_callback();
    }
    return this->result;
  }

  template <typename N, typename G = Error>
  Future<void, N, G> and_then(Future<O, N, G> next_future) {
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

      return next_future.poll(*this_future.result.get_value());
    });
  }

  template <class F>
  auto and_then(F &&fn) -> Future<void, decltype(fn(std::declval<O>()))> {
    return this->into_future(std::forward<F>(fn));
  }

  AsyncResult<O, E> result;

private:
  template <class F,
            typename std::enable_if<
                std::is_same<typename function_traits<F>::template arg<0>::type,
                             O>::value &&
                !std::is_same<typename function_traits<F>::result_type,
                              void>::value>::type * = nullptr>
  auto into_future(F &&fn) -> Future<void, decltype(fn(std::declval<O>()))> {
    using OutputType = decltype(fn(std::declval<O>()));
    return this->and_then<OutputType>(
        Future<O, OutputType>([fn = std::forward<F>(fn)](const O& input) mutable {
          return AsyncResult<OutputType>::resolve(fn(input));
        }));
  }

  template <class F,
            typename std::enable_if<
                std::is_same<typename function_traits<F>::template arg<0>::type,
                             O>::value &&
                std::is_same<typename function_traits<F>::result_type,
                             void>::value>::type * = nullptr>
  auto into_future(F &&fn) -> Future<void, decltype(fn(std::declval<O>()))> {
    using OutputType = decltype(fn(std::declval<O>()));
    return this->and_then<OutputType>(
        Future<O, OutputType>([fn = std::forward<F>(fn)](const O& input) mutable {
          fn(input);
          return AsyncResult<void>::resolve();
        }));
  }

  FastFunction<AsyncResult<O, E>(), 64> poll_callback;
};

} // namespace uniuno
