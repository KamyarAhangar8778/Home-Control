#pragma once

#include <ArduinoWebsockets.h>
#include <Events/EventDispatcher.h>

#define WS_SERVER_MAX_CLIENTS 4

namespace uniuno {

class WsServerParser;

class AchaemenidWebSocketServer {
public:
    AchaemenidWebSocketServer(EventDispatcher* dispatcher, std::function<String()> stateProvider);
    ~AchaemenidWebSocketServer();

    void begin(uint16_t port);
    void loop();
    void broadcastState(const String& stateJson);
    void broadcastState(const char* stateJson);

private:

    
    void handleMessage(uint8_t idx, websockets::WebsocketsMessage msg);
    void handleEvent(uint8_t idx, websockets::WebsocketsEvent event, String data);

    websockets::WebsocketsServer server;
    websockets::WebsocketsClient clients[WS_SERVER_MAX_CLIENTS];
    uint8_t clientCount = 0;
    bool _isStarted = false;
    EventDispatcher* dispatcher_;
    std::function<String()> stateProvider_;
    class WsServerParser* parser_;
};

} // namespace uniuno
