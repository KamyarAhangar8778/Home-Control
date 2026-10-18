#include "MqttCommandDispatcher.h"
#include "StateParsers.h"
#include "SegmentParsers.h"
#include "RuleParsers.h"
#include <Utilities/logging.h>
#include <Optimization/CompilerTraits.h>

namespace uniuno {

MqttCommandDispatcher::MqttCommandDispatcher() {}

MqttCommandDispatcher::~MqttCommandDispatcher() {
    // In a real system, you might delete handlers if the dispatcher owns them,
    // but here we assume the application layer owns the lifecycle (Dependency Injection).
}

void MqttCommandDispatcher::registerHandler(IMqttPayloadHandler* handler) {
    if (handlerCount_ < MAX_HANDLERS && handler != nullptr) {
        handlers_[handlerCount_++] = handler;
    }
}

HOT_PATH IRAM_ATTR void MqttCommandDispatcher::handlePayload(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (UNLIKELY(dispatcher == nullptr || payload == nullptr || len == 0)) return;

    uint8_t cmdType = payload[0];

    // Fallback for legacy JSON
    if (UNLIKELY(cmdType == '{')) {
        WARNING("[MQTT Handler] Legacy JSON is no longer supported to save memory. Ignoring.");
        return;
    }

    bool handled = false;
    for (int i = 0; i < handlerCount_; ++i) {
        if (handlers_[i]->canHandle(cmdType)) {
            handlers_[i]->handle(payload, len, dispatcher);
            handled = true;
            break;
        }
    }

    if (!handled) {
        WARNINGF("[MQTT Handler] Unknown binary command type or no handler found: 0x%02X", cmdType);
    }
}

} // namespace uniuno
