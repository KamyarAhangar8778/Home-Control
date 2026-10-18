#pragma once

#include "EventDispatcherInterface.h"

namespace uniuno {

template <size_t MaxEvents = 32, size_t MaxListeners = 8>
class EventDispatcherBase : public EventDispatcherCoreBase<MaxEvents, MaxListeners> {
public:
  using EventDispatcherCoreBase<MaxEvents, MaxListeners>::dispatch;
  using EventDispatcherCoreBase<MaxEvents, MaxListeners>::removeListener;
  using EventDispatcherCoreBase<MaxEvents, MaxListeners>::removeListenerById;
  using EventDispatcherCoreBase<MaxEvents, MaxListeners>::count;

  template <typename EventType>
  uint32_t on(void (*callback)(EventType*)) {
    if (UNLIKELY(!callback)) return 0;
    auto func = FastFunction<void(void*)>([callback](void* event) {
        callback(static_cast<EventType*>(event));
    });
    return this->addListener(hash_event_name(EventType::Name), std::move(func), false);
  }

  template <typename EventType, typename Lambda>
  uint32_t on(Lambda&& lambda) {
    auto func = FastFunction<void(void*)>([lambda = std::forward<Lambda>(lambda)](void* event) mutable {
        lambda(static_cast<EventType*>(event));
    });
    return this->addListener(hash_event_name(EventType::Name), std::move(func), false);
  }

  template <typename EventType, typename Lambda>
  uint32_t on(Lambda* lambda) {
    if (UNLIKELY(!lambda)) return 0;
    auto func = FastFunction<void(void*)>([lambda](void* event) {
        (*lambda)(static_cast<EventType*>(event));
    });
    return this->addListener(hash_event_name(EventType::Name), std::move(func), false);
  }

  template <typename EventType, typename Lambda>
  uint32_t once(Lambda&& lambda) {
    auto func = FastFunction<void(void*)>([lambda = std::forward<Lambda>(lambda)](void* event) mutable {
        lambda(static_cast<EventType*>(event));
    });
    return this->addListener(hash_event_name(EventType::Name), std::move(func), true);
  }

  template <typename EventType, typename Lambda>
  uint32_t once(Lambda* lambda) {
    if (UNLIKELY(!lambda)) return 0;
    auto func = FastFunction<void(void*)>([lambda](void* event) {
        (*lambda)(static_cast<EventType*>(event));
    });
    return this->addListener(hash_event_name(EventType::Name), std::move(func), true);
  }

  template <typename EventType>
  void dispatch(EventType& event) {
    ErrorHandler::safe([&]() {
      this->dispatchEvent(&event, hash_event_name(EventType::Name));
    }, "EventDispatcher::dispatch<T>");
  }

  template <typename EventType>
  size_t removeListener() {
    return this->BaseEventDispatcher<MaxEvents, MaxListeners>::removeListener(hash_event_name(EventType::Name));
  }

  template <typename EventType>
  bool removeListenerById(uint32_t listener_id) {
    return this->BaseEventDispatcher<MaxEvents, MaxListeners>::removeListenerById(hash_event_name(EventType::Name), listener_id);
  }

  template <typename EventType>
  size_t count() const {
    return this->BaseEventDispatcher<MaxEvents, MaxListeners>::count(hash_event_name(EventType::Name));
  }
};

using EventDispatcher = EventDispatcherBase<32, 8>;

} // namespace uniuno
