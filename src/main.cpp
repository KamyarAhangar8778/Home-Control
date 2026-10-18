/**
 * @file main.cpp
 * @brief Achaemenid IoT Node - Event-Driven Architecture (Refactored)
 */

#include <Arduino.h>
#include <core/Globals.h>
#include <setup/SystemSetup.h>
#include <BootManager.h>
#include <RuleEngine.h>
#include <Utilities/logging.h>
#include <AppEvents.h>
#include "events/EventHandlers.h"
#include <setup/NetworkStorage.h>
#include <core/WebSocketServer.h>
#include <core/WebSocketClient.h>
#include <NvsSegmentStorage.h>

void setup() {
    Serial.begin(115200);
    delay(1000);

    Serial.println("\n==========================================");
    Serial.println("  Achaemenid IoT Node - Modular Async     ");
    Serial.println("==========================================");

    setupErrorHandler();
    setupEventBus();
    setupNetworkAndTime();
    setupTimer();
    if (appTimer != nullptr) {
        appTimer->startHardwareTimer(1000);
        INFO("[System] Hardware timer started at 1ms resolution.");
    }
    setupMqtt();
    setupWebSocket();

    setupRuleEngine();

    // Load Network Configuration from NVS
    String savedSSID[3];
    String savedPass[3];
    int savedCount = 0;
    MqttConfig savedMqtt;
    loadNetworkConfig(savedSSID, savedPass, savedCount, savedMqtt);

    if (savedCount > 0) {
        INFOF("[System] Found %d saved WiFi networks in NVS", savedCount);
        for (int i = 0; i < savedCount; i++) {
            ::network->add_access_point(savedSSID[i].c_str(), savedPass[i].c_str());
        }
    }
    
    // Always add the hardcoded fallback as the last resort
    ::network->add_access_point(WIFI_SSID, WIFI_PASSWORD);
    
    // Also restore MQTT if valid
    if (savedMqtt.valid) {
        mqttClient.begin(String(savedMqtt.host), savedMqtt.port, String(savedMqtt.baseTopic), savedMqtt.qos, "", "");
        INFOF("[System] Restored MQTT settings from NVS (Host: %s)", savedMqtt.host);
    }

    INFO("[System] Setup completed. Starting Async Boot Sequence...");
    
    // Start Boot Sequence
    segmentStorage = new uniuno::NvsSegmentStorage();
    bootManager = new BootManager();

    BootContext bootCtx = {
        ::network,
        &pinManager,
        &executor,
        &eventBus,
        appTimer,
        segmentStorage,
        &configLoaded,
        &rawConfigPayload
    };
    bootManager->startBootSequenceAsync(bootCtx);
}

void loop() {
    // 1. Poll the global async executor (handles WiFi, NTP, Config)
    executor.poll();

    // 2. Process incoming MQTT messages safely in the main loop
    mqttClient.processQueue();

    // 3. Keep internal connection instances alive (httpClient removed)

    // 4. Process inputs for segments of type 'input'
    if (ruleEngine) {
        pinManager.processInputs([](int pin, bool state, unsigned long dur, const RuleConfig& r) {
            ruleEngine->handleInput(pin, state, dur, r);
        });
    }

    // 5. Poll Local WebSocket Server
    if (wsServer) wsServer->loop();

    // 6. WebSocket Client (Cloud API) - Zero Latency KeepAlive
    if (wsClient) wsClient->loop();
}