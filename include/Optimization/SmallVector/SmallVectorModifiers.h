#pragma once

#include "SmallVectorDecl.h"
#include <new>

namespace uniuno {

template<typename T, std::size_t N, typename Allocator>
void SmallVector<T, N, Allocator>::reserve(std::size_t new_cap) {
  if (std::is_trivially_copyable<T>::value) {
    reserve_pod(new_cap, sizeof(T));
  } else {
    if (UNLIKELY(new_cap <= capacity_)) return;  // [C/Assembly Level] Branch prediction
    void* new_data = mallocForGrow(new_cap, sizeof(T));
    if (UNLIKELY(!new_data)) return;

    for (std::size_t i = 0; i < size_; i++) {
      new (static_cast<T*>(new_data) + i) T(std::move(this->data()[i]));
      this->data()[i].~T();
    }

    MEMORY_BARRIER();  // Ensure all moves are visible before pointer swap
    freeHeap(is_heap_ ? data_ : nullptr);
    data_     = new_data;
    capacity_ = new_cap;
    is_heap_  = true;
  }
}

template<typename T, std::size_t N, typename Allocator>
FORCE_INLINE void SmallVector<T, N, Allocator>::push_back(const T& value) {
  if (UNLIKELY(size_ >= capacity_)) {
    reserve(capacity_ * 2);
  }
  new (&this->data()[size_]) T(value);
  size_++;
}

template<typename T, std::size_t N, typename Allocator>
FORCE_INLINE void SmallVector<T, N, Allocator>::push_back(T&& value) {
  if (UNLIKELY(size_ >= capacity_)) {
    reserve(capacity_ * 2);
  }
  new (&this->data()[size_]) T(std::move(value));
  size_++;
}

template<typename T, std::size_t N, typename Allocator>
template<typename... Args>
FORCE_INLINE void SmallVector<T, N, Allocator>::emplace_back(Args&&... args) {
  if (UNLIKELY(size_ >= capacity_)) {
    reserve(capacity_ * 2);
  }
  new (&this->data()[size_]) T(std::forward<Args>(args)...);
  size_++;
}

template<typename T, std::size_t N, typename Allocator>
FORCE_INLINE void SmallVector<T, N, Allocator>::pop_back() {
  if (LIKELY(size_ > 0)) {
    size_--;
    if (!std::is_trivially_destructible<T>::value) {
      this->data()[size_].~T();
    }
  }
}

template<typename T, std::size_t N, typename Allocator>
void SmallVector<T, N, Allocator>::clear() {
  if (!std::is_trivially_destructible<T>::value) {
    // Only call destructors if the type requires it. Otherwise, zero cost in assembly.
    for (std::size_t i = 0; i < size_; i++) {
      this->data()[i].~T();
    }
  }
  size_ = 0;
}

} // namespace uniuno
