#ifndef GLOBALS_H
#define GLOBALS_H

#include <INetworkManager.h>
#include <PinManager.h>
#include <AchaemenidMQTT.h>
#include <Timer/Timer.h>
#include <Events/EventDispatcher.h>
#include <Core/Async/Executor.h>
// Forward declarations
namespace uniuno {
    class AchaemenidWebSocketClient;
    class AchaemenidWebSocketServer;
    class MqttCommandDispatcher;
    class ISegmentStorage;
}
class BootManager;
class RuleEngine;

// =============================================
// Configuration
// =============================================
extern const char* WIFI_SSID;
extern const char* WIFI_PASSWORD;

// =============================================
// Global Objects
// =============================================
extern uniuno::INetworkManager*   network;
extern String                     rawConfigPayload;
extern PinManager                 pinManager;
extern uniuno::AchaemenidMQTT     mqttClient;
extern uniuno::Timer*             appTimer;
extern uniuno::EventDispatcher    eventBus;
extern uniuno::Executor           executor;
extern uniuno::AchaemenidWebSocketClient* wsClient;
extern uniuno::AchaemenidWebSocketServer* wsServer;
extern uniuno::MqttCommandDispatcher* mqttDispatcher;
extern RuleEngine* ruleEngine;
extern BootManager* bootManager;
extern uniuno::ISegmentStorage* segmentStorage;

// =============================================
// State Variables
// =============================================
extern bool configLoaded;
extern bool configFetchStarted;
extern bool ntpSynced;
extern bool isDashboardOnline;
extern uniuno::TimerHandle dashboardTimeoutTimer;

#endif // GLOBALS_H
