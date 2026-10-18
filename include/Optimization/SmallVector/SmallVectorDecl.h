#pragma once

#include <cstddef>
#include <utility>
#include <memory>
#include <type_traits>
#include <cstring>
#include <initializer_list>
#include "Optimization/ArrayBase.h"
#include "Optimization/CompilerTraits.h"   // LIKELY, UNLIKELY, FORCE_INLINE, FORCE_INLINE, MEMORY_BARRIER, UNROLL_LOOP
#include "Optimization/TypeTraits.h"       // returns_void_v

namespace uniuno {

/**
 * 💡 SmallVector - بهینه‌سازی برای vectorهای کوچک
 *
 * ❌ مشکل:
 *   std::vector همیشه heap allocation می‌کنه، حتی برای 1-2 عنصر
 *
 * ✅ راه‌حل:
 *   اگه تعداد عناصر <= N باشه، در stack ذخیره کن
 *   فقط وقتی بیشتر شد، به heap برو
 *
 * 🚀 مزایا:
 *   + بدون allocation برای eventهای کوچک (90% موارد)
 *   + Cache-friendly (دیتا پیوسته)
 *   + سریع‌تر برای insert/remove
 *   + FORCE_INLINE روی تمام accessorها
 *   + UNROLL_LOOP روی حلقه‌های کوچک
 *   + MEMORY_BARRIER صحیح برای Xtensa
 *
 * 📊 مثال:
 *   SmallVector<Listener, 4> → تا 4 listener در stack
 */

template<typename T, std::size_t N = 4, typename Allocator = std::allocator<T>>
class SmallVector : protected ArrayBase {
public:
  using value_type = T;

  SmallVector();
  ~SmallVector();

  SmallVector(const SmallVector& other);
  SmallVector& operator=(const SmallVector& other);
  SmallVector(SmallVector&& other) noexcept;
  SmallVector& operator=(SmallVector&& other) noexcept;

  SmallVector(std::initializer_list<T> init);
  SmallVector& operator=(std::initializer_list<T> init);

  void reserve(std::size_t new_cap);

  void push_back(const T& value);
  void push_back(T&& value);
  template<typename... Args> void emplace_back(Args&&... args);
  void pop_back();
  void clear();

  void erase(std::size_t index);
  T* erase(T* pos);
  T* erase(T* first, T* last);

  void insert(T* pos, const T& value) = delete;
  void insert(T* pos, T&& value);

  FORCE_INLINE bool full()  const { return size_ == capacity_; }
  FORCE_INLINE bool empty() const { return size_ == 0; }
  FORCE_INLINE std::size_t size()     const { return size_; }
  FORCE_INLINE std::size_t capacity() const { return capacity_; }

  // Fast path: resize storage to exactly n elements (no initialization)
  FORCE_INLINE void force_set_size(std::size_t new_size) { this->size_ = new_size; }
  FORCE_INLINE bool is_heap() const { return is_heap_; }

  FORCE_INLINE T&       operator[](std::size_t idx)       { return static_cast<T*>(data_)[idx]; }
  FORCE_INLINE const T& operator[](std::size_t idx) const { return static_cast<const T*>(data_)[idx]; }

  FORCE_INLINE T*       data()       { return static_cast<T*>(data_); }
  FORCE_INLINE const T* data() const { return static_cast<const T*>(data_); }

  FORCE_INLINE T*       begin()       { return static_cast<T*>(data_); }
  FORCE_INLINE T*       end()         { return static_cast<T*>(data_) + size_; }
  FORCE_INLINE const T* begin() const { return static_cast<const T*>(data_); }
  FORCE_INLINE const T* end()   const { return static_cast<const T*>(data_) + size_; }

  FORCE_INLINE T&       front()       { return static_cast<T*>(data_)[0]; }
  FORCE_INLINE const T& front() const { return static_cast<const T*>(data_)[0]; }
  FORCE_INLINE T&       back()        { return static_cast<T*>(data_)[size_ - 1]; }
  FORCE_INLINE const T& back()  const { return static_cast<const T*>(data_)[size_ - 1]; }

private:
  // [C/Assembly Level] Ensure 32-bit alignment for Xtensa CPU to fetch memory in single cycle.
  alignas(T) alignas(uint32_t) char stack_storage_[N * sizeof(T)];
};

} // namespace uniuno
