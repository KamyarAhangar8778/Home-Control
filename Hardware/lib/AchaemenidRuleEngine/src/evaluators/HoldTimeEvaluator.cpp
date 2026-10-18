#include "HoldTimeEvaluator.h"
#include "../strategies/ActionStrategies.h"

namespace uniuno {
namespace rules {

HoldTimeEvaluator::HoldTimeEvaluator(RuleContext& ctx) : _ctx(ctx) {}

void HoldTimeEvaluator::executeAction(const RuleAction& act, int sourcePin) {
    if (act.targetPin < 0) return;
    
    // Clear any existing rule timer for the target pin
    if (_ctx.appTimer != nullptr) {
        uniuno::TimerHandle existingTimer = _ctx.pinManager->getRuleActionTimerIdByPin(act.targetPin);
        if (existingTimer.isActive()) {
            existingTimer.cancel();
            _ctx.pinManager->setRuleActionTimerIdByPin(act.targetPin, uniuno::TimerHandle());
        }
    }

    if (act.actionType == ACTION_IMMEDIATE) {
        ImmediateActionStrategy strategy;
        strategy.execute(act, sourcePin, _ctx);
    } else if (act.actionType == ACTION_AFTER_DELAY) {
        DelayedActionStrategy strategy;
        strategy.execute(act, sourcePin, _ctx);
    } else if (act.actionType == ACTION_FOR_DURATION) {
        DurationActionStrategy strategy;
        strategy.execute(act, sourcePin, _ctx);
    }
}

void HoldTimeEvaluator::processRelease(const RuleAction* actions, int count, unsigned long durationSec, int sourcePin) {
    if (count == 0) return;
    
    int durationBracket = 0;
    if (durationSec < 2) durationBracket = 0;
    else if (durationSec < 4) durationBracket = 3;
    else if (durationSec < 7) durationBracket = 5;
    else durationBracket = 10;
    
    bool matchedAny = false;
    for (int i = 0; i < count; i++) {
        if (actions[i].requiredHoldTime == durationBracket) {
            executeAction(actions[i], sourcePin);
            matchedAny = true;
        }
    }
    
    if (!matchedAny && durationBracket == 10) {
        for (int i = 0; i < count; i++) {
            if (actions[i].requiredHoldTime == 10) {
                executeAction(actions[i], sourcePin);
            }
        }
    }
}

} // namespace rules
} // namespace uniuno
