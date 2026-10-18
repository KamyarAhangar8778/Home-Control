#pragma once

#include <Arduino.h>
#include <Events/EventDispatcher.h>

namespace uniuno {

class IMqttPayloadHandler {
public:
    virtual ~IMqttPayloadHandler() = default;
    virtual bool canHandle(uint8_t cmdType) const = 0;
    virtual void handle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) = 0;
};

class MqttCommandDispatcher {
public:
    MqttCommandDispatcher();
    ~MqttCommandDispatcher();

    void registerHandler(IMqttPayloadHandler* handler);
    void handlePayload(const uint8_t* payload, size_t len, EventDispatcher* dispatcher);

private:
    static const int MAX_HANDLERS = 4;
    IMqttPayloadHandler* handlers_[MAX_HANDLERS];
    int handlerCount_ = 0;
};

} // namespace uniuno
