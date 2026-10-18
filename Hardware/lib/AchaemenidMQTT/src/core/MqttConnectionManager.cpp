#include "MqttConnectionManager.h"
#include "AchaemenidMQTT.h"
#include <Arduino.h>

namespace uniuno {

MqttConnectionManager::MqttConnectionManager(AchaemenidMQTT* mqttClient) 
    : _mqttClient(mqttClient) {
}

void MqttConnectionManager::onConnect() {
    _reconnectRetries = 0;
}

void MqttConnectionManager::onDisconnect() {
    if (WiFi.status() == WL_CONNECTED) {
        _reconnectRetries++;
        if (_reconnectRetries > 3) {
            Serial.println("[MQTT] Failed to reconnect 3 times. Restarting ESP...");
            ESP.restart();
        }
        
        // Exponential backoff: 1s, 2s, 4s
        float delaySeconds = (float)(1u << (_reconnectRetries - 1));
        Serial.printf("[MQTT] Reconnecting in %.0fs (attempt %d/3)...\n", delaySeconds, _reconnectRetries);
        
        _reconnectTimer.once(delaySeconds, MqttConnectionManager::reconnectWrapper, _mqttClient);
    }
}

void MqttConnectionManager::resetRetries() {
    _reconnectRetries = 0;
}

void MqttConnectionManager::reconnectWrapper(AchaemenidMQTT* instance) {
    if (instance) {
        instance->connect();
    }
}

} // namespace uniuno
