#include "WsServerParser.h"
#include <AppEvents.h>
#include <PinManager.h>
#include <Arduino.h>


namespace uniuno {

WsServerParser::WsServerParser(EventDispatcher* dispatcher, std::function<String()> stateProvider)
    : _dispatcher(dispatcher), _stateProvider(stateProvider) {}

void WsServerParser::parseMessage(const String& data, websockets::WebsocketsClient& client) {
    if (data.indexOf("\"command\":\"get_state\"") >= 0) {
        String stateJson = _stateProvider ? _stateProvider() : "{}";
        client.send(stateJson);
    } 
    else if (data.indexOf("\"command\":\"set_state\"") >= 0) {
        // Simple non-blocking JSON parsing (Dashboard sends flat JSON)
        int pinIdx = data.indexOf("\"pin\":");
        int stateIdx = data.indexOf("\"state\":");
        if (pinIdx >= 0 && stateIdx >= 0) {
            int pin = data.substring(pinIdx + 6).toInt();
            int state = data.substring(stateIdx + 8).toInt();
            PinStateChangeRequestEvent evt{pin, state == 1, 0};
            _dispatcher->dispatch(evt);
        }
    }
}

} // namespace uniuno
