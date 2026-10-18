#pragma once

#include "FutureBase.h"

namespace uniuno {

/**
 * @brief Combinator utilities for Futures.
 * These allow joining multiple asynchronous tasks.
 */
struct FutureCombinators {

  /**
   * @brief Combines two futures, resolving only when both are resolved.
   * If any future rejects, the combined future rejects immediately.
   * 
   * @tparam E The error type for both futures.
   * @param f1 First future.
   * @param f2 Second future.
   * @return A combined future.
   */
  template <typename E>
  static Future<void, void, E> all(Future<void, void, E> f1, Future<void, void, E> f2) {
    return Future<void, void, E>([f1 = std::move(f1), f2 = std::move(f2)]() mutable -> AsyncResult<void, E> {
      if (f1.result.is_pending()) f1.poll();
      if (f2.result.is_pending()) f2.poll();
      
      if (f1.result.is_rejected()) return AsyncResult<void, E>::reject(*f1.result.get_error());
      if (f2.result.is_rejected()) return AsyncResult<void, E>::reject(*f2.result.get_error());
      
      if (!f1.result.is_pending() && !f2.result.is_pending()) {
        return AsyncResult<void, E>::resolve();
      }
      return AsyncResult<void, E>::pending();
    });
  }

  /**
   * @brief Returns a future that resolves or rejects as soon as one of the futures does.
   * 
   * @tparam E The error type for both futures.
   * @param f1 First future.
   * @param f2 Second future.
   * @return A race future.
   */
  template <typename E>
  static Future<void, void, E> race(Future<void, void, E> f1, Future<void, void, E> f2) {
    return Future<void, void, E>([f1 = std::move(f1), f2 = std::move(f2)]() mutable -> AsyncResult<void, E> {
      if (f1.result.is_pending()) f1.poll();
      if (!f1.result.is_pending()) return f1.result;
      
      if (f2.result.is_pending()) f2.poll();
      if (!f2.result.is_pending()) return f2.result;
      
      return AsyncResult<void, E>::pending();
    });
  }

};

} // namespace uniuno
