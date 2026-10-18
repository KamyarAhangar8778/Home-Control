#pragma once

#include <ArduinoWebsockets.h>

namespace uniuno {

/**
 * @brief Interface for parsing incoming WebSocket messages.
 * Using an interface allows Dependency Injection and easier unit testing.
 */
class IMessageParser {
public:
    virtual ~IMessageParser() = default;

    /**
     * @brief Parse the incoming WebSocket message and trigger internal events.
     * @param message The WebSocket message object.
     */
    virtual void parseMessage(const websockets::WebsocketsMessage& message) = 0;
};

} // namespace uniuno
