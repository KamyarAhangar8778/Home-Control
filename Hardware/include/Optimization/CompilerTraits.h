#pragma once

// ============================================================================
// COMPILER C-LEVEL OPTIMIZATIONS
// ============================================================================

namespace uniuno {

// 1. Branch Prediction (LIKELY / UNLIKELY)
// Tells the compiler which branch of an 'if' statement is most probable.
// This allows the compiler to order instructions optimally to avoid CPU pipeline flushes.
#if defined(__GNUC__) || defined(__clang__)
  #define LIKELY(x)   __builtin_expect(!!(x), 1)
  #define UNLIKELY(x) __builtin_expect(!!(x), 0)
#else
  #define LIKELY(x)   (x)
  #define UNLIKELY(x) (x)
#endif

// 2. IRAM Attribute (HOT_PATH)
// NOTE: Disabled for header-only inline functions to prevent ESP32 linker error:
// "dangerous relocation: l32r: literal placed after use"
// IRAM_ATTR should only be used on out-of-line functions in .cpp files.
#ifndef HOT_PATH
  #define HOT_PATH 
#endif

// 3. Force Inline
// Forces the compiler to inline a function even if its internal heuristics say otherwise.
// Eliminates function call overhead (stack push/pop).
#ifndef FORCE_INLINE
  #if defined(__GNUC__) || defined(__clang__)
    #define FORCE_INLINE __attribute__((always_inline)) inline
  #else
    #define FORCE_INLINE inline
  #endif
#endif

// 4. Loop Unrolling
// Hints the compiler to unroll the loop N times to reduce branching overhead.
#if defined(__GNUC__) && !defined(__clang__)
  #define UNROLL_LOOP(n) _Pragma("GCC unroll " #n)
#elif defined(__clang__)
  #define UNROLL_LOOP(n) _Pragma("unroll " #n)
#else
  #define UNROLL_LOOP(n)
#endif

// 5. Memory Barriers
#if defined(__xtensa__) || defined(ESP32)
  #define MEMORY_BARRIER() __asm__ volatile ("memw" ::: "memory")
  #define CPU_NOP()        __asm__ volatile ("nop")
#else
  #define MEMORY_BARRIER() __asm__ volatile ("" ::: "memory")
  #define CPU_NOP()        __asm__ volatile ("nop")
#endif

} // namespace uniuno
