#pragma once

#include <atomic>
#include <utility>

namespace uniuno {

/**
 * @brief Custom lightweight smart pointer designed to completely replace
 * std::shared_ptr and avoid the massive Flash/RAM bloat of libstdc++.
 */
template <typename T>
class AtomicSharedPtr {
private:
    struct State {
        T value;
        std::atomic<int> m_ref_count;
        template<typename... Args>
        State(Args&&... args) : value(std::forward<Args>(args)...), m_ref_count(1) {}
    };
    State* state;
public:
    AtomicSharedPtr() : state(nullptr) {}
    AtomicSharedPtr(T initial) : state(new State(std::move(initial))) {}
    
    template<typename... Args>
    static AtomicSharedPtr make(Args&&... args) {
        AtomicSharedPtr ptr;
        ptr.state = new State(std::forward<Args>(args)...);
        return ptr;
    }
    
    AtomicSharedPtr(const AtomicSharedPtr& other) : state(other.state) {
        if (state) {
            state->m_ref_count.fetch_add(1, std::memory_order_relaxed);
        }
    }
    
    AtomicSharedPtr& operator=(const AtomicSharedPtr& other) {
        if (this != &other) {
            reset();
            state = other.state;
            if (state) {
                state->m_ref_count.fetch_add(1, std::memory_order_relaxed);
            }
        }
        return *this;
    }
    
    AtomicSharedPtr(AtomicSharedPtr&& other) noexcept : state(other.state) {
        other.state = nullptr;
    }
    
    AtomicSharedPtr& operator=(AtomicSharedPtr&& other) noexcept {
        if (this != &other) {
            reset();
            state = other.state;
            other.state = nullptr;
        }
        return *this;
    }
    
    ~AtomicSharedPtr() {
        reset();
    }
    
    void reset() {
        if (state) {
            if (state->m_ref_count.fetch_sub(1, std::memory_order_acq_rel) == 1) {
                delete state;
            }
            state = nullptr;
        }
    }
    
    explicit operator bool() const { return state != nullptr; }
    T& operator*() { return state->value; }
    T* operator->() { return &state->value; }
};

} // namespace uniuno
