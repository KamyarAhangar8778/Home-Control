#pragma once

#include "StaticArrayDecl.h"

namespace uniuno {

template<typename T, size_t MaxSize>
StaticArray<T, MaxSize>::StaticArray() : ArrayBase(storage_, MaxSize, true) {}

template<typename T, size_t MaxSize>
StaticArray<T, MaxSize>::~StaticArray() { clear(); }

} // namespace uniuno
