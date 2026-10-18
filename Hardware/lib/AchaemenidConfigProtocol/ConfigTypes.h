#ifndef CONFIG_TYPES_H
#define CONFIG_TYPES_H

#include <Arduino.h>

static const int MAX_SEGMENTS = 16;

enum RuleActionType : uint8_t {
    ACTION_IMMEDIATE = 0,
    ACTION_AFTER_DELAY = 1,
    ACTION_FOR_DURATION = 2
};

struct RuleAction {
    int requiredHoldTime; // 0, 3, 5, 10
    int targetPin;
    int delay;
    RuleActionType actionType;
    bool actionState : 1;

    RuleAction() : requiredHoldTime(0), targetPin(-1), delay(0), actionType(ACTION_IMMEDIATE), actionState(false) {}
};

struct RuleConfig {
    RuleAction highActions[4];
    RuleAction lowActions[4];
    
    int highActionCount;
    int lowActionCount;
    
    bool active : 1;

    RuleConfig() : highActionCount(0), lowActionCount(0), active(false) {}
};

struct SegmentConfig {
    char id[32];
    char type[16];
    RuleConfig rule;
    
    int pin;
    int autoOffDelay;
    
    bool value : 1;
    bool valid : 1;

    SegmentConfig() : pin(-1), autoOffDelay(0), value(false), valid(false) {
        id[0] = '\0';
        type[0] = '\0';
    }
};

struct MqttConfig {
    char host[64];
    char baseTopic[64];
    
    int port;
    int qos;
    
    bool valid : 1;

    MqttConfig() : port(1883), qos(1), valid(false) {
        host[0] = '\0';
        baseTopic[0] = '\0';
    }
};

struct WifiNetworkConfig {
    char password[64];
    char ssid[32];
    
    bool valid : 1;

    WifiNetworkConfig() : valid(false) {
        ssid[0] = '\0';
        password[0] = '\0';
    }
};

struct ParseResult {
    SegmentConfig segments[MAX_SEGMENTS];
    MqttConfig mqtt;
    WifiNetworkConfig wifi[3];
    
    int wifiCount;
    int count;
    
    bool success : 1;

    ParseResult() : wifiCount(0), count(0), success(false) {}
};

#endif // CONFIG_TYPES_H
