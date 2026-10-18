#pragma once

#include <Future.h>
#include <function_traits.h>
#include <Optimization/FastFunction.h>
#include <Optimization/CompilerTraits.h>
#include <utility>

namespace uniuno {

/**
 * @brief Manages the polling and execution of multiple Futures.
 * Highly optimized for speed using a Dense Set (Pointer swap-and-pop)
 * algorithm, exploiting RAM to achieve O(active_count) iteration 
 * with zero large memory copies.
 * 
 * @tparam Capacity Maximum number of concurrently executing futures.
 */
template <size_t Capacity = 32>
class ExecutorBase {
public:
  ExecutorBase() {
    for (size_t i = 0; i < Capacity; i++) {
      this->free_futures[i] = &this->future_pool[i];
    }
    this->free_count = Capacity;
    this->active_count = 0;
  }

  /**
   * @brief Schedule a future for execution with an input and an error callback.
   * @return true if successfully scheduled, false if the executor is full.
   */
  template <typename I, typename O, typename E = Error, class F,
            typename std::enable_if<
                function_traits<F>::arity == 1 &&
                std::is_same<typename function_traits<F>::template arg<0>::type,
                             E>::value>::type * = nullptr>
  bool execute(Future<I, O, E> future, I input, F &&on_error) {
    if (UNLIKELY(this->free_count == 0)) return false;
    
    auto* slot = this->free_futures[--this->free_count];
    *slot = [future = std::move(future), input = std::move(input), on_error = std::forward<F>(on_error)]() mutable {
      auto result = future.poll(input);
      if (UNLIKELY(result.is_rejected())) {
        on_error(*result.get_error());
      }
      return result.get_state();
    };
    
    this->active_futures[this->active_count++] = slot;
    return true;
  }

  /**
   * @brief Schedule a future for execution without input and an error callback.
   * @return true if successfully scheduled, false if the executor is full.
   */
  template <typename O, typename E = Error, class F,
            typename std::enable_if<
                function_traits<F>::arity == 1 &&
                std::is_same<typename function_traits<F>::template arg<0>::type,
                             E>::value>::type * = nullptr>
  bool execute(Future<void, O, E> future, F &&on_error) {
    if (UNLIKELY(this->free_count == 0)) return false;
    
    auto* slot = this->free_futures[--this->free_count];
    *slot = [future = std::move(future), on_error = std::forward<F>(on_error)]() mutable {
      auto result = future.poll();
      if (UNLIKELY(result.is_rejected())) {
        on_error(*result.get_error());
      }
      return result.get_state();
    };
    
    this->active_futures[this->active_count++] = slot;
    return true;
  }

  template <typename I, typename O, typename E = Error>
  bool execute(Future<I, O, E> future, I input) {
    return this->execute(std::move(future), std::move(input), [](E) {});
  }

  template <typename O, typename E = Error>
  bool execute(Future<void, O, E> future) {
    return this->execute(std::move(future), [](E) {});
  }

  /**
   * @brief Polls all active futures.
   * Uses O(1) swap-and-pop pointer arrays to completely eliminate 
   * empty slot checking and 128-byte memory moves.
   */
  HOT_PATH void poll() {
    if (LIKELY(this->active_count == 0)) return; // Fast-path out

    size_t i = 0;
    while (i < this->active_count) {
      auto* f = this->active_futures[i];
      if ((*f)() != AsyncState::Pending) {
        f->clear(); // Free captured lambda memory
        this->free_futures[this->free_count++] = f;
        // O(1) pointer swap-and-pop
        this->active_futures[i] = this->active_futures[--this->active_count];
      } else {
        i++;
      }
    }
  }

private:
  FastFunction<AsyncState(void), 128> future_pool[Capacity];
  FastFunction<AsyncState(void), 128>* active_futures[Capacity];
  FastFunction<AsyncState(void), 128>* free_futures[Capacity];
  size_t active_count;
  size_t free_count;
};

using Executor = ExecutorBase<32>;

} // namespace uniuno