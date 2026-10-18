#pragma once

#include "SmallVectorDecl.h"
#include <new>

namespace uniuno {

// ---------------------------------------------------------------------------
// Copy assignment
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
SmallVector<T, N, Allocator>& SmallVector<T, N, Allocator>::operator=(const SmallVector& other) {
  if (LIKELY(this != &other)) {
    clear();
    if (is_heap_) {
      this->freeHeap(data_);
    }
    capacity_ = other.capacity_;
    size_     = other.size_;
    is_heap_  = other.is_heap_;

    if (UNLIKELY(other.is_heap_)) {
      data_ = this->mallocForGrow(capacity_, sizeof(T));
      MEMORY_BARRIER();
    } else {
      data_ = stack_storage_;
    }

    if (std::is_trivially_copyable<T>::value) {
      std::memcpy(data_, other.data_, size_ * sizeof(T));
    } else {
      for (std::size_t i = 0; i < size_; i++) {
        new (&this->data()[i]) T(other.data()[i]);
      }
    }
  }
  return *this;
}

// ---------------------------------------------------------------------------
// Move constructor
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
SmallVector<T, N, Allocator>::SmallVector(SmallVector&& other) noexcept
    : ArrayBase(stack_storage_, N, false) {
  capacity_ = other.capacity_;
  size_     = other.size_;
  is_heap_  = other.is_heap_;

  if (UNLIKELY(other.is_heap_)) {
    data_           = other.data_;
    other.data_     = other.stack_storage_;
    other.size_     = 0;
    other.is_heap_  = false;
    other.capacity_ = N;
  } else {
    if (std::is_trivially_copyable<T>::value) {
      std::memcpy(data_, other.data_, size_ * sizeof(T));
    } else {
      for (std::size_t i = 0; i < size_; i++) {
        new (&this->data()[i]) T(std::move(other.data()[i]));
        other.data()[i].~T();
      }
    }
    other.size_ = 0;
  }
}

// ---------------------------------------------------------------------------
// Move assignment
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
SmallVector<T, N, Allocator>& SmallVector<T, N, Allocator>::operator=(SmallVector&& other) noexcept {
  if (LIKELY(this != &other)) {
    clear();
    if (is_heap_) { this->freeHeap(data_); }

    capacity_ = other.capacity_;
    size_     = other.size_;
    is_heap_  = other.is_heap_;

    if (UNLIKELY(other.is_heap_)) {
      data_           = other.data_;
      other.data_     = other.stack_storage_;
      other.size_     = 0;
      other.is_heap_  = false;
      other.capacity_ = N;
    } else {
      data_ = stack_storage_;
      if (std::is_trivially_copyable<T>::value) {
        std::memcpy(data_, other.data_, size_ * sizeof(T));
      } else {
        for (std::size_t i = 0; i < size_; i++) {
          new (&this->data()[i]) T(std::move(other.data()[i]));
          other.data()[i].~T();
        }
      }
      other.size_ = 0;
    }
  }
  return *this;
}

// ---------------------------------------------------------------------------
// Initializer list assignment
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
SmallVector<T, N, Allocator>& SmallVector<T, N, Allocator>::operator=(std::initializer_list<T> init) {
  clear();
  std::size_t init_size = init.size();
  if (init_size > capacity_) {
    if (is_heap_) { this->freeHeap(data_); }
    data_     = this->mallocForGrow(init_size, sizeof(T));
    capacity_ = init_size;
    is_heap_  = true;
    MEMORY_BARRIER();
  }
  size_ = init_size;

  if (std::is_trivially_copyable<T>::value) {
    std::memcpy(data_, init.begin(), size_ * sizeof(T));
  } else {
    std::size_t i = 0;
    for (const T& val : init) {
      new (&this->data()[i++]) T(val);
    }
  }
  return *this;
}

} // namespace uniuno
