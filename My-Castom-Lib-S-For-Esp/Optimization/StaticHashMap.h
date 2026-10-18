/**
 * @file StaticHashMap.h
 * @brief RAM-oriented hash map (replaces std::map)
 * @author uniuno
 * 
 * PURPOSE: Zero-Flash hash map with linear probing
 * BENEFIT: No Red-Black Tree code in Flash
 * 
 * ARCHITECTURE:
 *   - Open addressing with linear probing
 *   - Fixed-size array in RAM
 *   - Hash-based lookup
 *   - No dynamic allocation
 */

#pragma once

#include <cstdint>
#include <cstddef>

namespace uniuno {

/**
 * @class StaticHashMap
 * @brief Fixed-size hash map with O(1) average lookup
 * 
 * MEMORY:
 *   - Entry array: MaxSize * (sizeof(Key) + sizeof(Value) + 1)
 *   - Count: 2 bytes
 *   - Total: Predictable
 * 
 * FLASH: Minimal (no tree management)
 * 
 * ALGORITHM: Linear probing for collision resolution
 * SPEED: O(1) average, O(n) worst case
 * 
 * USAGE:
 * @code
 *   StaticHashMap<uint32_t, int, 16> map;
 *   map.insert(123, 456);
 *   int* val = map.find(123);
 * @endcode
 */
template<typename Key, typename Value, size_t MaxSize>
class StaticHashMap {
public:
    using size_type = uint16_t;
    
    struct Entry {
        Key key;
        Value value;
        bool occupied;
        
        Entry() : key(), value(), occupied(false) {}
    };
    
    StaticHashMap() : count_(0) {
        clear();
    }
    
    // Capacity
    inline size_type size() const { return count_; }
    inline size_type capacity() const { return MaxSize; }
    inline bool empty() const { return count_ == 0; }
    inline bool full() const { return count_ >= MaxSize; }
    
    // Insert/Update
    inline bool insert(const Key& key, const Value& value) {
        size_type idx = findSlot(key);
        
        if (idx == MaxSize) return false;  // Full
        
        if (!entries_[idx].occupied) {
            count_++;
        }
        
        entries_[idx].key = key;
        entries_[idx].value = value;
        entries_[idx].occupied = true;
        
        return true;
    }
    
    // Find (returns pointer or nullptr)
    inline Value* find(const Key& key) {
        size_type idx = findIndex(key);
        return (idx != MaxSize) ? &entries_[idx].value : nullptr;
    }
    
    inline const Value* find(const Key& key) const {
        size_type idx = findIndex(key);
        return (idx != MaxSize) ? &entries_[idx].value : nullptr;
    }
    
    // Contains
    inline bool contains(const Key& key) const {
        return findIndex(key) != MaxSize;
    }
    
    // Erase
    inline bool erase(const Key& key) {
        size_type idx = findIndex(key);
        
        if (idx == MaxSize) return false;
        
        entries_[idx].occupied = false;
        count_--;
        
        // Rehash following entries to maintain probe chain
        rehashFrom(idx);
        
        return true;
    }
    
    // Clear
    inline void clear() {
        for (size_type i = 0; i < MaxSize; i++) {
            entries_[i].occupied = false;
        }
        count_ = 0;
    }
    
    // Operator[]
    inline Value& operator[](const Key& key) {
        size_type idx = findSlot(key);
        
        if (!entries_[idx].occupied) {
            entries_[idx].key = key;
            entries_[idx].occupied = true;
            count_++;
        }
        
        return entries_[idx].value;
    }
    
    // Iterator support (simple)
    class Iterator {
    public:
        Iterator(Entry* ptr, Entry* end) : ptr_(ptr), end_(end) {
            skipEmpty();
        }
        
        inline bool operator!=(const Iterator& other) const { return ptr_ != other.ptr_; }
        inline Iterator& operator++() { 
            ptr_++; 
            skipEmpty();
            return *this; 
        }
        
        inline Entry& operator*() { return *ptr_; }
        inline Entry* operator->() { return ptr_; }
        
    private:
        void skipEmpty() {
            while (ptr_ < end_ && !ptr_->occupied) {
                ptr_++;
            }
        }
        
        Entry* ptr_;
        Entry* end_;
    };
    
    inline Iterator begin() { return Iterator(entries_, entries_ + MaxSize); }
    inline Iterator end() { return Iterator(entries_ + MaxSize, entries_ + MaxSize); }

private:
    // Hash function (DJB2 for integers)
    inline size_type hash(const Key& key) const {
        uint32_t h = 5381;
        const uint8_t* bytes = reinterpret_cast<const uint8_t*>(&key);
        
        for (size_t i = 0; i < sizeof(Key); i++) {
            h = ((h << 5) + h) + bytes[i];
        }
        
        return h % MaxSize;
    }
    
    // Find index of key (returns MaxSize if not found)
    inline size_type findIndex(const Key& key) const {
        size_type idx = hash(key);
        size_type start = idx;
        
        do {
            if (!entries_[idx].occupied) {
                return MaxSize;  // Not found
            }
            
            if (entries_[idx].key == key) {
                return idx;  // Found
            }
            
            idx = (idx + 1) % MaxSize;  // Linear probing
        } while (idx != start);
        
        return MaxSize;  // Not found (full table)
    }
    
    // Find slot for insertion (existing or empty)
    inline size_type findSlot(const Key& key) {
        size_type idx = hash(key);
        size_type start = idx;
        size_type first_empty = MaxSize;
        
        do {
            if (!entries_[idx].occupied) {
                return (first_empty != MaxSize) ? first_empty : idx;
            }
            
            if (entries_[idx].key == key) {
                return idx;  // Update existing
            }
            
            idx = (idx + 1) % MaxSize;
        } while (idx != start);
        
        return MaxSize;  // Full
    }
    
    // Rehash entries after deletion
    inline void rehashFrom(size_type start) {
        size_type idx = (start + 1) % MaxSize;
        
        while (entries_[idx].occupied) {
            size_type ideal = hash(entries_[idx].key);
            
            // Check if this entry should be moved back
            if ((start < idx && (ideal <= start || ideal > idx)) ||
                (start > idx && (ideal <= start && ideal > idx))) {
                
                entries_[start] = entries_[idx];
                entries_[idx].occupied = false;
                start = idx;
            }
            
            idx = (idx + 1) % MaxSize;
        }
    }
    
    Entry entries_[MaxSize];
    size_type count_;
};

// Specialization for string keys (const char*)
template<typename Value, size_t MaxSize>
class StaticHashMap<const char*, Value, MaxSize> {
public:
    using size_type = uint16_t;
    
    struct Entry {
        uint32_t key_hash;
        Value value;
        bool occupied;
        
        Entry() : key_hash(0), value(), occupied(false) {}
    };
    
    StaticHashMap() : count_(0) {
        clear();
    }
    
    inline size_type size() const { return count_; }
    inline bool empty() const { return count_ == 0; }
    
    inline bool insert(const char* key, const Value& value) {
        uint32_t h = hashString(key);
        size_type idx = findSlot(h);
        
        if (idx == MaxSize) return false;
        
        if (!entries_[idx].occupied) count_++;
        
        entries_[idx].key_hash = h;
        entries_[idx].value = value;
        entries_[idx].occupied = true;
        
        return true;
    }
    
    inline Value* find(const char* key) {
        uint32_t h = hashString(key);
        size_type idx = findIndex(h);
        return (idx != MaxSize) ? &entries_[idx].value : nullptr;
    }
    
    inline bool erase(const char* key) {
        uint32_t h = hashString(key);
        size_type idx = findIndex(h);
        
        if (idx == MaxSize) return false;
        
        entries_[idx].occupied = false;
        count_--;
        return true;
    }
    
    inline void clear() {
        for (size_type i = 0; i < MaxSize; i++) {
            entries_[i].occupied = false;
        }
        count_ = 0;
    }
    
    inline Value& operator[](const char* key) {
        uint32_t h = hashString(key);
        size_type idx = findSlot(h);
        
        if (!entries_[idx].occupied) {
            entries_[idx].key_hash = h;
            entries_[idx].occupied = true;
            count_++;
        }
        
        return entries_[idx].value;
    }

private:
    inline uint32_t hashString(const char* str) const {
        if (!str) return 0;
        
        uint32_t h = 5381;
        while (*str) {
            h = ((h << 5) + h) + (*str++);
        }
        return h;
    }
    
    inline size_type findIndex(uint32_t hash) const {
        size_type idx = hash % MaxSize;
        size_type start = idx;
        
        do {
            if (!entries_[idx].occupied) return MaxSize;
            if (entries_[idx].key_hash == hash) return idx;
            idx = (idx + 1) % MaxSize;
        } while (idx != start);
        
        return MaxSize;
    }
    
    inline size_type findSlot(uint32_t hash) {
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
    
    Entry entries_[MaxSize];
    size_type count_;
};

} // namespace uniuno
