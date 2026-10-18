#pragma once

#include "FastFunctionDecl.h"

namespace uniuno {

template<typename R, typename... Args, size_t Capacity>
FORCE_INLINE R FastFunction<R(Args...), Capacity>::operator()(Args... args) const {
  return invoker_(const_cast<void*>(static_cast<const void*>(storage_.data())),
                  std::forward<Args>(args)...);
}

template<typename R, typename... Args, size_t Capacity>
FORCE_INLINE FastFunction<R(Args...), Capacity>::operator bool() const {
  return LIKELY(invoker_ != nullptr);
}

} // namespace uniuno
