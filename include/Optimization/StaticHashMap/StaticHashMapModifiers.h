#pragma once

#include "StaticHashMapDecl.h"

namespace uniuno {

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Winvalid-offsetof"
template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::StaticHashMap()
    : HashMapBase(entries_.data(), buckets_storage_, MaxSize, sizeof(Entry), offsetof(Entry, key), &hash_wrapper, &equal_wrapper) {
    clear();
}
#pragma GCC diagnostic pop

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline bool StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::insert(const Key& key, const Value& value) {
    size_type idx = findSlot_base(&key);
    
    if (UNLIKELY(idx == EMPTY_BUCKET)) return false;
    
    if (buckets_storage_[idx] == EMPTY_BUCKET) {
        if (UNLIKELY(entries_.full())) return false;
        buckets_storage_[idx] = entries_.size();
        entries_.push_back({key, value});
    } else {
        entries_[buckets_storage_[idx]].value = value;
    }
    
    return true;
}

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline bool StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::insert(const Key& key, Value&& value) {
    size_type idx = findSlot_base(&key);
    
    if (UNLIKELY(idx == EMPTY_BUCKET)) return false;
    
    if (buckets_storage_[idx] == EMPTY_BUCKET) {
        if (UNLIKELY(entries_.full())) return false;
        buckets_storage_[idx] = entries_.size();
        entries_.push_back({key, std::move(value)});
    } else {
        entries_[buckets_storage_[idx]].value = std::move(value);
    }
    
    return true;
}

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline bool StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::erase(const Key& key) {
    size_type idx = findIndex_base(&key);
    
    if (UNLIKELY(idx == EMPTY_BUCKET)) return false;
    
    size_type erased_dense_idx = remove_bucket_and_rehash(idx);
    
    size_type last_dense_idx = entries_.size() - 1;
    if (erased_dense_idx != last_dense_idx) {
        entries_[erased_dense_idx] = std::move(entries_[last_dense_idx]);
        update_last_element_bucket(last_dense_idx, erased_dense_idx);
    }
    
    entries_.pop_back();
    return true;
}

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline void StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::clear() {
    clear_base();
    entries_.clear();
}

} // namespace uniuno
