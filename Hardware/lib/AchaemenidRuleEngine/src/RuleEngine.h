#ifndef RULE_ENGINE_H
#define RULE_ENGINE_H

#include <AchaemenidMQTT.h>
#include <Timer/Timer.h>
#include <Events/EventDispatcher.h>
#include <Core/Async/Executor.h>
#include <PinManager.h>

struct RuleContext {
    uniuno::AchaemenidMQTT* mqttClient;
    uniuno::Timer* appTimer;
    uniuno::Executor* executor;
    uniuno::EventDispatcher* eventBus;
    PinManager* pinManager;
    bool* isDashboardOnline;
};

class RuleEngine {
public:
    RuleEngine(RuleContext ctx);
    void handleInput(int sourcePin, bool newState, unsigned long durationSec, const RuleConfig& rule);

private:
    void executeAction(const RuleAction& act, int sourcePin);
    void onTimerExpired(uniuno::TimerExpiredEvent* evt);

    RuleContext _ctx;
};

#endif // RULE_ENGINE_H
