#pragma once

#include <cstddef>
#include <utility>

namespace uniuno {

/**
 * 💡 SmallVector - بهینهسازی برای vectorهای کوچک
 * 
 * ❌ مشکل:
 *   std::vector همیشه heap allocation میکنه، حتی برای 1-2 عنصر
 * 
 * ✅ راهحل:
 *   اگه تعداد عناصر <= N باشه، در stack ذخیره کن
 *   فقط وقتی بیشتر شد، به heap برو
 * 
 * 🚀 مزایا:
 *   + بدون allocation برای eventهای کوچک (90% موارد)
 *   + Cache-friendly (دیتا پیوسته)
 *   + سریعتر برای insert/remove
 * 
 * 📊 مثال:
 *   SmallVector<Listener, 4> → تا 4 listener در stack
 */

template<typename T, std::size_t N = 4>
class SmallVector {
public:
  using value_type = T;
  
  SmallVector() : size_(0), capacity_(N), is_heap_(false) {
    data_ = reinterpret_cast<T*>(stack_storage_);
  }
  
  ~SmallVector() {
    clear();
    if (is_heap_) {
      ::operator delete(data_);
    }
  }
  
  // Copy constructor - DELETED (FastFunction is not copyable)
  SmallVector(const SmallVector& other) = delete;
  
  // Copy assignment - DELETED
  SmallVector& operator=(const SmallVector& other) = delete;
  
  // Move constructor
  SmallVector(SmallVector&& other) noexcept : size_(other.size_), capacity_(other.capacity_), is_heap_(other.is_heap_) {
    if (other.is_heap_) {
      data_ = other.data_;
      other.data_ = nullptr;
      other.size_ = 0;
      other.is_heap_ = false;
    } else {
      data_ = reinterpret_cast<T*>(stack_storage_);
      for (std::size_t i = 0; i < size_; i++) {
        new (&data_[i]) T(std::move(other.data_[i]));
      }
    }
  }
  
  void reserve(std::size_t new_cap) {
    if (new_cap <= capacity_) return;
    
    T* new_data = static_cast<T*>(::operator new(new_cap * sizeof(T)));
    
    for (std::size_t i = 0; i < size_; i++) {
      new (&new_data[i]) T(std::move(data_[i]));
      data_[i].~T();
    }
    
    if (is_heap_) {
      ::operator delete(data_);
    }
    
    data_ = new_data;
    capacity_ = new_cap;
    is_heap_ = true;
  }
  
  void push_back(const T& value) = delete;  // Deleted - use push_back(T&&) or emplace_back
  
  void push_back(T&& value) {
    if (size_ >= capacity_) {
      reserve(capacity_ * 2);
    }
    new (&data_[size_]) T(std::move(value));
    size_++;
  }
  
  template<typename... Args>
  void emplace_back(Args&&... args) {
    if (size_ >= capacity_) {
      reserve(capacity_ * 2);
    }
    new (&data_[size_]) T(std::forward<Args>(args)...);
    size_++;
  }
  
  void pop_back() {
    if (size_ > 0) {
      size_--;
      data_[size_].~T();
    }
  }
  
  // ✅ حذف عنصر در موقعیت مشخص
  void erase(std::size_t index) {
    if (index >= size_) return;
    
    data_[index].~T();
    
    // Shift elements
    for (std::size_t i = index; i < size_ - 1; i++) {
      new (&data_[i]) T(std::move(data_[i + 1]));
      data_[i + 1].~T();
    }
    
    size_--;
  }
  
  // ✅ حذف با iterator
  T* erase(T* pos) {
    if (pos < begin() || pos >= end()) return end();
    std::size_t index = pos - begin();
    erase(index);
    return begin() + index;
  }
  
  void clear() {
    for (std::size_t i = 0; i < size_; i++) {
      data_[i].~T();
    }
    size_ = 0;
  }
  
  bool empty() const { return size_ == 0; }
  std::size_t size() const { return size_; }
  std::size_t capacity() const { return capacity_; }
  
  T& operator[](std::size_t idx) { return data_[idx]; }
  const T& operator[](std::size_t idx) const { return data_[idx]; }
  
  T* data() { return data_; }
  const T* data() const { return data_; }
  
  T* begin() { return data_; }
  T* end() { return data_ + size_; }
  const T* begin() const { return data_; }
  const T* end() const { return data_ + size_; }
  
  T& front() { return data_[0]; }
  const T& front() const { return data_[0]; }
  
  T& back() { return data_[size_ - 1]; }
  const T& back() const { return data_[size_ - 1]; }
  
  void insert(T* pos, const T& value) = delete;  // Deleted
  
  void insert(T* pos, T&& value) {
    std::size_t index = pos - begin();
    if (size_ >= capacity_) {
      reserve(capacity_ * 2);
    }
    // Shift elements
    for (std::size_t i = size_; i > index; i--) {
      new (&data_[i]) T(std::move(data_[i - 1]));
      data_[i - 1].~T();
    }
    new (&data_[index]) T(std::move(value));
    size_++;
  }
  
  // ✅ Erase range [first, last)
  T* erase(T* first, T* last) {
    if (first >= last || first < begin() || last > end()) return end();
    
    std::size_t start_idx = first - begin();
    std::size_t end_idx = last - begin();
    std::size_t count = end_idx - start_idx;
    
    // Destroy elements in range
    for (std::size_t i = start_idx; i < end_idx; i++) {
      data_[i].~T();
    }
    
    // Shift remaining elements
    for (std::size_t i = end_idx; i < size_; i++) {
      new (&data_[i - count]) T(std::move(data_[i]));
      data_[i].~T();
    }
    
    size_ -= count;
    return begin() + start_idx;
  }

private:
  alignas(T) char stack_storage_[N * sizeof(T)];
  T* data_;
  std::size_t size_;
  std::size_t capacity_;
  bool is_heap_;
};

} // namespace uniuno
