#pragma once

#include <Error.h>
#include <Optimization/CompilerTraits.h>
#include <utility>

namespace uniuno {

/**
 * @brief Represents the state of an asynchronous operation.
 */
enum AsyncState { Pending = 0, Resolved, Rejected };

/**
 * @brief A container for the result of an asynchronous operation.
 * Optimized for speed over RAM usage.
 * 
 * @tparam T The type of the resolved value.
 * @tparam E The type of the error.
 */
template <typename T, typename E = Error> class AsyncResult {
public:
  static FORCE_INLINE AsyncResult<T, E> pending() { return AsyncResult<T, E>(); }
  static FORCE_INLINE AsyncResult<T, E> reject(E err) { return AsyncResult<T, E>(std::move(err)); }
  static FORCE_INLINE AsyncResult<T, E> resolve(T input) { return AsyncResult<T, E>(std::move(input)); }

  FORCE_INLINE AsyncResult() { this->state = AsyncState::Pending; }
  FORCE_INLINE AsyncResult(T input) {
    this->value = std::move(input);
    this->state = AsyncState::Resolved;
  }

  FORCE_INLINE AsyncResult(E e) {
    this->err = std::move(e);
    this->state = AsyncState::Rejected;
  }

  FORCE_INLINE bool is_pending() const { return this->state == AsyncState::Pending; }
  FORCE_INLINE bool is_resolved() const { return this->state == AsyncState::Resolved; }
  FORCE_INLINE bool is_rejected() const { return this->state == AsyncState::Rejected; }

  FORCE_INLINE T *get_value() { return LIKELY(this->is_resolved()) ? &value : nullptr; }
  FORCE_INLINE const T *get_value() const { return LIKELY(this->is_resolved()) ? &value : nullptr; }
  
  FORCE_INLINE E *get_error() { return UNLIKELY(this->is_rejected()) ? &err : nullptr; }
  FORCE_INLINE const E *get_error() const { return UNLIKELY(this->is_rejected()) ? &err : nullptr; }
  
  FORCE_INLINE AsyncState get_state() const { return this->state; }

private:
  AsyncState state;
  T value;
  E err;
};

/**
 * @brief Specialization for void return types.
 * 
 * @tparam E The type of the error.
 */
template <typename E> class AsyncResult<void, E> {
public:
  static FORCE_INLINE AsyncResult<void, E> pending() { return AsyncResult<void, E>(AsyncState::Pending); }
  static FORCE_INLINE AsyncResult<void, E> reject(E err) { return AsyncResult<void, E>(std::move(err)); }
  static FORCE_INLINE AsyncResult<void, E> resolve() { return AsyncResult<void, E>(AsyncState::Resolved); }

  FORCE_INLINE AsyncResult() { this->state = AsyncState::Pending; }
  FORCE_INLINE AsyncResult(AsyncState state) { this->state = state; }
  FORCE_INLINE AsyncResult(E e) {
    this->err = std::move(e);
    this->state = AsyncState::Rejected;
  }

  FORCE_INLINE bool is_pending() const { return this->state == AsyncState::Pending; }
  FORCE_INLINE bool is_resolved() const { return this->state == AsyncState::Resolved; }
  FORCE_INLINE bool is_rejected() const { return this->state == AsyncState::Rejected; }

  FORCE_INLINE E *get_error() { return UNLIKELY(this->is_rejected()) ? &err : nullptr; }
  FORCE_INLINE const E *get_error() const { return UNLIKELY(this->is_rejected()) ? &err : nullptr; }
  
  FORCE_INLINE AsyncState get_state() const { return this->state; }

private:
  AsyncState state;
  E err;
};

} // namespace uniuno