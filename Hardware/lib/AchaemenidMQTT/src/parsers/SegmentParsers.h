#pragma once

#include <Arduino.h>
#include <Events/EventDispatcher.h>

#include "MqttCommandDispatcher.h"

namespace uniuno {

class SegmentParsers : public IMqttPayloadHandler {
public:
    bool canHandle(uint8_t cmdType) const override;
    void handle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) override;

private:
    void parseAddSegment(const uint8_t* payload, size_t len, EventDispatcher* dispatcher);
    void parseDeleteSegment(const uint8_t* payload, size_t len, EventDispatcher* dispatcher);
    void parseDashboardPresence(const uint8_t* payload, size_t len, EventDispatcher* dispatcher);
};

} // namespace uniuno
