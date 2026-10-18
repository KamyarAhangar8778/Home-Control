#include "EventHandlers.h"
#include <core/Globals.h>
#include <AppEvents.h>
#include <Utilities/logging.h>
#include <setup/NetworkStorage.h>
#include <core/WebSocketServer.h>
#include <core/WebSocketClient.h>
#include <AchaemenidMQTT.h>

/**
 * @brief Listener: Handles requested pin state changes (e.g. from MQTT).
 */
auto onPinChangeRequest = [](PinStateChangeRequestEvent* evt) {
    if (evt == nullptr) return;
    
    // Check if the pin is handled by a rule (e.g., button mode)
    if (pinManager.getIsHandledByPin(evt->pin)) {
        WARNINGF("[Event] Pin %d is currently handled by a Rule. Ignoring external request.", evt->pin);
        return;
    }

    if (pinManager.setPinState(evt->pin, evt->state)) {
        INFOF("[Event] Pin %d state changed to %s via Request", evt->pin, evt->state ? "ON" : "OFF");
        
        // Dispatch confirmed state change (sync=false because triggered externally)
        PinStateChangedEvent changedEvt{evt->pin, evt->state, false};
        eventBus.dispatch(changedEvt);

        // Sync to Cloudflare not needed here (Dashboard handles it directly)
        
        // Handle Auto-Off if requested
        if (evt->state && evt->auto_off > 0) {
            int delay = evt->auto_off;
            int pin = evt->pin;
            
            // Cancel existing timer if any
            uniuno::TimerHandle existing = pinManager.getTimerIdByPin(pin);
            if (existing.isActive()) {
                existing.cancel();
            }
            
            uniuno::TimerHandle newTimer = appTimer->setTimeout([pin, delay]() {
                // Check if still handled
                if (pinManager.getIsHandledByPin(pin)) return;
                
                // Turn off locally
                if (pinManager.setPinState(pin, false)) {
                    INFOF("[AutoOff] Pin %d turned OFF automatically", pin);
                    
                    // Dispatch event
                    PinStateChangedEvent changedOff{pin, false};
                    eventBus.dispatch(changedOff);
                }
            }, delay * 1000);
            
            pinManager.setTimerIdByPin(evt->pin, newTimer);
            INFOF("[AutoOff] Scheduled auto-off for pin %d in %ds", evt->pin, delay);
        }
    } else {
        WARNINGF("[Event] Failed to set pin %d (not found)", evt->pin);
    }
};

/**
 * @brief Listener: Handles dynamic segment add requests.
 */
auto onSegmentAdd = [](SegmentAddRequestEvent* evt) {
    if (evt == nullptr) return;
    SegmentType sType = SegmentType::Output;
    if (strcmp(evt->type, "input") == 0) {
        sType = SegmentType::Input;
    }
    bool success = pinManager.addSegment(
        evt->id, sType, evt->pin);
    if (success) {
        INFOF("[Event] Segment '%s' added on pin %d", evt->id, evt->pin);
    }
};

/**
 * @brief Listener: Handles dynamic segment remove requests.
 */
auto onSegmentRemove = [](SegmentRemoveRequestEvent* evt) {
    if (evt == nullptr) return;
    bool success = pinManager.removeSegment(evt->id);
    if (success) {
        INFOF("[Event] Segment '%s' removed", evt->id);
    }
};

/**
 * @brief Listener: Logs pin state changes (confirmation).
 */
auto onPinChanged = [](PinStateChangedEvent* evt) {
    if (evt == nullptr) return;
    INFOF("[Event] Pin %d confirmed -> %s. Syncing via Local WS, Global MQTT, and Cloudflare...", evt->pin, evt->state ? "ON" : "OFF");
    
    // Build sync message: stack-only, no heap allocation (replaces 4x String concat)
    char syncBuf[64];
    snprintf(syncBuf, sizeof(syncBuf), "{\"type\":\"sync_pin\",\"pin\":%d,\"state\":%d}", evt->pin, evt->state ? 1 : 0);
    if (wsServer) {
        wsServer->broadcastState(syncBuf);
    }
    // Publish to MQTT State (Retained)
    uint8_t payload[3] = {0x06, (uint8_t)evt->pin, (uint8_t)(evt->state ? 0x01 : 0x00)};
    mqttClient.publish(mqttClient.getBaseTopic() + "/State", payload, 3, true);

    // Sync to Cloudflare DurableObject via global WebSocket
    if (evt->syncCloudflare && wsClient) {
        wsClient->syncPinState(evt->pin, evt->state);
    }
};

/**
 * @brief Listener: Actions after config is loaded.
 */
auto onConfigLoaded = [](ConfigLoadedEvent* evt) {
    if (evt == nullptr) return;
    INFOF("[Event] Config loaded with %d pins.", evt->pinCount);
    
    // Save the new network configuration locally to NVS
    saveNetworkConfig(*evt);
    
    if (evt->mqtt.valid) {
        INFOF("[MQTT] Configuring dynamically: host=%s, port=%d, qos=%d", evt->mqtt.host, evt->mqtt.port, evt->mqtt.qos);
        mqttClient.begin(String(evt->mqtt.host), evt->mqtt.port, String(evt->mqtt.baseTopic), evt->mqtt.qos, "", "");
        mqttClient.subscribe(String(evt->mqtt.baseTopic) + "/Command");
        mqttClient.connect();
    } else {
        if (mqttClient.getBaseTopic().length() > 0) {
            INFO("[MQTT] Using MQTT settings already restored by main.cpp");
            mqttClient.subscribe(mqttClient.getBaseTopic() + "/Command");
            mqttClient.connect();
        } else {
            WARNING("[MQTT] No valid MQTT config received from server or NVS. Using fallback.");
            mqttClient.begin("broker.emqx.io", 1883, "KamyarIoT/Achaemenid", 1, "", "");
            mqttClient.subscribe("KamyarIoT/Achaemenid/Command");
            mqttClient.connect();
        }
    }
};

/**
 * @brief Listener: Handles requests to sync full state over MQTT.
 */
auto onStateSyncRequest = [](StateSyncRequestEvent* evt) {
    if (evt == nullptr) return;
    INFO("[Event] Syncing full state to MQTT...");
    String stateJson = pinManager.exportStateJson();
    mqttClient.publish(mqttClient.getBaseTopic() + "/State", stateJson, false);
};

/**
 * @brief Listener: Handles CloudSyncRequestEvent to sync directly to Cloudflare
 */
auto onCloudSyncRequest = [](CloudSyncRequestEvent* evt) {
    if (evt == nullptr) return;
    if (wsClient) {
        wsClient->syncPinState(evt->pin, evt->state);
    }
};

/**
 * @brief Listener: Handles network status changes
 */
auto onNetworkStatus = [](NetworkStatusEvent* evt) {
    if (evt == nullptr) return;
    if (evt->connected) {
        if (wsServer) wsServer->begin(81);
        
        // Delay MQTT connection by 2 seconds to avoid LWIP TCP window crash
        // caused by concurrent AsyncTCP and blocking WiFiClientSecure connections.
        appTimer->setTimeout([]() {
            mqttClient.connect();
        }, 2000);
    }
};

void setupEventBus() {
    // Register all event listeners
    eventBus.on<PinStateChangeRequestEvent>(onPinChangeRequest);
    eventBus.on<SegmentAddRequestEvent>(onSegmentAdd);
    eventBus.on<SegmentRemoveRequestEvent>(onSegmentRemove);
    eventBus.on<PinStateChangedEvent>(onPinChanged);
    eventBus.on<ConfigLoadedEvent>(onConfigLoaded);
    eventBus.on<StateSyncRequestEvent>(onStateSyncRequest);
    eventBus.on<NetworkStatusEvent>(onNetworkStatus);
    eventBus.on<CloudSyncRequestEvent>(onCloudSyncRequest);
}
