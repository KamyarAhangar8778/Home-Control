#pragma once

#include "FastFunctionBase.h"
#include "../SmallVector.h"

#ifndef FASTFUNC_IRAM
#if defined(ESP32) || defined(ESP8266)
#define FASTFUNC_IRAM __attribute__((section(".iram1.text")))
#else
#define FASTFUNC_IRAM
#endif
#endif

namespace uniuno {

template<typename R, typename... Args, size_t Capacity>
class FastFunction<R(Args...), Capacity> {
public:
  FastFunction();
  FastFunction(std::nullptr_t);
  
  template<typename F, typename = typename std::enable_if<
    !std::is_same<typename std::decay<F>::type, FastFunction<R(Args...), Capacity>>::value &&
    !std::is_same<typename std::decay<F>::type, std::nullptr_t>::value
  >::type>
  FastFunction(F&& f);
  
  FastFunction(const FastFunction& other);
  FastFunction(FastFunction&& other) noexcept;
  
  FastFunction& operator=(const FastFunction& other);
  FastFunction& operator=(FastFunction&& other) noexcept;
  
  ~FastFunction();
  
  void clear();
  R operator()(Args... args) const;
  explicit operator bool() const;

private:
  using Invoker = R(*)(void*, Args...);
  
  template<typename DecayF>
  static R FASTFUNC_IRAM invoke_impl(void* storage, Args... args);

  Invoker invoker_;
  const FastFunctionVTable* vtable_;
  SmallVector<std::max_align_t, (Capacity + sizeof(std::max_align_t) - 1) / sizeof(std::max_align_t)> storage_;
};

} // namespace uniuno
