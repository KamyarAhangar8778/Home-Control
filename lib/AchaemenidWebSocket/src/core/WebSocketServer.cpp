#include "WebSocketServer.h"
#include "../parsers/WsServerParser.h"
namespace uniuno {

AchaemenidWebSocketServer::AchaemenidWebSocketServer(EventDispatcher* dispatcher, std::function<String()> stateProvider)
    : dispatcher_(dispatcher), stateProvider_(stateProvider) 
{
    parser_ = new WsServerParser(dispatcher_, stateProvider_);
}

AchaemenidWebSocketServer::~AchaemenidWebSocketServer() {
    if (parser_) {
        delete parser_;
        parser_ = nullptr;
    }
}

void AchaemenidWebSocketServer::begin(uint16_t port) {
    if (_isStarted) return;
    server.listen(port);
    _isStarted = true;
    Serial.printf("[LocalWS] Server started on port %d\n", port);
}

void AchaemenidWebSocketServer::loop() {
    if (server.poll() && clientCount < WS_SERVER_MAX_CLIENTS) {
        uint8_t idx = clientCount;
        clients[idx] = server.accept();
        clientCount++;

        Serial.printf("[LocalWS] New client connected (slot %d/%d)\n", idx + 1, WS_SERVER_MAX_CLIENTS);

        clients[idx].onMessage([this, idx](websockets::WebsocketsMessage msg) {
            this->handleMessage(idx, msg);
        });
        clients[idx].onEvent([this, idx](websockets::WebsocketsEvent event, String data) {
            this->handleEvent(idx, event, data);
        });
    }

    for (uint8_t i = 0; i < clientCount; ) {
        if (clients[i].available()) {
            clients[i].poll();
            ++i;
        } else {
            Serial.printf("[LocalWS] Client %d disconnected\n", i + 1);
            if (i < clientCount - 1) {
                uint8_t lastIdx = clientCount - 1;
                clients[i] = std::move(clients[lastIdx]);
                clients[i].onMessage([this, i](websockets::WebsocketsMessage msg) {
                    this->handleMessage(i, msg);
                });
                clients[i].onEvent([this, i](websockets::WebsocketsEvent event, String data) {
                    this->handleEvent(i, event, data);
                });
            }
            clientCount--;
        }
    }
}

void AchaemenidWebSocketServer::handleMessage(uint8_t idx, websockets::WebsocketsMessage msg) {
    if (msg.isText() && parser_) {
        parser_->parseMessage(msg.data(), clients[idx]);
    }
}

void AchaemenidWebSocketServer::handleEvent(uint8_t idx, websockets::WebsocketsEvent event, String /*data*/) {
    if (event == websockets::WebsocketsEvent::ConnectionClosed) {
        Serial.printf("[LocalWS] Connection closed (slot %d)\n", idx + 1);
    }
}

void AchaemenidWebSocketServer::broadcastState(const String& stateJson) {
    broadcastState(stateJson.c_str());
}

void AchaemenidWebSocketServer::broadcastState(const char* stateJson) {
    for (uint8_t i = 0; i < clientCount; ++i) {
        if (clients[i].available()) {
            clients[i].send(stateJson);
        }
    }
}

} // namespace uniuno
