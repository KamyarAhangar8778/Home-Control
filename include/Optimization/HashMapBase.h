#pragma once

#include <cstdint>
#include <cstddef>
#include <cstring>

#include "Optimization/CompilerTraits.h"

namespace uniuno {

class HashMapBase {
protected:
    void* entries_data_;
    uint16_t* buckets_;
    uint16_t max_size_;
    uint16_t entry_size_;
    uint16_t key_offset_;

    using HashFunc = uint16_t (*)(const void* key, uint16_t max_size);
    using EqualFunc = bool (*)(const void* key1, const void* key2);

    HashFunc hash_func_;
    EqualFunc equal_func_;

    static constexpr uint16_t EMPTY_BUCKET = 0xFFFF;

    HashMapBase(void* entries_data, uint16_t* buckets, 
                uint16_t max_size, uint16_t entry_size, uint16_t key_offset, 
                HashFunc hash_func, EqualFunc equal_func)
        : entries_data_(entries_data), buckets_(buckets),
          max_size_(max_size), entry_size_(entry_size), key_offset_(key_offset),
          hash_func_(hash_func), equal_func_(equal_func) {}

    uint16_t findIndex_base(const void* key) const;
    uint16_t findSlot_base(const void* key) const;
    uint16_t remove_bucket_and_rehash(uint16_t bucket_idx);
    void update_last_element_bucket(uint16_t last_dense_idx, uint16_t new_dense_idx);
    void clear_base();
};

} // namespace uniuno
