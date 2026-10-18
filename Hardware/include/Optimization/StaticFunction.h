#pragma once

#include <cstdint>
#include <cstddef>
#include "Optimization/CompilerTraits.h"

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
    
    FORCE_INLINE StaticFunction() : func_(nullptr), context_(nullptr) {}
    
    // Constructor for function with context
    FORCE_INLINE StaticFunction(FuncPtr func, void* context = nullptr) 
        : func_(func), context_(context) {}
    
    // Constructor for lambda/functor (stores in context)
    template<typename Functor>
    static FORCE_INLINE StaticFunction bind(Functor* functor) {
        return StaticFunction(
            [](void* ctx, Args... args) -> Ret {
                return (*static_cast<Functor*>(ctx))(args...);
            },
            functor
        );
    }
    
    // Constructor for Member Functions (Class Methods)
    template<typename ClassType, Ret (ClassType::*Method)(Args...)>
    static FORCE_INLINE StaticFunction bindMember(ClassType* instance) {
        return StaticFunction(
            [](void* ctx, Args... args) -> Ret {
                return (static_cast<ClassType*>(ctx)->*Method)(args...);
            },
            instance
        );
    }

    // Call operator
    FORCE_INLINE Ret operator()(Args... args) const {
        return LIKELY(func_ != nullptr) ? func_(context_, args...) : Ret();
    }
    
    // Validity check
    FORCE_INLINE explicit operator bool() const { return func_ != nullptr; }
    
    // Reset
    FORCE_INLINE void reset() { func_ = nullptr; context_ = nullptr; }

private:
    FuncPtr func_;
    void* context_;
};

// Specialization for void return
template<typename... Args>
class StaticFunction<void, Args...> {
public:
    using FuncPtr = void (*)(void*, Args...);
    
    FORCE_INLINE StaticFunction() : func_(nullptr), context_(nullptr) {}
    
    FORCE_INLINE StaticFunction(FuncPtr func, void* context = nullptr) 
        : func_(func), context_(context) {}
    
    template<typename Functor>
    static FORCE_INLINE StaticFunction bind(Functor* functor) {
        return StaticFunction(
            [](void* ctx, Args... args) {
                (*static_cast<Functor*>(ctx))(args...);
            },
            functor
        );
    }
    
    template<typename ClassType, void (ClassType::*Method)(Args...)>
    static FORCE_INLINE StaticFunction bindMember(ClassType* instance) {
        return StaticFunction(
            [](void* ctx, Args... args) {
                (static_cast<ClassType*>(ctx)->*Method)(args...);
            },
            instance
        );
    }

    FORCE_INLINE void operator()(Args... args) const {
        if (LIKELY(func_ != nullptr)) func_(context_, args...);
    }
    
    FORCE_INLINE explicit operator bool() const { return func_ != nullptr; }
    FORCE_INLINE void reset() { func_ = nullptr; context_ = nullptr; }

private:
    FuncPtr func_;
    void* context_;
};

// Helper for simple function pointers (no context)
template<typename Ret, typename... Args>
FORCE_INLINE StaticFunction<Ret, Args...> makeStaticFunction(Ret (*func)(Args...)) {
    return StaticFunction<Ret, Args...>(
        [](void* ctx, Args... args) -> Ret { 
            auto fn = reinterpret_cast<Ret(*)(Args...)>(ctx);
            return fn(args...); 
        },
        reinterpret_cast<void*>(func)
    );
}

} // namespace uniuno
