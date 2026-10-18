#pragma once

#include <ArduinoWebsockets.h>
#include <Events/EventDispatcher.h>
#include <functional>

namespace uniuno {

class WsServerParser {
public:
    WsServerParser(EventDispatcher* dispatcher, std::function<String()> stateProvider);
    void parseMessage(const String& data, websockets::WebsocketsClient& client);

private:
    EventDispatcher* _dispatcher;
    std::function<String()> _stateProvider;
};

} // namespace uniuno
