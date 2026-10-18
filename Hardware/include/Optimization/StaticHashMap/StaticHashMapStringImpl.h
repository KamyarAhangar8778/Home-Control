#pragma once

#include "StaticHashMapStringDecl.h"

namespace uniuno {

template<typename Value, size_t MaxSize>
StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::StaticHashMap() : count_(0) {
    clear();
}

template<typename Value, size_t MaxSize>
inline typename StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::size_type 
StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::size() const { return count_; }

template<typename Value, size_t MaxSize>
inline bool StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::empty() const { return count_ == 0; }

template<typename Value, size_t MaxSize>
inline bool StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::insert(const char* key, const Value& value) {
    uint32_t h = hashString(key);
    size_type idx = findSlot(h);
    
    if (idx == MaxSize) return false;
    
    if (!entries_[idx].occupied) count_++;
    
    entries_[idx].key_hash = h;
    entries_[idx].value = value;
    entries_[idx].occupied = true;
    
    return true;
}

template<typename Value, size_t MaxSize>
inline Value* StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::find(const char* key) {
    uint32_t h = hashString(key);
    size_type idx = findIndex(h);
    return (idx != MaxSize) ? &entries_[idx].value : nullptr;
}

template<typename Value, size_t MaxSize>
inline bool StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::contains(const char* key) const {
    uint32_t h = hashString(key);
    return findIndex(h) != MaxSize;
}

template<typename Value, size_t MaxSize>
inline bool StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::erase(const char* key) {
    uint32_t h = hashString(key);
    size_type idx = findIndex(h);
    
    if (idx == MaxSize) return false;
    
    entries_[idx].occupied = false;
    count_--;
    return true;
}

template<typename Value, size_t MaxSize>
inline void StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::clear() {
    for (size_type i = 0; i < MaxSize; i++) {
        entries_[i].occupied = false;
    }
    count_ = 0;
}

template<typename Value, size_t MaxSize>
inline Value& StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::operator[](const char* key) {
    uint32_t h = hashString(key);
    size_type idx = findSlot(h);
    
    if (!entries_[idx].occupied) {
        entries_[idx].key_hash = h;
        entries_[idx].occupied = true;
        count_++;
    }
    
    return entries_[idx].value;
}

template<typename Value, size_t MaxSize>
inline uint32_t StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::hashString(const char* str) const {
    if (!str) return 0;
    
    uint32_t h = 5381;
    while (*str) {
        h = ((h << 5) + h) + (*str++);
    }
    return h;
}

template<typename Value, size_t MaxSize>
inline typename StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::size_type 
StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::findIndex(uint32_t hash) const {
    size_type idx = hash % MaxSize;
    size_type start = idx;
    
    do {
        if (!entries_[idx].occupied) return MaxSize;
        if (entries_[idx].key_hash == hash) return idx;
        idx = (idx + 1) % MaxSize;
    } while (idx != start);
    
    return MaxSize;
}

template<typename Value, size_t MaxSize>
inline typename StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::size_type 
StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>>::findSlot(uint32_t hash) {
    size_type idx = hash % MaxSize;
    size_type start = idx;
    
    do {
        if (!entries_[idx].occupied || entries_[idx].key_hash == hash) {
            return idx;
        }
        idx = (idx + 1) % MaxSize;
    } while (idx != start);
    
    return MaxSize;
}

} // namespace uniuno
