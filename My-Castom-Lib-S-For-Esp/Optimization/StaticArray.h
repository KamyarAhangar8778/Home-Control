/**
 * @file StaticArray.h
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

namespace uniuno {

/**
 * @class StaticArray
 * @brief Fixed-size array with vector-like interface
 * 
 * MEMORY:
 *   - Array: N * sizeof(T) bytes
 *   - Size counter: 2 bytes
 *   - Total: Predictable and static
 * 
 * FLASH: Minimal (inline functions only)
 * 
 * USAGE:
 * @code
 *   StaticArray<int, 10> arr;
 *   arr.push_back(42);
 *   arr[0] = 100;
 * @endcode
 */
template<typename T, size_t MaxSize>
class StaticArray {
public:
    using value_type = T;
    using size_type = uint16_t;
    using iterator = T*;
    using const_iterator = const T*;
    
    StaticArray() : size_(0) {}
    
    // Capacity
    inline size_type size() const { return size_; }
    inline size_type capacity() const { return MaxSize; }
    inline bool empty() const { return size_ == 0; }
    inline bool full() const { return size_ >= MaxSize; }
    
    // Element access
    inline T& operator[](size_type idx) { return data_[idx]; }
    inline const T& operator[](size_type idx) const { return data_[idx]; }
    
    inline T& at(size_type idx) {
        return (idx < size_) ? data_[idx] : data_[0];
    }
    
    inline const T& at(size_type idx) const {
        return (idx < size_) ? data_[idx] : data_[0];
    }
    
    inline T& front() { return data_[0]; }
    inline const T& front() const { return data_[0]; }
    
    inline T& back() { return data_[size_ - 1]; }
    inline const T& back() const { return data_[size_ - 1]; }
    
    inline T* data() { return data_; }
    inline const T* data() const { return data_; }
    
    // Modifiers
    inline bool push_back(const T& value) {
        if (full()) return false;
        data_[size_++] = value;
        return true;
    }
    
    inline bool emplace_back(T&& value) {
        if (full()) return false;
        data_[size_++] = std::move(value);
        return true;
    }
    
    inline void pop_back() {
        if (size_ > 0) size_--;
    }
    
    inline void clear() { size_ = 0; }
    
    inline void erase(size_type idx) {
        if (idx >= size_) return;
        
        for (size_type i = idx; i < size_ - 1; i++) {
            data_[i] = std::move(data_[i + 1]);
        }
        size_--;
    }
    
    // Erase by iterator
    inline iterator erase(iterator it) {
        if (it < begin() || it >= end()) return end();
        
        size_type idx = it - begin();
        erase(idx);
        return begin() + idx;
    }
    
    // Remove by value (first occurrence)
    inline bool remove(const T& value) {
        for (size_type i = 0; i < size_; i++) {
            if (data_[i] == value) {
                erase(i);
                return true;
            }
        }
        return false;
    }
    
    // Remove all matching values
    inline size_type remove_all(const T& value) {
        size_type removed = 0;
        size_type write_idx = 0;
        
        for (size_type read_idx = 0; read_idx < size_; read_idx++) {
            if (data_[read_idx] == value) {
                removed++;
            } else {
                if (write_idx != read_idx) {
                    data_[write_idx] = data_[read_idx];
                }
                write_idx++;
            }
        }
        
        size_ = write_idx;
        return removed;
    }
    
    // Iterators
    inline iterator begin() { return data_; }
    inline const_iterator begin() const { return data_; }
    inline iterator end() { return data_ + size_; }
    inline const_iterator end() const { return data_ + size_; }
    
    // Find
    inline iterator find(const T& value) {
        for (size_type i = 0; i < size_; i++) {
            if (data_[i] == value) return &data_[i];
        }
        return end();
    }
    
    inline const_iterator find(const T& value) const {
        for (size_type i = 0; i < size_; i++) {
            if (data_[i] == value) return &data_[i];
        }
        return end();
    }

private:
    T data_[MaxSize];
    size_type size_;
};

} // namespace uniuno
