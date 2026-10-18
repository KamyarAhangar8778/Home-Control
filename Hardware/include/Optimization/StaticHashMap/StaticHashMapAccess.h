#pragma once

#include "StaticHashMapDecl.h"

namespace uniuno {

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline typename StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::size_type 
StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::size() const { return entries_.size(); }

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline typename StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::size_type 
StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::capacity() const { return MaxSize; }

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline bool StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::empty() const { return entries_.empty(); }

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline bool StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::full() const { return entries_.full(); }

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline Value* StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::find(const Key& key) {
    size_type idx = findIndex_base(&key);
    return (idx != EMPTY_BUCKET) ? &entries_[buckets_storage_[idx]].value : nullptr;
}

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline const Value* StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::find(const Key& key) const {
    size_type idx = findIndex_base(&key);
    return (idx != EMPTY_BUCKET) ? &entries_[buckets_storage_[idx]].value : nullptr;
}

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline bool StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::contains(const Key& key) const {
    return findIndex_base(&key) != EMPTY_BUCKET;
}

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline Value& StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::operator[](const Key& key) {
    size_type idx = findSlot_base(&key);
    
    if (UNLIKELY(buckets_storage_[idx] == EMPTY_BUCKET)) {
        buckets_storage_[idx] = entries_.size();
        entries_.push_back({key, Value()});
    }
    
    return entries_[buckets_storage_[idx]].value;
}

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline typename StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::Iterator 
StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::begin() { 
    return entries_.begin(); 
}

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline typename StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::ConstIterator 
StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::begin() const { 
    return entries_.begin(); 
}

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline typename StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::Iterator 
StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::end() { 
    return entries_.end(); 
}

template<typename Key, typename Value, size_t MaxSize, typename Hash, typename KeyEqual>
inline typename StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::ConstIterator 
StaticHashMap<Key, Value, MaxSize, Hash, KeyEqual>::end() const { 
    return entries_.end(); 
}

} // namespace uniuno
