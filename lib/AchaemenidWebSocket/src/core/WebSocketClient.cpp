#include "WebSocketClient.h"
#include <Arduino.h>
#include <WiFiClientSecure.h>
#include <tiny_websockets/network/generic_esp/generic_esp_clients.hpp>
#include <Optimization/CompilerTraits.h>
#include "../parsers/WsClientParser.h"


namespace uniuno {

// SSL client bypasses cert validation
class InsecureEsp32TcpClient : public websockets::network::GenericEspTcpClient<WiFiClientSecure> {
public:
    InsecureEsp32TcpClient() { client.setInsecure(); }
    ~InsecureEsp32TcpClient() { client.stop(); }
};

AchaemenidWebSocketClient::AchaemenidWebSocketClient(EventDispatcher* dispatcher, std::function<String()> stateProvider)
    : isRunning_(false), firstConnection_(true), dispatcher_(dispatcher), stateProvider_(stateProvider)
{
    parser_ = new WsClientParser(dispatcher_);
    auto secureClient = std::make_shared<InsecureEsp32TcpClient>();
    client_ = new websockets::WebsocketsClient(secureClient);

    client_->onMessage([this](websockets::WebsocketsMessage msg) {
        this->onMessageCallback(msg);
    });
    client_->onEvent([this](websockets::WebsocketsEvent ev, String data) {
        this->onEventsCallback(ev, data);
    });
}

AchaemenidWebSocketClient::~AchaemenidWebSocketClient() {
    stop();
    if (connectTaskHandle_) {
        vTaskDelete(connectTaskHandle_);
        connectTaskHandle_ = nullptr;
    }
    if (client_) {
        delete client_;
        client_ = nullptr;
    }
    if (parser_) {
        delete parser_;
        parser_ = nullptr;
    }
}

void AchaemenidWebSocketClient::sendText(const String& payload) {
    if (isConnecting_) return;
    if (client_ && LIKELY(client_->available())) {
        client_->send(payload);
    }
}

void AchaemenidWebSocketClient::requestConfig() {
    sendText("{\"type\":\"get_config\"}");
}

void AchaemenidWebSocketClient::syncPinState(int pin, bool state) {
    char payload[64];
    snprintf(payload, sizeof(payload), "{\"type\":\"sync_pin\",\"pin\":%d,\"state\":%s}", pin, state ? "true" : "false");
    sendText(payload);
}

void AchaemenidWebSocketClient::begin(const String& serverUrl) {
    if (UNLIKELY(isRunning_)) return;
    config_.serverUrl = serverUrl.c_str();
    isRunning_ = true;
    lastPingTime_ = 0;
}

void AchaemenidWebSocketClient::stop() {
    isRunning_ = false;
    if (client_) {
        client_->close();
    }
}

void AchaemenidWebSocketClient::connectTask(void* param) {
    AchaemenidWebSocketClient* self = static_cast<AchaemenidWebSocketClient*>(param);
    self->doConnect();
    self->isConnecting_ = false;
    self->connectTaskHandle_ = nullptr;
    vTaskDelete(nullptr);
}

void AchaemenidWebSocketClient::doConnect() {
    Serial.println("[WebSocket] [Task] Connecting to Cloudflare Worker...");

    if (client_) {
        client_->close();
        delete client_;
        client_ = nullptr;
    }
    
    auto secureClient = std::make_shared<InsecureEsp32TcpClient>();
    client_ = new websockets::WebsocketsClient(secureClient);

    client_->onMessage([this](websockets::WebsocketsMessage msg) {
        this->onMessageCallback(msg);
    });
    client_->onEvent([this](websockets::WebsocketsEvent ev, String data) {
        this->onEventsCallback(ev, data);
    });

    const bool connected = client_->connect("api.agkalaa.ir", 443, "/ws");

    if (LIKELY(connected)) {
        Serial.println("[WebSocket] [Task] Connected successfully!");
        lastPingTime_ = millis();
    } else {
        Serial.println("[WebSocket] [Task] Connection failed. Will retry in loop().");
    }
}

IRAM_ATTR void AchaemenidWebSocketClient::loop() {
    if (UNLIKELY(!isRunning_ || WiFi.status() != WL_CONNECTED || isConnecting_)) return;

    if (client_ && LIKELY(client_->available())) {
        client_->poll();
        const unsigned long now = millis();
        if (UNLIKELY(now - lastPingTime_ >= WS_PING_INTERVAL_MS)) {
            client_->ping();
            lastPingTime_ = now;
        }
    } else {
        isConnecting_ = true;
        xTaskCreatePinnedToCore(
            AchaemenidWebSocketClient::connectTask,
            "wsConnect",
            WS_CONNECT_TASK_STACK,
            this,
            WS_CONNECT_TASK_PRIO,
            &connectTaskHandle_,
            WS_CONNECT_TASK_CORE
        );
    }
}

void AchaemenidWebSocketClient::onMessageCallback(websockets::WebsocketsMessage message) {
    if (parser_) {
        parser_->parseMessage(message);
    }
}

void AchaemenidWebSocketClient::onEventsCallback(websockets::WebsocketsEvent event, String /*data*/) {
    if (event == websockets::WebsocketsEvent::ConnectionOpened) {
        bool isFirst;
        portENTER_CRITICAL(&firstConnMux_);
        isFirst = firstConnection_;
        if (firstConnection_) firstConnection_ = false;
        portEXIT_CRITICAL(&firstConnMux_);

        if (isFirst) {
            Serial.println("[WebSocket] Connection Opened (First). Requesting states...");
            sendText("{\"type\":\"get_all_states\"}");
        } else {
            Serial.println("[WebSocket] Connection Reopened. Syncing local state...");
            sendText(stateProvider_ ? stateProvider_() : "{}");
        }
    } else if (event == websockets::WebsocketsEvent::ConnectionClosed) {
        Serial.println("[WebSocket] Connection Closed");
    }
}

} // namespace uniuno
