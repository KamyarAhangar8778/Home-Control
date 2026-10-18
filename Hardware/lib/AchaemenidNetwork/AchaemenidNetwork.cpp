#include "AchaemenidNetwork.h"
#include <Utilities/logging.h>
#include <WiFi.h>

namespace uniuno {

AchaemenidNetwork::AchaemenidNetwork(WiFiAdapter* wifiAdapter)
    : _wifiAdapter(wifiAdapter)
    , _wifiConnector(wifiAdapter)
    , _connectionFuture(Future<void, void, Error>::resolve())
    , _connected(false) {}

AchaemenidNetwork::~AchaemenidNetwork() {
    // No dynamic memory to clean up anymore! Zero-Allocation Architecture.
}

IRAM_ATTR void AchaemenidNetwork::add_access_point(const char* ssid, const char* password) {
    _wifiConnector.add_access_point(ssid, password);
}

IRAM_ATTR Future<void, void, Error> AchaemenidNetwork::connectAsync() {
    _connected = false;
    INFO("[AchaemenidNetwork] Async connection to added SSIDs...");
    
    // WiFi.setSleep(false) is already handled in ESP32WiFiAdapter::mode()
    
    return _wifiConnector.connect().and_then([this]() {
        this->_connected = true;
        IPAddress ip = WiFi.localIP();
        INFOF("[AchaemenidNetwork] Successfully connected to WiFi! Network: %s, IP: %d.%d.%d.%d", WiFi.SSID().c_str(), ip[0], ip[1], ip[2], ip[3]);
    });
}

} // namespace uniuno
