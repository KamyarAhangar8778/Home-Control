#pragma once

#include <Optimization/StaticString.h>
#include <Arduino.h>

namespace uniuno {

/**
 * @brief MQTT Configuration container using stack/bss-friendly StaticString.
 * Prevents heap fragmentation on the ESP32 by avoiding dynamic Strings.
 */
struct MqttConfig {
    uniuno::StaticString<64> server;
    uint16_t port = 1883;
    uint8_t qos = 0;
    uniuno::StaticString<32> user;
    uniuno::StaticString<32> password;
    
    uniuno::StaticString<64> clientId;
    uniuno::StaticString<64> baseTopic;
    uniuno::StaticString<64> commandTopic;
    uniuno::StaticString<64> willTopic;

    bool isValid() const {
        return !server.empty() && !baseTopic.empty();
    }
};

} // namespace uniuno
