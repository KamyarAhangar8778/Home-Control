#pragma once

#include "FastFunctionDecl.h"

namespace uniuno {

// ---------------------------------------------------------------------------
// Default constructors
// ---------------------------------------------------------------------------

template<typename R, typename... Args, size_t Capacity>
FastFunction<R(Args...), Capacity>::FastFunction()
  : invoker_(nullptr), vtable_(nullptr) {
}

template<typename R, typename... Args, size_t Capacity>
FastFunction<R(Args...), Capacity>::FastFunction(std::nullptr_t)
  : invoker_(nullptr), vtable_(nullptr) {
}

// ---------------------------------------------------------------------------
// invoke_impl — static dispatcher, placed in IRAM
// ---------------------------------------------------------------------------

template<typename R, typename... Args, size_t Capacity>
template<typename DecayF>
R FastFunction<R(Args...), Capacity>::invoke_impl(void* storage, Args... args) {
  return (*static_cast<DecayF*>(storage))(std::forward<Args>(args)...);
}

// ---------------------------------------------------------------------------
// vtable_impl — VTable instance for type erasure
// ---------------------------------------------------------------------------

template<typename DecayF>
struct FastFunctionVTableImpl {
  static void destroy(void* dest) HOT_PATH {
    static_cast<DecayF*>(dest)->~DecayF();
  }

  static void move(void* __restrict__ dest, void* __restrict__ src) HOT_PATH {
    new (dest) DecayF(std::move(*static_cast<DecayF*>(src)));
    MEMORY_BARRIER();
  }

  static void copy(void* __restrict__ dest, const void* __restrict__ src) HOT_PATH {
    new (dest) DecayF(*static_cast<const DecayF*>(src));
    MEMORY_BARRIER();
  }

  static constexpr FastFunctionVTable vtable = {
    &destroy,
    &move,
    &copy
  };
};

// C++14 requires out-of-line definition for ODR-used constexpr static members
template<typename DecayF>
constexpr FastFunctionVTable FastFunctionVTableImpl<DecayF>::vtable;

// ---------------------------------------------------------------------------
// Main functor constructor
//
// Improvements vs original:
//  - Removed push_back loop (was O(N) with no purpose)
//  - reserve() + force_set_size() allocates the slot in one step
//  - Uses MEMORY_BARRIER() from CompilerTraits (Xtensa 'memw')
//  - Runtime trivially-managed check (C++14: no if constexpr available)
// ---------------------------------------------------------------------------

template<typename R, typename... Args, size_t Capacity>
template<typename F, typename>
FastFunction<R(Args...), Capacity>::FastFunction(F&& f) {
  using DecayF = typename std::decay<F>::type;

  // Reserve the exact storage needed without element-by-element push_back loop.
  // SmallVector handles dynamic grow if sizeof(DecayF) > inline Capacity.
  const size_t required_elements =
    (sizeof(DecayF) + sizeof(std::max_align_t) - 1) / sizeof(std::max_align_t);
  storage_.reserve(required_elements);
  storage_.force_set_size(required_elements);

  // Placement-new the functor directly into the aligned storage
  new (storage_.data()) DecayF(std::forward<F>(f));
  MEMORY_BARRIER();  // Ensure functor is fully written before invoker_ is assigned

  invoker_ = &invoke_impl<DecayF>;

  // Runtime trivially-managed check (compile-time branch in C++17, runtime in C++14)
  if (std::is_trivially_destructible<DecayF>::value &&
      std::is_trivially_move_constructible<DecayF>::value &&
      std::is_trivially_copy_constructible<DecayF>::value) {
    vtable_ = nullptr;
  } else {
    vtable_ = &FastFunctionVTableImpl<DecayF>::vtable;
  }
}

} // namespace uniuno
