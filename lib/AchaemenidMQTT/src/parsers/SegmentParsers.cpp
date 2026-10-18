#include "SegmentParsers.h"
#include <AppEvents.h>
#include <Utilities/logging.h>
#include <Optimization/CompilerTraits.h>
#include <Optimization/StaticString.h>

namespace uniuno {

// Helper to safely read a string directly into a StaticString. No Heap allocations!
template <size_t Capacity>
FORCE_INLINE static void readIntoStaticString(const uint8_t* payload, size_t& offset, size_t maxLen, StaticString<Capacity>& dest) {
    while (offset < maxLen && payload[offset] != '\0' && dest.size() < dest.capacity()) {
        char c[2] = {(char)payload[offset++], '\0'};
        dest += c;
    }
    // skip null terminator or remaining characters if truncated
    while (offset < maxLen && payload[offset] != '\0') offset++;
    if (offset < maxLen) offset++; // skip null
}

bool SegmentParsers::canHandle(uint8_t cmdType) const {
    return cmdType == 0x02 || cmdType == 0x03 || cmdType == 0x04;
}

void SegmentParsers::handle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (len == 0) return;
    switch (payload[0]) {
        case 0x02: parseAddSegment(payload, len, dispatcher); break;
        case 0x03: parseDeleteSegment(payload, len, dispatcher); break;
        case 0x04: parseDashboardPresence(payload, len, dispatcher); break;
    }
}

HOT_PATH IRAM_ATTR void SegmentParsers::parseAddSegment(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (LIKELY(len >= 6)) {
        int pinNum = payload[1];
        size_t offset = 3;
        
        StaticString<32> idStr;
        StaticString<32> typeStr;
        
        readIntoStaticString(payload, offset, len, idStr);
        readIntoStaticString(payload, offset, len, typeStr);

        SegmentAddRequestEvent evt{idStr.c_str(), typeStr.c_str(), pinNum};
        dispatcher->dispatch(evt);
        INFOF("[MQTT Handler] Binary Add: id=%s pin=%d", idStr.c_str(), pinNum);
    }
}

HOT_PATH IRAM_ATTR void SegmentParsers::parseDeleteSegment(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (LIKELY(len >= 2)) {
        size_t offset = 1;
        
        StaticString<32> idStr;
        readIntoStaticString(payload, offset, len, idStr);

        SegmentRemoveRequestEvent evt{idStr.c_str()};
        dispatcher->dispatch(evt);
        INFOF("[MQTT Handler] Binary Delete: id=%s", idStr.c_str());
    }
}

HOT_PATH IRAM_ATTR void SegmentParsers::parseDashboardPresence(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (LIKELY(len >= 2)) {
        bool isOnline = (payload[1] == 0x01);
        DashboardPresenceEvent evt{isOnline};
        dispatcher->dispatch(evt);
        INFOF("[MQTT Handler] Binary Presence: %s", isOnline ? "online" : "offline");
    }
}

} // namespace uniuno
