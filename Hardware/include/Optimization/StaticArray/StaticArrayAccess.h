#pragma once

#include "StaticArrayDecl.h"
#include <algorithm>

namespace uniuno {



template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::size_type StaticArray<T, MaxSize>::size() const { return size_; }

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::size_type StaticArray<T, MaxSize>::capacity() const { return MaxSize; }

template<typename T, size_t MaxSize>
FORCE_INLINE bool StaticArray<T, MaxSize>::empty() const { return size_ == 0; }

template<typename T, size_t MaxSize>
FORCE_INLINE bool StaticArray<T, MaxSize>::full() const { return size_ == MaxSize; }

template<typename T, size_t MaxSize>
FORCE_INLINE T* StaticArray<T, MaxSize>::data() { return reinterpret_cast<T*>(storage_); }

template<typename T, size_t MaxSize>
FORCE_INLINE const T* StaticArray<T, MaxSize>::data() const { return reinterpret_cast<const T*>(storage_); }

template<typename T, size_t MaxSize>
FORCE_INLINE T& StaticArray<T, MaxSize>::operator[](size_type idx) { return data()[idx]; }

template<typename T, size_t MaxSize>
FORCE_INLINE const T& StaticArray<T, MaxSize>::operator[](size_type idx) const { return data()[idx]; }

template<typename T, size_t MaxSize>
FORCE_INLINE T& StaticArray<T, MaxSize>::at(size_type idx) { return (idx < size_) ? data()[idx] : data()[0]; }

template<typename T, size_t MaxSize>
FORCE_INLINE const T& StaticArray<T, MaxSize>::at(size_type idx) const { return (idx < size_) ? data()[idx] : data()[0]; }

template<typename T, size_t MaxSize>
FORCE_INLINE T& StaticArray<T, MaxSize>::front() { return data()[0]; }

template<typename T, size_t MaxSize>
FORCE_INLINE const T& StaticArray<T, MaxSize>::front() const { return data()[0]; }

template<typename T, size_t MaxSize>
FORCE_INLINE T& StaticArray<T, MaxSize>::back() { return data()[size_ - 1]; }

template<typename T, size_t MaxSize>
FORCE_INLINE const T& StaticArray<T, MaxSize>::back() const { return data()[size_ - 1]; }

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::iterator StaticArray<T, MaxSize>::begin() { return data(); }

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::const_iterator StaticArray<T, MaxSize>::begin() const { return data(); }

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::iterator StaticArray<T, MaxSize>::end() { return data() + size_; }

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::const_iterator StaticArray<T, MaxSize>::end() const { return data() + size_; }

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::iterator StaticArray<T, MaxSize>::find(const T& value) {
    return std::find(begin(), end(), value);
}

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::const_iterator StaticArray<T, MaxSize>::find(const T& value) const {
    return std::find(begin(), end(), value);
}

} // namespace uniuno
