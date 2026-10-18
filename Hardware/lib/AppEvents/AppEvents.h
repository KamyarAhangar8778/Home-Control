#ifndef APP_EVENTS_H
#define APP_EVENTS_H
#include <ConfigTypes.h>

/**
 * @file AppEvents.h
 * @brief Application-level event definitions for Achaemenid IoT Node.
 *
 * These events flow through the central EventDispatcher to decouple
 * components and enable a reactive, event-driven architecture.
 *
 * ARCHITECTURE:
 *   MQTT Message → MqttCommandEvent → MqttCommandHandler
 *     → PinStateChangeRequestEvent → PinManager
 *       → PinStateChangedEvent → (logging, future dashboard sync, etc.)
 */

/**
 * @struct MqttCommandEvent
 * @brief Dispatched when a raw MQTT payload arrives.
 *
 * Listeners parse the payload and take appropriate action.
 */
struct MqttCommandEvent {
    static constexpr const char* Name = "mqtt.command";
    const char* payload;  /**< Raw JSON payload string */
};

/**
 * @struct PinStateChangeRequestEvent
 * @brief Request to change a pin's state (from MQTT or HTTP).
 *
 * PinManager listens for this and applies the change to hardware.
 */
struct PinStateChangeRequestEvent {
    static constexpr const char* Name = "pin.change_request";
    int pin;       /**< Physical GPIO pin number */
    bool state;    /**< Desired state (true=ON, false=OFF) */
    int auto_off;  /**< Time in seconds to auto-off, -1 for none */

    PinStateChangeRequestEvent(int p, bool s, int a = -1) : pin(p), state(s), auto_off(a) {}
};

/**
 * @struct SegmentAddRequestEvent
 * @brief Request to dynamically add a new segment at runtime.
 */
struct SegmentAddRequestEvent {
    static constexpr const char* Name = "segment.add_request";
    const char* id;    /**< Segment unique identifier */
    const char* type;  /**< Segment type (e.g., "gpio_toggle") */
    int pin;           /**< Physical GPIO pin number */
};

/**
 * @struct SegmentRemoveRequestEvent
 * @brief Request to dynamically remove a segment at runtime.
 */
struct SegmentRemoveRequestEvent {
    static constexpr const char* Name = "segment.remove_request";
    const char* id;    /**< Segment unique identifier to remove */
};

/**
 * @struct SegmentUpdateRuleRequestEvent
 * @brief Request to update the rule of an input segment.
 */
struct SegmentUpdateRuleRequestEvent {
    static constexpr const char* Name = "segment.update_rule_request";
    const char* id;
    RuleConfig rule;
};

/**
 * @struct PinStateChangedEvent
 * @brief Dispatched AFTER a pin state has been successfully changed.
 *
 * Can be used for logging, dashboard sync confirmation, etc.
 */
struct PinStateChangedEvent {
    static constexpr const char* Name = "pin.state_changed";
    int pin;       /**< Physical GPIO pin number */
    bool state;    /**< New state (true=ON, false=OFF) */
    bool syncCloudflare; /**< Should ESP32 send this to Cloudflare? */

    PinStateChangedEvent(int p, bool s, bool sync = true) : pin(p), state(s), syncCloudflare(sync) {}
};

/**
 * @struct ConfigLoadedEvent
 * @brief Dispatched when initial configuration is loaded from server.
 */
struct ConfigLoadedEvent {
    static constexpr const char* Name = "config.loaded";
    int pinCount;  /**< Number of pins configured */
    MqttConfig mqtt; /**< MQTT configuration parsed from server */
    WifiNetworkConfig wifi[3]; /**< WiFi configuration parsed from server */
    int wifiCount;
    
    ConfigLoadedEvent() : pinCount(0), wifiCount(0) {}
};

/**
 * @struct NetworkStatusEvent
 * @brief Dispatched when network connectivity changes.
 */
struct NetworkStatusEvent {
    static constexpr const char* Name = "network.status";
    bool connected;  /**< True if WiFi is connected */
};

/**
 * @struct DashboardPresenceEvent
 * @brief Dispatched when the dashboard announces its presence.
 */
struct DashboardPresenceEvent {
    static constexpr const char* Name = "dashboard.presence";
    bool isOnline;
};
/**
 * @struct StateSyncRequestEvent
 * @brief Dispatched when a client requests full state sync via MQTT.
 */
struct StateSyncRequestEvent {
    static constexpr const char* Name = "state.sync_request";
};

/**
 * @struct CloudSyncRequestEvent
 * @brief Request to sync a pin's state directly to the Cloudflare WS Client.
 */
struct CloudSyncRequestEvent {
    static constexpr const char* Name = "cloud.sync_request";
    int pin;
    bool state;
    CloudSyncRequestEvent(int p, bool s) : pin(p), state(s) {}
};

#endif // APP_EVENTS_H
