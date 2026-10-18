#pragma once

#include <ArduinoWebsockets.h>
#include <Events/EventDispatcher.h>
#include "IMessageParser.h"

namespace uniuno {

class WsClientParser : public IMessageParser {
public:
    WsClientParser(EventDispatcher* dispatcher);
    ~WsClientParser() override = default;

    void parseMessage(const websockets::WebsocketsMessage& message) override;

private:
    EventDispatcher* _dispatcher;
};

} // namespace uniuno
