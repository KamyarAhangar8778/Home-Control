#include "AchaemenidMQTT.h"
#include <Utilities/logging.h>
#include <Optimization/CompilerTraits.h>
#include <WiFi.h>

namespace uniuno {

AchaemenidMQTT::AchaemenidMQTT() : _connManager(this) {
    String mac = WiFi.macAddress();
    mac.replace(":", "");
    _config.clientId = ("ESP32-" + mac).c_str();

    _mqttClient.onConnect([this](bool sessionPresent) {
        this->_onMqttConnect(sessionPresent);
    });

    _mqttClient.onDisconnect([this](AsyncMqttClientDisconnectReason reason) {
        this->_onMqttDisconnect(reason);
    });

    _mqttClient.onMessage([this](char* topic, char* payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total) {
        this->_onMqttMessage(topic, payload, properties, len, index, total);
    });
}

AchaemenidMQTT::~AchaemenidMQTT() {}

void AchaemenidMQTT::begin(const String& server, uint16_t port, const String& baseTopic, uint8_t qos, const String& user, const String& password) {
    _config.server = server.c_str();
    _config.port = port;
    _config.baseTopic = baseTopic.c_str();
    _config.qos = qos;
    _config.user = user.c_str();
    _config.password = password.c_str();
    _config.willTopic = (baseTopic + "/Status").c_str();
    
    _mqttClient.setServer(_config.server.c_str(), _config.port);
    _mqttClient.setClientId(_config.clientId.c_str());

    if (_config.user.size() > 0 && _config.password.size() > 0) {
        _mqttClient.setCredentials(_config.user.c_str(), _config.password.c_str());
    }

    _mqttClient.setWill(_config.willTopic.c_str(), _config.qos, true, "offline");
    _mqttClient.setKeepAlive(15);
}

void AchaemenidMQTT::connect() {
    if (WiFi.status() != WL_CONNECTED || _mqttClient.connected()) return;
    Serial.printf("[MQTT] Connecting to %s...\n", _config.server.c_str());
    _mqttClient.connect();
}

void AchaemenidMQTT::setCallback(MessageCallback callback) {
    _messageCallback = std::move(callback);
}

void AchaemenidMQTT::subscribe(const String& topic) {
    _config.commandTopic = topic.c_str();
    if (_mqttClient.connected()) {
        _mqttClient.subscribe(_config.commandTopic.c_str(), _config.qos);
        Serial.printf("[MQTT] Subscribed to topic: %s\n", _config.commandTopic.c_str());
    }
}

bool AchaemenidMQTT::publish(const String& topic, const uint8_t* payload, size_t length, bool retained) {
    if (LIKELY(_mqttClient.connected())) {
        _mqttClient.publish(topic.c_str(), _config.qos, retained, (const char*)payload, length);
        return true;
    }
    return false;
}

bool AchaemenidMQTT::publish(const String& topic, const String& payload, bool retained) {
    if (LIKELY(_mqttClient.connected())) {
        _mqttClient.publish(topic.c_str(), _config.qos, retained, payload.c_str());
        return true;
    }
    return false;
}

void AchaemenidMQTT::_onMqttConnect(bool sessionPresent) {
    Serial.println("[MQTT] Connected to MQTT broker!");
    _connManager.onConnect();
    
    IPAddress ip = WiFi.localIP();
    char onlinePayload[64];
    snprintf(onlinePayload, sizeof(onlinePayload), "{\"status\":\"online\",\"ip\":\"%d.%d.%d.%d\"}", ip[0], ip[1], ip[2], ip[3]);
    publish(_config.willTopic.c_str(), onlinePayload, true);

    if (_config.commandTopic.size() > 0) {
        _mqttClient.subscribe(_config.commandTopic.c_str(), _config.qos);
        Serial.printf("[MQTT] Subscribed to topic: %s\n", _config.commandTopic.c_str());
    }
}

void AchaemenidMQTT::_onMqttDisconnect(AsyncMqttClientDisconnectReason reason) {
    Serial.println("[MQTT] Disconnected from MQTT.");
    _connManager.onDisconnect();
}

HOT_PATH IRAM_ATTR void AchaemenidMQTT::_onMqttMessage(char* topic, char* payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total) {
    if (LIKELY(_messageCallback)) {
        _messageCallback((const uint8_t*)payload, len);
    }
}

} // namespace uniuno
