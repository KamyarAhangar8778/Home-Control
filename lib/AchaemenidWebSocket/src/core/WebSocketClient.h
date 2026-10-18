#pragma once

#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/semphr.h>
#include <ArduinoWebsockets.h>
#include <Events/EventDispatcher.h>
#include "WebSocketConfig.h"

namespace uniuno {

class WsClientParser;

class AchaemenidWebSocketClient {
public:
    AchaemenidWebSocketClient(EventDispatcher* dispatcher, std::function<String()> stateProvider);
    ~AchaemenidWebSocketClient();

    void begin(const String& serverUrl);
    void stop();
    void sendText(const String& payload);
    void requestConfig();
    void syncPinState(int pin, bool state);

    void loop();

private:


    void onMessageCallback(websockets::WebsocketsMessage message);
    void onEventsCallback(websockets::WebsocketsEvent event, String data);

    static void connectTask(void* param);
    void doConnect();

    websockets::WebsocketsClient* client_ = nullptr;
    WebSocketConfig config_;
    
    volatile bool isRunning_;
    volatile bool firstConnection_;
    portMUX_TYPE firstConnMux_ = portMUX_INITIALIZER_UNLOCKED;

    unsigned long lastPingTime_ = 0;
    volatile bool isConnecting_ = false;
    TaskHandle_t connectTaskHandle_ = nullptr;
    EventDispatcher* dispatcher_;
    std::function<String()> stateProvider_;
    WsClientParser* parser_;
};

} // namespace uniuno
