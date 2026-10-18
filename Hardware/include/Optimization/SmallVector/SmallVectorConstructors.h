#pragma once

#include "SmallVectorDecl.h"
#include <new>

namespace uniuno {

// ---------------------------------------------------------------------------
// Default constructor
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
SmallVector<T, N, Allocator>::SmallVector() : ArrayBase(stack_storage_, N, false) {
}

// ---------------------------------------------------------------------------
// Destructor
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
SmallVector<T, N, Allocator>::~SmallVector() {
  clear(); // Calls element destructors, then base class frees heap if needed
}

// ---------------------------------------------------------------------------
// Copy constructor
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
SmallVector<T, N, Allocator>::SmallVector(const SmallVector& other)
    : ArrayBase(stack_storage_, N, false) {
  capacity_ = other.capacity_;
  size_     = other.size_;
  is_heap_  = other.is_heap_;

  if (UNLIKELY(other.is_heap_)) {
    data_ = this->mallocForGrow(capacity_, sizeof(T));
    MEMORY_BARRIER(); // Ensure pointer is visible before writes
  }

  if (std::is_trivially_copyable<T>::value) {
    // [C/Assembly Level] Extremely fast bulk memory copy via optimized assembly
    std::memcpy(data_, other.data_, size_ * sizeof(T));
  } else {
    for (std::size_t i = 0; i < size_; i++) {
      new (&this->data()[i]) T(other.data()[i]);
    }
  }
}

// ---------------------------------------------------------------------------
// Initializer list constructor
// ---------------------------------------------------------------------------
template<typename T, std::size_t N, typename Allocator>
SmallVector<T, N, Allocator>::SmallVector(std::initializer_list<T> init)
    : ArrayBase(stack_storage_, N, false) {
  std::size_t init_size = init.size();
  if (UNLIKELY(init_size > N)) {
    data_     = this->mallocForGrow(init_size, sizeof(T));
    capacity_ = init_size;
    is_heap_  = true;
    MEMORY_BARRIER();
  }
  size_ = init_size;

  if (std::is_trivially_copyable<T>::value) {
    // [C/Assembly Level] Fast bulk memory copy
    std::memcpy(data_, init.begin(), size_ * sizeof(T));
  } else {
    std::size_t i = 0;
    for (const T& val : init) {
      new (&this->data()[i++]) T(val);
    }
  }
}

} // namespace uniuno
