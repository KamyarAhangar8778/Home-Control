#pragma once

#include <Arduino.h>
#include <Events/EventDispatcher.h>

#include "MqttCommandDispatcher.h"

namespace uniuno {

class RuleParsers : public IMqttPayloadHandler {
public:
    bool canHandle(uint8_t cmdType) const override;
    void handle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) override;

private:
    void parseUpdateRule(const uint8_t* payload, size_t len, EventDispatcher* dispatcher);
};

} // namespace uniuno
