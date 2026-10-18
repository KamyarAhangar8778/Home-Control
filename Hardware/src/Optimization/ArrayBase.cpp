#include "Optimization/ArrayBase.h"
#include <esp_attr.h>
#ifdef ESP32
#include <esp_heap_caps.h>
#endif

namespace uniuno {

void* ArrayBase::mallocForGrow(std::size_t new_cap, std::size_t elem_size) {
    if (fixed_capacity_) return nullptr;
#ifdef ESP32
    return heap_caps_malloc(new_cap * elem_size, MALLOC_CAP_8BIT | MALLOC_CAP_INTERNAL);
#else
    return std::malloc(new_cap * elem_size);
#endif
}

void ArrayBase::freeHeap(void* old_data) {
    if (old_data) {
#ifdef ESP32
        heap_caps_free(old_data);
#else
        std::free(old_data);
#endif
    }
}

void IRAM_ATTR ArrayBase::reserve_pod(std::size_t new_cap, std::size_t elem_size) {
    if (fixed_capacity_ || UNLIKELY(new_cap <= capacity_)) return;
    
    if (is_heap_) {
#ifdef ESP32
        void* new_data = heap_caps_realloc(data_, new_cap * elem_size, MALLOC_CAP_8BIT | MALLOC_CAP_INTERNAL);
#else
        void* new_data = std::realloc(data_, new_cap * elem_size);
#endif
        if (!new_data) return; // Out of memory
        data_ = new_data;
        capacity_ = new_cap;
    } else {
#ifdef ESP32
        void* new_data = heap_caps_malloc(new_cap * elem_size, MALLOC_CAP_8BIT | MALLOC_CAP_INTERNAL);
#else
        void* new_data = std::malloc(new_cap * elem_size);
#endif
        if (!new_data) return; // Out of memory
        
        if (size_ > 0) {
            std::memcpy(new_data, data_, size_ * elem_size);
        }
        
        data_ = new_data;
        capacity_ = new_cap;
        is_heap_ = true;
    }
}

void IRAM_ATTR ArrayBase::erase_pod(std::size_t index, std::size_t elem_size) {
    if (UNLIKELY(index >= size_)) return;
    
    if (index < size_ - 1) {
        char* dst = static_cast<char*>(data_) + (index * elem_size);
        const char* src = static_cast<char*>(data_) + ((index + 1) * elem_size);
        std::memmove(dst, src, (size_ - index - 1) * elem_size);
    }
    size_--;
}

void IRAM_ATTR ArrayBase::erase_pod_range(std::size_t start_idx, std::size_t end_idx, std::size_t elem_size) {
    std::size_t count = end_idx - start_idx;
    if (end_idx < size_) {
        char* dst = static_cast<char*>(data_) + (start_idx * elem_size);
        const char* src = static_cast<char*>(data_) + (end_idx * elem_size);
        std::memmove(dst, src, (size_ - end_idx) * elem_size);
    }
    size_ -= count;
}

bool IRAM_ATTR ArrayBase::insert_pod(std::size_t index, const void* value, std::size_t elem_size) {
    if (UNLIKELY(size_ >= capacity_)) {
        if (fixed_capacity_) return false;
        reserve_pod(capacity_ * 2, elem_size);
        if (size_ >= capacity_) return false; // malloc failed
    }
    
    char* dst = static_cast<char*>(data_) + ((index + 1) * elem_size);
    const char* src = static_cast<char*>(data_) + (index * elem_size);
    std::memmove(dst, src, (size_ - index) * elem_size);
    
    std::memcpy(static_cast<char*>(data_) + (index * elem_size), value, elem_size);
    size_++;
    return true;
}

} // namespace uniuno
