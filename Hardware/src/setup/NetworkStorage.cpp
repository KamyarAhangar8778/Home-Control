#include "NetworkStorage.h"
#include <Preferences.h>
#include <Utilities/logging.h>

Preferences prefs;

void saveNetworkConfig(const ConfigLoadedEvent& config) {
    bool started = prefs.begin("AchaemenidNet", false); // false = read/write
    if (!started) {
        ERROR("[NetworkStorage] Failed to open Preferences");
        return;
    }

    // Save WiFi
    prefs.putInt("wifiCount", config.wifiCount);
    for (int i = 0; i < config.wifiCount; i++) {
        String ssidKey = "ssid" + String(i);
        String passKey = "pass" + String(i);
        
        // Smart write: only write if changed to save flash wear
        String currentSsid = prefs.getString(ssidKey.c_str(), "");
        String currentPass = prefs.getString(passKey.c_str(), "");
        
        if (currentSsid != config.wifi[i].ssid) {
            prefs.putString(ssidKey.c_str(), config.wifi[i].ssid);
            INFOF("[NetworkStorage] [DEBUG] WiFi SSID changed from '%s' to '%s'. Updated in NVS.", currentSsid.c_str(), config.wifi[i].ssid);
        } else {
            INFOF("[NetworkStorage] [DEBUG] WiFi SSID '%s' unchanged. Skipped flash write.", config.wifi[i].ssid);
        }
        if (currentPass != config.wifi[i].password) {
            prefs.putString(passKey.c_str(), config.wifi[i].password);
            INFO("[NetworkStorage] [DEBUG] WiFi Password changed. Updated in NVS.");
        } else {
            INFO("[NetworkStorage] [DEBUG] WiFi Password unchanged. Skipped flash write.");
        }
    }

    // Save MQTT
    if (config.mqtt.valid) {
        String currentHost = prefs.getString("mqHost", "");
        if (currentHost != config.mqtt.host) {
            prefs.putString("mqHost", config.mqtt.host);
            INFOF("[NetworkStorage] [DEBUG] MQTT Host changed from '%s' to '%s'.", currentHost.c_str(), config.mqtt.host);
        }

        String currentTopic = prefs.getString("mqTopic", "");
        if (currentTopic != config.mqtt.baseTopic) {
            prefs.putString("mqTopic", config.mqtt.baseTopic);
            INFOF("[NetworkStorage] [DEBUG] MQTT Topic changed from '%s' to '%s'.", currentTopic.c_str(), config.mqtt.baseTopic);
        }

        int currentPort = prefs.getInt("mqPort", -1);
        if (currentPort != config.mqtt.port) {
            prefs.putInt("mqPort", config.mqtt.port);
        }

        int currentQos = prefs.getInt("mqQos", -1);
        if (currentQos != config.mqtt.qos) {
            prefs.putInt("mqQos", config.mqtt.qos);
        }
        
        prefs.putBool("mqValid", true);
    }

    prefs.end();
    INFO("[NetworkStorage] Network configuration saved to NVS (Preferences)");
}

void loadNetworkConfig(String ssid[3], String pass[3], int& count, MqttConfig& mqttConfig) {
    bool started = prefs.begin("AchaemenidNet", true); // true = read-only
    if (!started) {
        WARNING("[NetworkStorage] Preferences empty or failed to open");
        count = 0;
        mqttConfig.valid = false;
        return;
    }

    count = prefs.getInt("wifiCount", 0);
    if (count > 3) count = 3;
    
    for (int i = 0; i < count; i++) {
        String ssidKey = "ssid" + String(i);
        String passKey = "pass" + String(i);
        
        ssid[i] = prefs.getString(ssidKey.c_str(), "");
        pass[i] = prefs.getString(passKey.c_str(), "");
        INFOF("[NetworkStorage] [DEBUG] Stored Network %d - SSID: '%s', Pass: '%s'", i, ssid[i].c_str(), pass[i].c_str());
    }

    bool mqValid = prefs.getBool("mqValid", false);
    if (mqValid) {
        String host = prefs.getString("mqHost", "");
        String topic = prefs.getString("mqTopic", "");
        int port = prefs.getInt("mqPort", 1883);
        int qos = prefs.getInt("mqQos", 1);
        
        strncpy(mqttConfig.host, host.c_str(), sizeof(mqttConfig.host) - 1);
        strncpy(mqttConfig.baseTopic, topic.c_str(), sizeof(mqttConfig.baseTopic) - 1);
        mqttConfig.port = port;
        mqttConfig.qos = qos;
        mqttConfig.valid = true;
        
        INFOF("[NetworkStorage] [DEBUG] Stored MQTT Config - Host: '%s', Port: %d, Topic: '%s', QOS: %d", mqttConfig.host, mqttConfig.port, mqttConfig.baseTopic, mqttConfig.qos);
    } else {
        mqttConfig.valid = false;
        INFO("[NetworkStorage] [DEBUG] No valid MQTT config stored.");
    }

    prefs.end();
    INFOF("[NetworkStorage] Loaded %d WiFi networks and MQTT config from NVS", count);
}
