#pragma once

#include "FastFunctionDecl.h"

namespace uniuno {

// ---------------------------------------------------------------------------
// Destructor
// ---------------------------------------------------------------------------

template<typename R, typename... Args, size_t Capacity>
FastFunction<R(Args...), Capacity>::~FastFunction() {
  clear();
}

// ---------------------------------------------------------------------------
// clear
// ---------------------------------------------------------------------------

template<typename R, typename... Args, size_t Capacity>
void FastFunction<R(Args...), Capacity>::clear() {
  if (UNLIKELY(invoker_ == nullptr)) return;

  if (vtable_) {
    vtable_->destroy(storage_.data());
    vtable_ = nullptr;
  }
  invoker_ = nullptr;
  storage_.clear();
}

} // namespace uniuno
