#pragma once

#include "FutureBase.h"

namespace uniuno {

/**
 * @brief Trait to extract the result type from an AsyncResult.
 * 
 * @tparam T The AsyncResult type.
 */
template <typename T> struct async_result_trait {};

/**
 * @brief Specialization to extract ResultType.
 */
template <typename ResultType>
struct async_result_trait<AsyncResult<ResultType>> {
  typedef ResultType result_type;
};

/**
 * @brief Creates a Future from a polling function that takes 1 argument.
 * 
 * @param poll_fn The polling function.
 * @return A constructed Future.
 */
template <class F, typename std::enable_if<function_traits<F>::arity == 1>::type
                       * = nullptr>
auto create_future(F &&poll_fn)
    -> Future<typename function_traits<F>::template arg<0>::type,
              typename async_result_trait<
                  typename function_traits<F>::result_type>::result_type> {
  return Future<typename function_traits<F>::template arg<0>::type,
                typename async_result_trait<
                    typename function_traits<F>::result_type>::result_type>(
      std::forward<F>(poll_fn));
}

/**
 * @brief Creates a Future from a polling function that takes 0 arguments (void input).
 * 
 * @param poll_fn The polling function.
 * @return A constructed Future.
 */
template <class F, typename std::enable_if<function_traits<F>::arity == 0>::type
                       * = nullptr>
auto create_future(F &&poll_fn)
    -> Future<void, typename async_result_trait<typename function_traits<
                        F>::result_type>::result_type> {
  return Future<void, typename async_result_trait<typename function_traits<
                          F>::result_type>::result_type>(std::forward<F>(poll_fn));
}

} // namespace uniuno
