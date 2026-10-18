#pragma once

#include <Arduino.h>
#include <Events/EventDispatcher.h>

#include "MqttCommandDispatcher.h"

namespace uniuno {

class StateParsers : public IMqttPayloadHandler {
public:
    bool canHandle(uint8_t cmdType) const override;
    void handle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) override;

private:
    void parseTogglePin(const uint8_t* payload, size_t len, EventDispatcher* dispatcher);
    void parseAutomationToggle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher);
    void parseBatchToggle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher);
    void parseSyncState(const uint8_t* payload, size_t len, EventDispatcher* dispatcher);
};

} // namespace uniuno
