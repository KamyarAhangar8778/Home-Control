#pragma once

#include "SmallVectorDecl.h"
#include <new>

namespace uniuno {

// ---------------------------------------------------------------------------
// erase by index
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
FORCE_INLINE void SmallVector<T, N, Allocator>::erase(std::size_t index) {
  if (std::is_trivially_copyable<T>::value) {
    erase_pod(index, sizeof(T));
  } else {
    if (UNLIKELY(index >= size_)) return;

    for (std::size_t i = index; i < size_ - 1; i++) {
      this->data()[i] = std::move(this->data()[i + 1]);
    }
    this->data()[size_ - 1].~T();
    size_--;
  }
}

// ---------------------------------------------------------------------------
// erase by pointer
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
FORCE_INLINE T* SmallVector<T, N, Allocator>::erase(T* pos) {
  if (UNLIKELY(pos < begin() || pos >= end())) return end();
  std::size_t index = static_cast<std::size_t>(pos - begin());
  erase(index);
  return begin() + index;
}

// ---------------------------------------------------------------------------
// insert
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
void SmallVector<T, N, Allocator>::insert(T* pos, T&& value) {
  std::size_t index = static_cast<std::size_t>(pos - begin());
  if (UNLIKELY(size_ >= capacity_)) {
    reserve(capacity_ * 2);
  }
  if (std::is_trivially_copyable<T>::value) {
    insert_pod(index, &value, sizeof(T));
    // insert_pod moves memory and inserts value for POD types; no destructor needed
  } else {
    for (std::size_t i = size_; i > index; i--) {
      new (&this->data()[i]) T(std::move(this->data()[i - 1]));
      this->data()[i - 1].~T();
    }
    new (&this->data()[index]) T(std::move(value));
    size_++;
  }
}

// ---------------------------------------------------------------------------
// erase range [first, last)
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
T* SmallVector<T, N, Allocator>::erase(T* first, T* last) {
  if (UNLIKELY(first >= last || first < begin() || last > end())) return end();

  std::size_t start_idx = static_cast<std::size_t>(first - begin());
  std::size_t end_idx   = static_cast<std::size_t>(last  - begin());
  std::size_t count     = end_idx - start_idx;

  if (std::is_trivially_copyable<T>::value) {
    erase_pod_range(start_idx, end_idx, sizeof(T));
  } else {
    for (std::size_t i = end_idx; i < size_; i++) {
      this->data()[i - count] = std::move(this->data()[i]);
    }
    for (std::size_t i = size_ - count; i < size_; i++) {
      this->data()[i].~T();
    }
    size_ -= count;
  }

  return begin() + start_idx;
}

} // namespace uniuno
