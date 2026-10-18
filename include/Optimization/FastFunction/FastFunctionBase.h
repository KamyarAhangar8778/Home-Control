#pragma once

#include <cstddef>
#include <utility>
#include <new>
#include <type_traits>
#include "Optimization/CompilerTraits.h"  // FORCE_INLINE, LIKELY, UNLIKELY, MEMORY_BARRIER
#include "Optimization/TypeTraits.h"      // returns_void_v

namespace uniuno {

struct FastFunctionVTable {
  void (*destroy)(void* dest);
  void (*move)(void* __restrict__ dest, void* __restrict__ src);
  void (*copy)(void* __restrict__ dest, const void* __restrict__ src);
};

template<typename Signature, size_t Capacity = 32>
class FastFunction;

} // namespace uniuno
