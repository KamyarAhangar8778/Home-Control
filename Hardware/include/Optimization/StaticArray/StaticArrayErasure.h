#pragma once

#include "StaticArrayDecl.h"
#include <type_traits>
#include <utility>
#include <algorithm>
#include <cstring>

namespace uniuno {

template<typename T, size_t MaxSize>
FORCE_INLINE void StaticArray<T, MaxSize>::erase(size_type idx) {
    if (std::is_trivially_copyable<T>::value) {
        this->erase_pod(idx, sizeof(T));
    } else {
        if (UNLIKELY(idx >= size_)) return;
        
        for (size_type i = idx; i < size_ - 1; i++) {
            data()[i] = std::move(data()[i + 1]);
        }
        
        data()[size_ - 1].~T();
        size_--;
    }
}

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::iterator StaticArray<T, MaxSize>::erase(iterator it) {
    if (UNLIKELY(it < begin() || it >= end())) return end();
    
    size_type idx = it - begin();
    erase(idx);
    return begin() + idx;
}

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::iterator StaticArray<T, MaxSize>::erase(iterator first, iterator last) {
    if (UNLIKELY(first >= last || first < begin() || last > end())) return first;
    
    size_type start_idx = first - begin();
    size_type end_idx = last - begin();
    size_type count = end_idx - start_idx;
    
    if (std::is_trivially_copyable<T>::value) {
        this->erase_pod_range(start_idx, end_idx, sizeof(T));
    } else {
        for (size_type i = start_idx; i < this->size_ - count; i++) {
            data()[i] = std::move(data()[i + count]);
        }
        for (size_type i = this->size_ - count; i < this->size_; i++) {
            data()[i].~T();
        }
        this->size_ -= count;
    }
    
    return begin() + start_idx;
}

template<typename T, size_t MaxSize>
FORCE_INLINE bool StaticArray<T, MaxSize>::remove(const T& value) {
    auto it = std::find(begin(), end(), value);
    if (it != end()) {
        erase(it);
        return true;
    }
    return false;
}

template<typename T, size_t MaxSize>
FORCE_INLINE typename StaticArray<T, MaxSize>::size_type StaticArray<T, MaxSize>::remove_all(const T& value) {
    size_type removed = 0;
    size_type write_idx = 0;
    
    for (size_type read_idx = 0; read_idx < size_; read_idx++) {
        if (data()[read_idx] == value) {
            removed++;
        } else {
            if (write_idx != read_idx) {
                data()[write_idx] = std::move(data()[read_idx]);
            }
            write_idx++;
        }
    }
    
    if (!std::is_trivially_destructible<T>::value) {
        for (size_type i = write_idx; i < size_; i++) {
            data()[i].~T();
        }
    }
    
    size_ = write_idx;
    return removed;
}

} // namespace uniuno
