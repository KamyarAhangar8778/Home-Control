#pragma once

#include <cstdint>
#include <Optimization/FastFunction.h>
#include <Optimization/CompilerTraits.h>

namespace uniuno {

/**
 * @brief Represents a single event listener subscription.
 * Strongly encapsulated to protect dispatcher integrity.
 */
class ListenerEntry {
public:
  ListenerEntry()
      : event_hash_(0), listener_id_(0), callback_(), is_once_(0), marked_for_removal_(0), reserved_(0) {}

  ListenerEntry(uint32_t hash, uint32_t id, FastFunction<void(void*)> cb, bool once)
      : event_hash_(hash), listener_id_(id), callback_(std::move(cb)), is_once_(once ? 1 : 0), marked_for_removal_(0), reserved_(0) {}

  FORCE_INLINE uint32_t get_hash() const { return event_hash_; }
  FORCE_INLINE uint32_t get_id() const { return listener_id_; }
  FORCE_INLINE bool is_once() const { return is_once_; }
  FORCE_INLINE bool is_marked_for_removal() const { return marked_for_removal_; }

  FORCE_INLINE void mark_for_removal() { marked_for_removal_ = 1; }

  FORCE_INLINE void invoke(void* event_data) {
    if (callback_) {
      callback_(event_data);
    }
  }

private:
  uint32_t event_hash_;
  uint32_t listener_id_;
  FastFunction<void(void*)> callback_; // Defaults to 64 bytes inside FastFunction
  uint8_t is_once_ : 1;
  uint8_t marked_for_removal_ : 1;
  uint8_t reserved_ : 6;
};

} // namespace uniuno
