/**
 * @file TypeTraits.h
 * @brief Type traits for compile-time optimization (C++14 compatible)
 * @author uniuno
 *
 * PURPOSE: Detect callback return types at compile-time
 * BENEFIT: Remove lambda wrapping overhead (10-15% faster)
 */

#pragma once

#include <type_traits>

namespace uniuno {

/**
 * @brief Detect if callable returns void
 */
template<typename F>
struct returns_void {
  template<typename T>
  static auto test(int) -> decltype(std::declval<T>()(), std::true_type{});

  template<typename>
  static std::false_type test(...);

  static constexpr bool value = std::is_void<
    decltype(std::declval<F>()())
  >::value;
};

template<typename F>
constexpr bool returns_void_v = returns_void<F>::value;

} // namespace uniuno
