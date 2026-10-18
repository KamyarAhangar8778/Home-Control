#pragma once

#include <cstddef>
#include <cstdlib>
#include <cstring>

#include "Optimization/CompilerTraits.h"

namespace uniuno {

/**
 * @brief Base class for contiguous arrays to perform Type Erasure and reduce Flash usage
 * By keeping non-templated logic here, we prevent LLVM/GCC from duplicating 
 * the reserve/erase memory operations for every type.
 */
class ArrayBase {
protected:
    void* data_;
    std::size_t size_;
    std::size_t capacity_;
    bool is_heap_;
    bool fixed_capacity_;

    ArrayBase(void* stack_ptr, std::size_t cap, bool fixed) 
        : data_(stack_ptr), size_(0), capacity_(cap), is_heap_(false), fixed_capacity_(fixed) {}
    
    ~ArrayBase() {
        if (is_heap_) {
            freeHeap(data_);
        }
    }

    // Heap management abstraction for non-trivial types
    void* mallocForGrow(std::size_t new_cap, std::size_t elem_size);
    void freeHeap(void* old_data);

    // POD (Trivially Copyable) optimizations implemented in .cpp to save Flash
    void reserve_pod(std::size_t new_cap, std::size_t elem_size);
    void erase_pod(std::size_t index, std::size_t elem_size);
    void erase_pod_range(std::size_t start_idx, std::size_t end_idx, std::size_t elem_size);
    bool insert_pod(std::size_t index, const void* value, std::size_t elem_size);
};

} // namespace uniuno
