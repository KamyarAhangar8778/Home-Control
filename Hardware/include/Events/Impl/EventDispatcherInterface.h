#pragma once

#include "../IEventDispatcher.h"
#include "../Base/BaseEventDispatcher.h"
#include "../EventHash.h"
#include <utility>

namespace uniuno {

template <size_t MaxEvents = 32, size_t MaxListeners = 8>
class EventDispatcherCoreBase : public IEventDispatcher, protected BaseEventDispatcher<MaxEvents, MaxListeners> {
public:
  EventDispatcherCoreBase() : BaseEventDispatcher<MaxEvents, MaxListeners>() {}

  void dispatch(void* event, const char* event_name) override {
    if (UNLIKELY(!event_name)) return;
    ErrorHandler::safe([&]() {
      this->dispatchEvent(event, hash_event_name(event_name));
    }, "EventDispatcher::dispatch");
  }

  uint32_t registerListener(const char* event_name,
                            void (*callback)(void*),
                            bool is_once = false) override {
    if (UNLIKELY(!event_name || !callback)) return 0;
    auto func = FastFunction<void(void*)>([callback](void* event) {
        callback(event);
    });
    return this->addListener(hash_event_name(event_name), std::move(func), is_once);
  }

  bool removeListenerById(const char* event_name, uint32_t listener_id) override {
    if (UNLIKELY(!event_name)) return false;
    return this->BaseEventDispatcher<MaxEvents, MaxListeners>::removeListenerById(hash_event_name(event_name), listener_id);
  }

  size_t removeListener(const char* event_name) override {
    if (UNLIKELY(!event_name)) return 0;
    return this->BaseEventDispatcher<MaxEvents, MaxListeners>::removeListener(hash_event_name(event_name));
  }

  void clear() { this->BaseEventDispatcher<MaxEvents, MaxListeners>::clear(); }
  size_t count() const { return this->BaseEventDispatcher<MaxEvents, MaxListeners>::count(); }

  size_t count(const char* event_name) const {
    if (UNLIKELY(!event_name)) return 0;
    return this->BaseEventDispatcher<MaxEvents, MaxListeners>::count(hash_event_name(event_name));
  }
};

using EventDispatcherCore = EventDispatcherCoreBase<32, 8>;

} // namespace uniuno
