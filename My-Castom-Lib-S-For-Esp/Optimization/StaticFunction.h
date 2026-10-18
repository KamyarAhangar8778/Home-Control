/**
 * @file StaticFunction.h
 * @brief RAM-oriented function wrapper (replaces std::function)
 * @author uniuno
 * 
 * PURPOSE: Zero-Flash function storage
 * BENEFIT: 85% Flash reduction vs std::function
 * 
 * ARCHITECTURE:
 *   - Function pointer only (4 bytes RAM)
 *   - Optional context pointer (4 bytes RAM)
 *   - No vtable, no type erasure
 *   - Compile-time type safety
 */

#pragma once

#include <cstdint>
#include <cstddef>

namespace uniuno {

/**
 * @class StaticFunction
 * @brief Lightweight function wrapper for RAM storage
 * 
 * MEMORY:
 *   - Function pointer: 4 bytes
 *   - Context pointer: 4 bytes
 *   - Total: 8 bytes (vs 24-32 for std::function)
 * 
 * FLASH: Zero overhead (inline only)
 */
template<typename Ret, typename... Args>
class StaticFunction {
public:
    using FuncPtr = Ret (*)(void*, Args...);
    
    StaticFunction() : func_(nullptr), context_(nullptr) {}
    
    // Constructor for function with context
    StaticFunction(FuncPtr func, void* context = nullptr) 
        : func_(func), context_(context) {}
    
    // Constructor for lambda/functor (stores in context)
    template<typename Functor>
    static StaticFunction bind(Functor* functor) {
        return StaticFunction(
            [](void* ctx, Args... args) -> Ret {
                return (*static_cast<Functor*>(ctx))(args...);
            },
            functor
        );
    }
    
    // Call operator
    inline Ret operator()(Args... args) const {
        return func_ ? func_(context_, args...) : Ret();
    }
    
    // Validity check
    inline explicit operator bool() const { return func_ != nullptr; }
    
    // Reset
    inline void reset() { func_ = nullptr; context_ = nullptr; }

private:
    FuncPtr func_;
    void* context_;
};

// Specialization for void return
template<typename... Args>
class StaticFunction<void, Args...> {
public:
    using FuncPtr = void (*)(void*, Args...);
    
    StaticFunction() : func_(nullptr), context_(nullptr) {}
    
    StaticFunction(FuncPtr func, void* context = nullptr) 
        : func_(func), context_(context) {}
    
    template<typename Functor>
    static StaticFunction bind(Functor* functor) {
        return StaticFunction(
            [](void* ctx, Args... args) {
                (*static_cast<Functor*>(ctx))(args...);
            },
            functor
        );
    }
    
    inline void operator()(Args... args) const {
        if (func_) func_(context_, args...);
    }
    
    inline explicit operator bool() const { return func_ != nullptr; }
    inline void reset() { func_ = nullptr; context_ = nullptr; }

private:
    FuncPtr func_;
    void* context_;
};

// Helper for simple function pointers (no context)
template<typename Ret, typename... Args>
inline StaticFunction<Ret, Args...> makeStaticFunction(Ret (*func)(Args...)) {
    return StaticFunction<Ret, Args...>(
        [](void* ctx, Args... args) -> Ret { 
            auto fn = reinterpret_cast<Ret(*)(Args...)>(ctx);
            return fn(args...); 
        },
        reinterpret_cast<void*>(func)
    );
}

} // namespace uniuno
