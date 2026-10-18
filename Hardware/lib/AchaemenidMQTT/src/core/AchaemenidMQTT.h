#pragma once

#include <Arduino.h>
#include <AsyncMqttClient.h>
#include <Optimization/FastFunction.h>
#include "MqttConfig.h"
#include "MqttConnectionManager.h"

namespace uniuno {

class AchaemenidMQTT {
public:
    using MessageCallback = uniuno::FastFunction<void(const uint8_t* payload, size_t length)>;

    AchaemenidMQTT();
    ~AchaemenidMQTT();

    void begin(const String& server, uint16_t port, const String& baseTopic, uint8_t qos, const String& user, const String& password);
    void connect();
    
    // Kept for backward compatibility but empty (Zero-Latency mode)
    inline void processQueue() {} 

    String getBaseTopic() const { return String(_config.baseTopic.c_str()); }

    bool publish(const String& topic, const uint8_t* payload, size_t length, bool retained = false);
    bool publish(const String& topic, const String& payload, bool retained = false);
    
    void setCallback(MessageCallback callback);
    void subscribe(const String& topic);

private:
    AsyncMqttClient _mqttClient;
    MqttConfig _config;
    MqttConnectionManager _connManager;
    MessageCallback _messageCallback;

    void _onMqttConnect(bool sessionPresent);
    void _onMqttDisconnect(AsyncMqttClientDisconnectReason reason);
    void _onMqttMessage(char* topic, char* payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total);
};

} // namespace uniuno
