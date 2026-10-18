#pragma once

#include <AsyncResult.h>
#include <function_traits.h>
#include <Optimization/FastFunction.h>
#include <Optimization/CompilerTraits.h>

namespace uniuno {

using namespace utils;

/**
 * @brief Represents a Future value that will be resolved or rejected asynchronously.
 * 
 * @tparam I The input type.
 * @tparam O The output type.
 * @tparam E The error type.
 */
template <typename I, typename O, typename E = Error> class Future {
public:
  /**
   * @brief Constructs a Future with a polling callback.
   * @param callback The function to execute on poll.
   */
  Future(FastFunction<AsyncResult<O, E>(const I&), 64> callback) {
    this->poll_callback = std::move(callback);
    this->result = AsyncResult<O, E>::pending();
  }

  /** @brief Creates an already resolved Future. */
  static Future<I, O, E> resolve(O output) {
    return Future<I, O, E>(
        [output = std::move(output)](const I&) mutable { return AsyncResult<O, E>::resolve(output); });
  }

  /** @brief Creates an already rejected Future. */
  static Future<I, O, E> reject(E error) {
    return Future<I, O, E>(
        [error = std::move(error)](const I&) mutable { return AsyncResult<O, E>::reject(error); });
  }

  /**
   * @brief Polls the future with the given input.
   * @param input The input value.
   * @return The current state of the future.
   */
  HOT_PATH AsyncResult<O, E> poll(const I& input) {
    if (LIKELY(this->result.is_pending())) {
      this->result = this->poll_callback(input);
    }
    return this->result;
  }

  /**
   * @brief Chains another future to be executed after this one resolves.
   * 
   * @tparam N The next output type.
   * @tparam G The next error type.
   * @param next_future The future to run next.
   * @return A new combined Future.
   */
  template <typename N, typename G = Error>
  Future<I, N, G> and_then(Future<O, N, G> next_future) {
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

      return next_future.poll(*this_future.result.get_value());
    });
  }

  /**
   * @brief Chains a function to be executed after this future resolves.
   * 
   * @tparam F The function type.
   * @param fn The function to execute.
   * @return A new combined Future.
   */
  template <typename F>
  auto and_then(F &&fn) -> Future<I, decltype(fn(std::declval<O>()))> {
    using OutputType = decltype(fn(std::declval<O>()));
    return this->and_then<OutputType>(
        Future<O, OutputType>([fn = std::forward<F>(fn)](const O& input) mutable {
          return AsyncResult<OutputType>::resolve(fn(input));
        }));
  }

  AsyncResult<O, E> result;

private:
  FastFunction<AsyncResult<O, E>(const I&), 64> poll_callback;
};

} // namespace uniuno
