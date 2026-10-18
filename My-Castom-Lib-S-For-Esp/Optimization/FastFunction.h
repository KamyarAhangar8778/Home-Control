#pragma once

#include <cstddef>
#include <utility>
#include <new>
#include <type_traits>

namespace uniuno {

enum class FastFuncOp {
  Destroy,
  Move
};

template<typename Signature>
class FastFunction;

template<typename R, typename... Args>
class FastFunction<R(Args...)> {
public:
  // Default Constructor
  FastFunction() : invoker_(nullptr), manager_(nullptr) {
    storage_[0] = 0;
  }
  
  // Constructor from nullptr
  FastFunction(std::nullptr_t) : invoker_(nullptr), manager_(nullptr) {
    storage_[0] = 0;
  }
  
  // Constructor from lambda/functor
  template<typename F, typename = typename std::enable_if<
    !std::is_same<typename std::decay<F>::type, FastFunction>::value &&
    !std::is_same<typename std::decay<F>::type, std::nullptr_t>::value
  >::type>
  FastFunction(F&& f) {
    using DecayF = typename std::decay<F>::type;
    
    static_assert(sizeof(DecayF) <= sizeof(storage_), 
                  "Capture too large! Reduce capture size");
    
    // Copy/move lambda to storage
    new (storage_) DecayF(std::forward<F>(f));
    
    // Set invoker
    invoker_ = [](void* storage, Args... args) -> R {
      DecayF* f = static_cast<DecayF*>(storage);
      return (*f)(std::forward<Args>(args)...);
    };

    // Set manager conditionally based on whether decay type is trivial or not
    if constexpr (std::is_trivially_destructible<DecayF>::value &&
                  std::is_trivially_move_constructible<DecayF>::value) {
      manager_ = nullptr; // Trivial types don't need a manager function
    } else {
      manager_ = [](FastFuncOp op, void* dest, void* src) {
        if (op == FastFuncOp::Destroy) {
          static_cast<DecayF*>(dest)->~DecayF();
        } else if (op == FastFuncOp::Move) {
          new (dest) DecayF(std::move(*static_cast<DecayF*>(src)));
        }
      };
    }
  }
  
  // Copy constructor
  FastFunction(const FastFunction& other) = delete;
  
  // Move constructor
  FastFunction(FastFunction&& other) noexcept 
    : invoker_(other.invoker_)
    , manager_(other.manager_) {
    if (other.invoker_) {
      if (manager_) {
        manager_(FastFuncOp::Move, storage_, other.storage_);
        if (other.manager_) {
          other.manager_(FastFuncOp::Destroy, other.storage_, nullptr);
        }
      } else {
        // Trivial copy
        for (size_t i = 0; i < sizeof(storage_); i++) {
          storage_[i] = other.storage_[i];
        }
      }
    }
    other.invoker_ = nullptr;
    other.manager_ = nullptr;
  }
  
  // Copy assignment
  FastFunction& operator=(const FastFunction& other) = delete;
  
  // Move assignment
  FastFunction& operator=(FastFunction&& other) noexcept {
    if (this != &other) {
      clear();
      invoker_ = other.invoker_;
      manager_ = other.manager_;
      if (other.invoker_) {
        if (manager_) {
          manager_(FastFuncOp::Move, storage_, other.storage_);
          if (other.manager_) {
            other.manager_(FastFuncOp::Destroy, other.storage_, nullptr);
          }
        } else {
          // Trivial copy
          for (size_t i = 0; i < sizeof(storage_); i++) {
            storage_[i] = other.storage_[i];
          }
        }
      }
      other.invoker_ = nullptr;
      other.manager_ = nullptr;
    }
    return *this;
  }
  
  // Destructor
  ~FastFunction() {
    clear();
  }
  
  void clear() {
    if (invoker_) {
      if (manager_) {
        manager_(FastFuncOp::Destroy, storage_, nullptr);
        manager_ = nullptr;
      }
      invoker_ = nullptr;
    }
  }
  
  // Call operator
  R operator()(Args... args) const {
    return invoker_(const_cast<void*>(static_cast<const void*>(storage_)), 
                    std::forward<Args>(args)...);
  }
  
  // Check if callable
  explicit operator bool() const {
    return invoker_ != nullptr;
  }

private:
  using Invoker = R(*)(void*, Args...);
  using Manager = void(*)(FastFuncOp, void*, void*);
  
  Invoker invoker_;
  Manager manager_;
  alignas(void*) char storage_[32];  // 32 bytes for capture (fits 4 pointers)
};

} // namespace uniuno
