#include "StateParsers.h"
#include <AppEvents.h>
#include <Utilities/logging.h>
#include <Optimization/CompilerTraits.h>

namespace uniuno {

// Helper for little-endian reading without risking unaligned access
FORCE_INLINE static int32_t readInt32LE(const uint8_t* buf, size_t offset) {
    int32_t val = 0;
    val |= ((int32_t)buf[offset]);
    val |= ((int32_t)buf[offset + 1] << 8);
    val |= ((int32_t)buf[offset + 2] << 16);
    val |= ((int32_t)buf[offset + 3] << 24);
    return val;
}

bool StateParsers::canHandle(uint8_t cmdType) const {
    return cmdType == 0x01 || cmdType == 0x06 || cmdType == 0x08 || cmdType == 0x09;
}

void StateParsers::handle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (len == 0) return;
    switch (payload[0]) {
        case 0x01: parseTogglePin(payload, len, dispatcher); break;
        case 0x06: parseAutomationToggle(payload, len, dispatcher); break;
        case 0x08: parseBatchToggle(payload, len, dispatcher); break;
        case 0x09: parseSyncState(payload, len, dispatcher); break;
    }
}

HOT_PATH IRAM_ATTR void StateParsers::parseTogglePin(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (LIKELY(len >= 7)) {
        int pinNum = payload[1];
        bool value = (payload[2] == 0x01);
        int timer = readInt32LE(payload, 3);

        PinStateChangeRequestEvent evt{pinNum, value, timer};
        dispatcher->dispatch(evt);
        INFOF("[MQTT Handler] Binary Toggle: pin=%d state=%s timer=%d", pinNum, value ? "ON" : "OFF", timer);
    }
}

HOT_PATH IRAM_ATTR void StateParsers::parseAutomationToggle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (LIKELY(len >= 3)) {
        int pinNum = payload[1];
        bool value = (payload[2] == 0x01);

        PinStateChangeRequestEvent evt{pinNum, value, 0};
        dispatcher->dispatch(evt);
        INFOF("[MQTT Handler] Automation Triggered! Binary Toggle: pin=%d state=%s", pinNum, value ? "ON" : "OFF");
    }
}

HOT_PATH IRAM_ATTR void StateParsers::parseBatchToggle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (LIKELY(len >= 2)) {
        uint8_t count = payload[1];
        size_t offset = 2;
        for (int i = 0; i < count && offset + 6 <= len; i++) {
            int pinNum = payload[offset];
            bool value = (payload[offset + 1] == 0x01);
            int timer = readInt32LE(payload, offset + 2);
            
            PinStateChangeRequestEvent evt{pinNum, value, timer};
            dispatcher->dispatch(evt);
            INFOF("[MQTT Handler] Batch Toggle: pin=%d state=%s timer=%d", pinNum, value ? "ON" : "OFF", timer);
            
            offset += 6;
        }
    }
}

HOT_PATH IRAM_ATTR void StateParsers::parseSyncState(const uint8_t* /*payload*/, size_t /*len*/, EventDispatcher* dispatcher) {
    StateSyncRequestEvent evt{};
    dispatcher->dispatch(evt);
    INFO("[MQTT Handler] Received State Sync Request (0x09)");
}

} // namespace uniuno
