/**
 * @file StaticArrayDecl.h
 * @brief RAM-oriented fixed-size array (replaces std::vector)
 * @author uniuno
 * 
 * PURPOSE: Predictable RAM usage, zero Flash overhead
 * BENEFIT: No dynamic allocation, faster access
 * 
 * ARCHITECTURE:
 *   - Fixed-size array in RAM/Stack
 *   - No heap allocation
 *   - Bounds checking in debug mode
 *   - Iterator support
 */

#pragma once

#include <cstdint>
#include <cstddef>
#include <utility>
#include <new>
#include "Optimization/ArrayBase.h"
#include "Optimization/CompilerTraits.h"

namespace uniuno {

/**
 * @class StaticArray
 * @brief Fixed-size array with vector-like interface
 * 
 * MEMORY:
 *   - Array: MaxSize * sizeof(T) bytes
 *   - Size counter: 2 bytes
 *   - Total: Predictable and static
 * 
 * FLASH: Minimal (inline functions only)
 */
template<typename T, size_t MaxSize>
class StaticArray : protected ArrayBase {
public:
    using value_type = T;
    using size_type = uint16_t;
    using iterator = T*;
    using const_iterator = const T*;
    
    StaticArray();
    ~StaticArray();
    
    FORCE_INLINE size_type size() const;
    FORCE_INLINE size_type capacity() const;
    FORCE_INLINE bool empty() const;
    FORCE_INLINE bool full() const;
    
    FORCE_INLINE void force_set_size(size_type new_size) { this->size_ = new_size; }
    
    FORCE_INLINE T* data();
    FORCE_INLINE const T* data() const;
    
    FORCE_INLINE T& operator[](size_type idx);
    FORCE_INLINE const T& operator[](size_type idx) const;
    FORCE_INLINE T& at(size_type idx);
    FORCE_INLINE const T& at(size_type idx) const;
    FORCE_INLINE T& front();
    FORCE_INLINE const T& front() const;
    FORCE_INLINE T& back();
    FORCE_INLINE const T& back() const;
    
    FORCE_INLINE bool push_back(const T& value);
    FORCE_INLINE bool push_back(T&& value);
    template<typename... Args> FORCE_INLINE bool emplace_back(Args&&... args);
    FORCE_INLINE void pop_back();
    FORCE_INLINE void clear();
    
    FORCE_INLINE iterator insert(iterator pos, const T& value);
    FORCE_INLINE iterator insert(iterator pos, T&& value);
    
    FORCE_INLINE void erase(size_type idx);
    FORCE_INLINE iterator erase(iterator it);
    FORCE_INLINE iterator erase(iterator first, iterator last);
    FORCE_INLINE bool remove(const T& value);
    FORCE_INLINE size_type remove_all(const T& value);
    
    FORCE_INLINE iterator begin();
    FORCE_INLINE const_iterator begin() const;
    FORCE_INLINE iterator end();
    FORCE_INLINE const_iterator end() const;
    
    FORCE_INLINE iterator find(const T& value);
    FORCE_INLINE const_iterator find(const T& value) const;

private:
    alignas(T) uint8_t storage_[MaxSize * sizeof(T)];
};

} // namespace uniuno
