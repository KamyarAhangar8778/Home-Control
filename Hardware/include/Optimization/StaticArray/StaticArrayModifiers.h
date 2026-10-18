#pragma once

#include "StaticArrayDecl.h"
#include <type_traits>
#include <utility>

namespace uniuno {

template<typename T, size_t MaxSize>
FORCE_INLINE bool StaticArray<T, MaxSize>::push_back(const T& value) {
    if (UNLIKELY(full())) return false;
    new (&data()[size_]) T(value);
    size_++;
    return true;
}

template<typename T, size_t MaxSize>
FORCE_INLINE bool StaticArray<T, MaxSize>::push_back(T&& value) {
    if (UNLIKELY(full())) return false;
    new (&data()[size_]) T(std::move(value));
    size_++;
    return true;
}

template<typename T, size_t MaxSize>
template<typename... Args>
FORCE_INLINE bool StaticArray<T, MaxSize>::emplace_back(Args&&... args) {
    if (UNLIKELY(full())) return false;
    new (&data()[size_]) T(std::forward<Args>(args)...);
    size_++;
    return true;
}

template<typename T, size_t MaxSize>
FORCE_INLINE void StaticArray<T, MaxSize>::pop_back() {
    if (LIKELY(size_ > 0)) {
        size_--;
        if (!std::is_trivially_destructible<T>::value) {
            data()[size_].~T();
        }
    }
}

template<typename T, size_t MaxSize>
FORCE_INLINE void StaticArray<T, MaxSize>::clear() {
    if (!std::is_trivially_destructible<T>::value) {
        for (size_type i = 0; i < size_; i++) {
            data()[i].~T();
        }
    }
    size_ = 0;
}

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::iterator StaticArray<T, MaxSize>::insert(iterator pos, const T& value) {
    if (UNLIKELY(full())) return end();
    if (UNLIKELY(pos < begin() || pos > end())) return end();
    
    size_type idx = pos - begin();
    
    if (std::is_trivially_copyable<T>::value) {
        this->insert_pod(idx, &value, sizeof(T));
    } else {
        if (idx == size_) {
            // Insert at end — same as push_back
            new (&data()[size_]) T(value);
        } else {
            // Move last element to uninitialized space at end
            new (&data()[size_]) T(std::move(data()[size_ - 1]));
            // Shift elements right from idx to size_-2
            for (size_type i = size_ - 1; i > idx; i--) {
                data()[i] = std::move(data()[i - 1]);
            }
            // Place new element at idx
            data()[idx] = value;
        }
        size_++;
    }
    
    return begin() + idx;
}

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::iterator StaticArray<T, MaxSize>::insert(iterator pos, T&& value) {
    if (UNLIKELY(full())) return end();
    if (UNLIKELY(pos < begin() || pos > end())) return end();
    
    size_type idx = pos - begin();
    
    if (std::is_trivially_copyable<T>::value) {
        this->insert_pod(idx, &value, sizeof(T));
    } else {
        if (idx == size_) {
            new (&data()[size_]) T(std::move(value));
        } else {
            new (&data()[size_]) T(std::move(data()[size_ - 1]));
            for (size_type i = size_ - 1; i > idx; i--) {
                data()[i] = std::move(data()[i - 1]);
            }
            data()[idx] = std::move(value);
        }
        size_++;
    }
    
    return begin() + idx;
}

} // namespace uniuno
