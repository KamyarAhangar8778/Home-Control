#include "SystemSetup.h"
#include <core/Globals.h>
#include <Core/Error/ErrorHandler.h>
#include <Utilities/logging.h>
#include <parsers/MqttCommandDispatcher.h>
#include <parsers/StateParsers.h>
#include <parsers/SegmentParsers.h>
#include <parsers/RuleParsers.h>
#include <core/WebSocketClient.h>
#include <core/WebSocketServer.h>
#include <WiFi.h>
#include <RuleEngine.h>
#include <Network/WiFi/ESP32WiFiAdapter.h>
#include <AchaemenidNetwork.h>

void setupErrorHandler() {
    uniuno::ErrorHandler::getInstance().onError(
        [](const uniuno::ErrorInfo& info) {
            const char* sev =
                info.severity == uniuno::ErrorSeverity::CRITICAL ? "CRIT" :
                info.severity == uniuno::ErrorSeverity::ERROR    ? "ERR"  :
                info.severity == uniuno::ErrorSeverity::WARNING  ? "WARN" : "INFO";
            Serial.printf("[%s] %s: %s\n", sev, info.context, info.message);
        }
    );
    uniuno::ErrorHandler::getInstance().setThrottle("HTTP", 5000);
    uniuno::ErrorHandler::getInstance().setThrottle("MQTT", 5000);
}

void setupNetworkAndTime() {
    static uniuno::ESP32WiFiAdapter wifiAdapter;
    ::network = new uniuno::AchaemenidNetwork(&wifiAdapter);
}

void setupTimer() {
    uniuno::TimerFeatures features;
    features.timeout  = true;
    features.interval = true;
    features.clear    = true;
    appTimer = new uniuno::Timer(features, millis, &eventBus);

    // حذف شد: safety-net interval که هر ۶۰ ثانیه printStatus صدا میزد
    // و باعث می‌شد که sync غیرضروری برای پین‌ها صورت بگیرد.
    // وضعیت پین‌ها فقط هنگام بوت (BootManager) یک‌بار چاپ می‌شود.

    appTimer->setInterval([]() {
        if (!configLoaded || !::network || !::network->isConnected()) return;
        // Ping removed: MQTT connection is natively maintained by AsyncMqttClient (keep-alive)
        // LWT (Last Will and Testament) on /Status topic now handles offline detection.
    }, 60000);
}


void setupMqtt() {
    mqttDispatcher = new uniuno::MqttCommandDispatcher();
    
    static uniuno::StateParsers stateHandler;
    static uniuno::SegmentParsers segmentHandler;
    static uniuno::RuleParsers ruleHandler;
    
    mqttDispatcher->registerHandler(&stateHandler);
    mqttDispatcher->registerHandler(&segmentHandler);
    mqttDispatcher->registerHandler(&ruleHandler);
    
    mqttClient.setCallback([](const uint8_t* payload, size_t len) {
        if (mqttDispatcher) {
            mqttDispatcher->handlePayload(payload, len, &eventBus);
        }
    });
}

void setupWebSocket() {
    auto stateProvider = []() -> String {
        return pinManager.exportStateJson();
    };

    wsClient = new uniuno::AchaemenidWebSocketClient(&eventBus, stateProvider);
    wsServer = new uniuno::AchaemenidWebSocketServer(&eventBus, stateProvider);

    wsClient->begin("wss://apii.agkalaa.ir/ws");
}

void setupRuleEngine() {
    RuleContext ctx = {
        &mqttClient,
        appTimer,
        &executor,
        &eventBus,
        &pinManager,
        &isDashboardOnline
    };
    ruleEngine = new RuleEngine(ctx);
}
