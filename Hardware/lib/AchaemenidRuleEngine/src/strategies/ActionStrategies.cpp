#include "ActionStrategies.h"
#include <Utilities/logging.h>
#include <AppEvents.h>

namespace uniuno {
namespace rules {

static void applyState(int targetPin, bool stateToApply, RuleContext& ctx) {
    bool success = ctx.pinManager->setPinState(targetPin, stateToApply);
    if (success) {
        PinStateChangedEvent changed{targetPin, stateToApply};
        ctx.eventBus->dispatch(changed);
    }
}

void ImmediateActionStrategy::execute(const RuleAction& act, int sourcePin, RuleContext& ctx) {
    int tPin = act.targetPin;
    bool aState = act.actionState;
    INFOF("[Rule] Executing IMMEDIATE action: Set Pin %d to %s", tPin, aState ? "HIGH" : "LOW");
    applyState(tPin, aState, ctx);
}

void DelayedActionStrategy::execute(const RuleAction& act, int sourcePin, RuleContext& ctx) {
    int tPin = act.targetPin;
    bool aState = act.actionState;
    int actDelay = act.delay;
    INFOF("[Rule] Executing AFTER_DELAY action: Set Pin %d to %s after %ds", tPin, aState ? "HIGH" : "LOW", actDelay);
    
    if (ctx.appTimer != nullptr && actDelay > 0 && actDelay <= 60) {
        ctx.pinManager->setPendingRuleActionState(tPin, aState);
        uniuno::TimerHandle newTimer = ctx.appTimer->setTimeout([](){}, actDelay * 1000);
        ctx.pinManager->setRuleActionTimerIdByPin(tPin, newTimer);
    } else {
        applyState(tPin, aState, ctx);
    }
}

void DurationActionStrategy::execute(const RuleAction& act, int sourcePin, RuleContext& ctx) {
    int tPin = act.targetPin;
    bool aState = act.actionState;
    int actDelay = act.delay;
    INFOF("[Rule] Executing FOR_DURATION action: Set Pin %d to %s for %ds", tPin, aState ? "HIGH" : "LOW", actDelay);
    
    applyState(tPin, aState, ctx); // Apply immediately
    if (ctx.appTimer != nullptr && actDelay > 0 && actDelay <= 60) {
        ctx.pinManager->setPendingRuleActionState(tPin, !aState); // Reverse state after duration
        uniuno::TimerHandle newTimer = ctx.appTimer->setTimeout([](){}, actDelay * 1000);
        ctx.pinManager->setRuleActionTimerIdByPin(tPin, newTimer);
    }
}

} // namespace rules
} // namespace uniuno
