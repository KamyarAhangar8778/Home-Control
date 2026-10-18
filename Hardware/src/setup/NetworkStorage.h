#ifndef NETWORK_STORAGE_H
#define NETWORK_STORAGE_H

#include <Arduino.h>
#include <AchaemenidConfigProtocol.h>
#include <AppEvents.h>

void saveNetworkConfig(const ConfigLoadedEvent& config);
void loadNetworkConfig(String ssid[3], String pass[3], int& count, MqttConfig& mqttConfig);

#endif // NETWORK_STORAGE_H
