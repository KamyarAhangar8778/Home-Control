#pragma once

#include <cstddef>
#include <cstring>
#include "Optimization/CompilerTraits.h"

namespace uniuno {

/**
 * @brief RAM-oriented fixed-size string (replaces std::string)
 * 
 * BENEFIT: No dynamic memory allocation. Perfect for small temporary strings like stack traces.
 */
template <size_t Capacity>
class StaticString {
public:
    FORCE_INLINE StaticString() : size_(0) {
        buffer_[0] = '\0';
    }

    FORCE_INLINE StaticString(const char* str) : size_(0) {
        if (LIKELY(str != nullptr)) {
            size_ = std::strlen(str);
            if (UNLIKELY(size_ > Capacity - 1)) size_ = Capacity - 1;
            std::memcpy(buffer_, str, size_);
        }
        buffer_[size_] = '\0';
    }

    FORCE_INLINE StaticString& operator+=(const char* str) {
        if (LIKELY(str != nullptr) && LIKELY(size_ < Capacity - 1)) {
            size_t len = std::strlen(str);
            size_t to_copy = (len < Capacity - 1 - size_) ? len : Capacity - 1 - size_;
            std::memcpy(buffer_ + size_, str, to_copy);
            size_ += to_copy;
            buffer_[size_] = '\0';
        }
        return *this;
    }

    FORCE_INLINE StaticString& operator+=(const StaticString& other) {
        if (LIKELY(other.size_ > 0) && LIKELY(size_ < Capacity - 1)) {
            size_t to_copy = (other.size_ < Capacity - 1 - size_) ? other.size_ : Capacity - 1 - size_;
            std::memcpy(buffer_ + size_, other.buffer_, to_copy);
            size_ += to_copy;
            buffer_[size_] = '\0';
        }
        return *this;
    }

    FORCE_INLINE StaticString& operator+=(char c) {
        if (LIKELY(size_ < Capacity - 1)) {
            buffer_[size_++] = c;
            buffer_[size_] = '\0';
        }
        return *this;
    }

    FORCE_INLINE bool operator==(const char* str) const {
        if (UNLIKELY(!str)) return size_ == 0;
        return std::strcmp(buffer_, str) == 0;
    }

    FORCE_INLINE bool operator!=(const char* str) const {
        return !(*this == str);
    }

    template <size_t OtherCap>
    FORCE_INLINE bool operator==(const StaticString<OtherCap>& other) const {
        if (size_ != other.size()) return false;
        return std::memcmp(buffer_, other.c_str(), size_) == 0;
    }

    template <size_t OtherCap>
    FORCE_INLINE bool operator!=(const StaticString<OtherCap>& other) const {
        return !(*this == other);
    }

    FORCE_INLINE char& operator[](size_t index) {
        return buffer_[index];
    }

    FORCE_INLINE const char& operator[](size_t index) const {
        return buffer_[index];
    }

    FORCE_INLINE void clear() {
        size_ = 0;
        buffer_[0] = '\0';
    }

    FORCE_INLINE bool empty() const { return size_ == 0; }
    FORCE_INLINE size_t size() const { return size_; }
    FORCE_INLINE size_t capacity() const { return Capacity - 1; }
    FORCE_INLINE const char* c_str() const { return buffer_; }

private:
    char buffer_[Capacity];
    size_t size_;
};

} // namespace uniuno
