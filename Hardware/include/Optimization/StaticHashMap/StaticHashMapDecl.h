/**
 * @file StaticHashMapDecl.h
 * @brief RAM-oriented hash map (replaces std::map)
 * @author uniuno
 * 
 * PURPOSE: Zero-Flash hash map with linear probing
 * BENEFIT: No Red-Black Tree code in Flash, fast iteration, fast creation
 * 
 * ARCHITECTURE:
 *   - Open addressing with linear probing (sparse array)
 *   - Contiguous element storage using StaticArray (dense array)
 *   - Extremely fast iteration
 *   - No dynamic allocation
 */

#pragma once

#include <cstdint>
#include <cstddef>
#include <cstring>
#include <functional>
#include "Optimization/StaticArray.h"
#include "Optimization/HashMapBase.h"

namespace uniuno {

template<typename Key, typename Value, size_t MaxSize, typename Hash = std::hash<Key>, typename KeyEqual = std::equal_to<Key>>
class StaticHashMap : protected HashMapBase {
    static_assert((MaxSize & (MaxSize - 1)) == 0 && MaxSize > 0, "StaticHashMap: MaxSize must be a power of 2 for fast modulo arithmetic.");
    static_assert(MaxSize < 0xFFFF, "StaticHashMap: MaxSize must be less than 65535");

public:
    using size_type = uint16_t;
    
    struct Entry {
        Key key;
        Value value;
    };
    
    StaticHashMap();
    
    inline size_type size() const;
    inline size_type capacity() const;
    inline bool empty() const;
    inline bool full() const;
    
    inline bool insert(const Key& key, const Value& value);
    inline bool insert(const Key& key, Value&& value);
    inline Value* find(const Key& key);
    inline const Value* find(const Key& key) const;
    inline bool contains(const Key& key) const;
    inline bool erase(const Key& key);
    inline void clear();
    inline Value& operator[](const Key& key);
    
    using Iterator = typename StaticArray<Entry, MaxSize>::iterator;
    using ConstIterator = typename StaticArray<Entry, MaxSize>::const_iterator;
    
    inline Iterator begin();
    inline ConstIterator begin() const;
    inline Iterator end();
    inline ConstIterator end() const;

private:
    static uint16_t hash_wrapper(const void* key, uint16_t max_size) {
        return Hash{}(*static_cast<const Key*>(key)) & (max_size - 1);
    }
    
    static bool equal_wrapper(const void* key1, const void* key2) {
        return KeyEqual{}(*static_cast<const Key*>(key1), *static_cast<const Key*>(key2));
    }
    
    StaticArray<Entry, MaxSize> entries_;
    size_type buckets_storage_[MaxSize];
};

} // namespace uniuno
