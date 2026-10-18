#pragma once

#include <Ticker.h>
#include <AsyncMqttClient.h>
#include <WiFi.h>

namespace uniuno {

class AchaemenidMQTT; // Forward declaration

/**
 * @brief Handles MQTT reconnection logic and exponential backoff
 */
class MqttConnectionManager {
public:
    MqttConnectionManager(AchaemenidMQTT* mqttClient);
    
    void onConnect();
    void onDisconnect();
    void resetRetries();
    
private:
    static void reconnectWrapper(AchaemenidMQTT* instance);
    
    AchaemenidMQTT* _mqttClient;
    Ticker _reconnectTimer;
    uint8_t _reconnectRetries = 0;
};

} // namespace uniuno
