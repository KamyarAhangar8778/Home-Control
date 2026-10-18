#pragma once

#include <cstddef>
#include <utility>
#include <new>

namespace uniuno {

/**
 * @brief RAM-oriented fixed-size queue (replaces std::queue)
 * 
 * BENEFIT: No dynamic memory allocation, preventing heap fragmentation.
 * ARCHITECTURE: Circular ring buffer.
 */
template <typename T, size_t Capacity>
class StaticQueue {
public:
    StaticQueue() : head_(0), tail_(0), size_(0) {}
    
    ~StaticQueue() {
        clear();
    }

    void push(const T& value) {
        if (size_ < Capacity) {
            new (&buffer_[tail_]) T(value);
            tail_ = (tail_ + 1) % Capacity;
            size_++;
        }
    }

    void push(T&& value) {
        if (size_ < Capacity) {
            new (&buffer_[tail_]) T(std::move(value));
            tail_ = (tail_ + 1) % Capacity;
            size_++;
        }
    }

    template<typename... Args>
    void emplace(Args&&... args) {
        if (size_ < Capacity) {
            new (&buffer_[tail_]) T(std::forward<Args>(args)...);
            tail_ = (tail_ + 1) % Capacity;
            size_++;
        }
    }

    void pop() {
        if (size_ > 0) {
            reinterpret_cast<T*>(&buffer_[head_])->~T();
            head_ = (head_ + 1) % Capacity;
            size_--;
        }
    }

    T& front() {
        return *reinterpret_cast<T*>(&buffer_[head_]);
    }

    const T& front() const {
        return *reinterpret_cast<const T*>(&buffer_[head_]);
    }

    T& back() {
        size_t last = (tail_ == 0) ? Capacity - 1 : tail_ - 1;
        return *reinterpret_cast<T*>(&buffer_[last]);
    }

    const T& back() const {
        size_t last = (tail_ == 0) ? Capacity - 1 : tail_ - 1;
        return *reinterpret_cast<const T*>(&buffer_[last]);
    }

    bool empty() const {
        return size_ == 0;
    }

    bool full() const {
        return size_ == Capacity;
    }

    size_t size() const {
        return size_;
    }

    size_t capacity() const {
        return Capacity;
    }

    void clear() {
        while (!empty()) {
            pop();
        }
    }

private:
    alignas(T) unsigned char buffer_[Capacity * sizeof(T)];
    size_t head_;
    size_t tail_;
    size_t size_;
};

} // namespace uniuno
