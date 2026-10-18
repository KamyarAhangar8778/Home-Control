#include "Optimization/HashMapBase.h"
#include <esp_attr.h>

namespace uniuno {

uint16_t IRAM_ATTR HashMapBase::findIndex_base(const void* key) const {
    uint16_t idx = hash_func_(key, max_size_);
    uint16_t start = idx;
    
    do {
        if (UNLIKELY(buckets_[idx] == EMPTY_BUCKET)) return EMPTY_BUCKET;
        
        const void* bucket_key = static_cast<const char*>(entries_data_) + (buckets_[idx] * entry_size_) + key_offset_;
        if (LIKELY(equal_func_(bucket_key, key))) return idx;
        
        idx = (idx + 1) & (max_size_ - 1);
    } while (idx != start);
    
    return EMPTY_BUCKET;
}

uint16_t IRAM_ATTR HashMapBase::findSlot_base(const void* key) const {
    uint16_t idx = hash_func_(key, max_size_);
    uint16_t start = idx;
    uint16_t first_empty = EMPTY_BUCKET;
    
    do {
        if (UNLIKELY(buckets_[idx] == EMPTY_BUCKET)) {
            return (first_empty != EMPTY_BUCKET) ? first_empty : idx;
        }
        
        const void* bucket_key = static_cast<const char*>(entries_data_) + (buckets_[idx] * entry_size_) + key_offset_;
        if (LIKELY(equal_func_(bucket_key, key))) {
            return idx;
        }
        idx = (idx + 1) & (max_size_ - 1);
    } while (idx != start);
    
    return EMPTY_BUCKET;
}

uint16_t IRAM_ATTR HashMapBase::remove_bucket_and_rehash(uint16_t idx) {
    uint16_t erased_dense_idx = buckets_[idx];
    buckets_[idx] = EMPTY_BUCKET;
    
    uint16_t hole = idx;
    uint16_t next = (hole + 1) & (max_size_ - 1);
    while (buckets_[next] != EMPTY_BUCKET) {
        uint16_t dense_idx = buckets_[next];
        const void* bucket_key = static_cast<const char*>(entries_data_) + (dense_idx * entry_size_) + key_offset_;
        uint16_t ideal = hash_func_(bucket_key, max_size_);
        
        if ((hole < next && (ideal <= hole || ideal > next)) ||
            (hole > next && (ideal <= hole && ideal > next))) {
            
            buckets_[hole] = dense_idx;
            buckets_[next] = EMPTY_BUCKET;
            hole = next;
        }
        next = (next + 1) & (max_size_ - 1);
    }
    
    return erased_dense_idx;
}

void IRAM_ATTR HashMapBase::update_last_element_bucket(uint16_t last_dense_idx, uint16_t new_dense_idx) {
    const void* last_key = static_cast<const char*>(entries_data_) + (new_dense_idx * entry_size_) + key_offset_;
    uint16_t last_key_idx = hash_func_(last_key, max_size_);
    uint16_t last_start = last_key_idx;
    
    do {
        if (buckets_[last_key_idx] == last_dense_idx) {
            buckets_[last_key_idx] = new_dense_idx;
            break;
        }
        last_key_idx = (last_key_idx + 1) & (max_size_ - 1);
    } while (last_key_idx != last_start);
}

void IRAM_ATTR HashMapBase::clear_base() {
    std::memset(buckets_, 0xFF, max_size_ * sizeof(uint16_t));
}

} // namespace uniuno
