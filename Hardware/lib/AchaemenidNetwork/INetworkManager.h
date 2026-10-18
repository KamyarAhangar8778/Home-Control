#pragma once

#include <Future.h>
#include <Network/WiFi/WiFiConnector.h>
#include <Optimization/CompilerTraits.h>

namespace uniuno {

/**
 * @brief Interface for managing Network/WiFi connections.
 * This allows mocking and dependency injection for the network layer.
 */
class INetworkManager {
public:
    virtual ~INetworkManager() = default;

    /**
     * @brief Add an access point credential to the network manager.
     */
    virtual void add_access_point(const char* ssid, const char* password) = 0;

    /**
     * @brief Begin async connection to the configured access points.
     */
    virtual Future<void, void, Error> connectAsync() = 0;

    /**
     * @brief Check if the device is currently connected to the network.
     * This method is expected to be called frequently (hot path).
     */
    virtual bool isConnected() const = 0;

    /**
     * @brief Get the underlying WiFiConnector instance if needed.
     */
    virtual WiFiConnector* getConnector() = 0;
};

} // namespace uniuno
