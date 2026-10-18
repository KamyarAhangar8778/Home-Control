#pragma once

#include "StaticHashMapDecl.h"

namespace uniuno {

// Specialization for string keys (const char*)
template<typename Value, size_t MaxSize>
class StaticHashMap<const char*, Value, MaxSize, std::hash<const char*>, std::equal_to<const char*>> {
public:
    using size_type = uint16_t;
    
    struct Entry {
        uint32_t key_hash;
        Value value;
        bool occupied;
        
        Entry() : key_hash(0), value(), occupied(false) {}
    };
    
    StaticHashMap();
    
    inline size_type size() const;
    inline bool empty() const;
    
    inline bool insert(const char* key, const Value& value);
    inline Value* find(const char* key);
    inline bool contains(const char* key) const;
    inline bool erase(const char* key);
    inline void clear();
    inline Value& operator[](const char* key);

private:
    inline uint32_t hashString(const char* str) const;
    inline size_type findIndex(uint32_t hash) const;
    inline size_type findSlot(uint32_t hash);
    
    Entry entries_[MaxSize];
    size_type count_;
};

} // namespace uniuno
