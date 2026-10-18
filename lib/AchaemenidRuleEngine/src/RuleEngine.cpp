#include "RuleEngine.h"
#include <Utilities/logging.h>
#include <AppEvents.h>
#include "evaluators/HoldTimeEvaluator.h"
#include "strategies/ActionStrategies.h"

RuleEngine::RuleEngine(RuleContext ctx) : _ctx(ctx) {
    if (_ctx.eventBus != nullptr) {
        // We use a lambda to capture `this` and forward it, since onTimerExpired is a member function now.
        _ctx.eventBus->on<uniuno::TimerExpiredEvent>([this](uniuno::TimerExpiredEvent* evt) {
            this->onTimerExpired(evt);
        });
    }
}

void RuleEngine::executeAction(const RuleAction& act, int sourcePin) {
    uniuno::rules::HoldTimeEvaluator eval(_ctx);
    // Since executeAction in HoldTimeEvaluator is private, wait, HoldTimeEvaluator handles processRelease which calls executeAction internally.
    // If we need to execute a single action, we can instantiate the strategy directly.
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
        uniuno::rules::ImmediateActionStrategy strategy;
        strategy.execute(act, sourcePin, _ctx);
    } else if (act.actionType == ACTION_AFTER_DELAY) {
        uniuno::rules::DelayedActionStrategy strategy;
        strategy.execute(act, sourcePin, _ctx);
    } else if (act.actionType == ACTION_FOR_DURATION) {
        uniuno::rules::DurationActionStrategy strategy;
        strategy.execute(act, sourcePin, _ctx);
    }
}

void RuleEngine::onTimerExpired(uniuno::TimerExpiredEvent* evt) {
    uniuno::TimerId expiredId = evt->timer_id;
    
    // Check Rule Action Timers
    int targetPin = _ctx.pinManager->findPinByRuleActionTimerId(expiredId);
    if (targetPin >= 0) {
        bool stateToApply = _ctx.pinManager->getPendingRuleActionState(targetPin);
        _ctx.pinManager->setRuleActionTimerIdByPin(targetPin, uniuno::TimerHandle());
        
        // Apply state directly since timer expired
        bool success = _ctx.pinManager->setPinState(targetPin, stateToApply);
        if (success) {
            PinStateChangedEvent changed{targetPin, stateToApply};
            _ctx.eventBus->dispatch(changed);
        }
        return;
    }

    // Check Hold Action Timers
    int sourcePin = _ctx.pinManager->findPinByHoldTimerId(expiredId);
    if (sourcePin >= 0) {
        RuleAction act = _ctx.pinManager->getPendingHoldAction(sourcePin);
        _ctx.pinManager->setHoldTimerIdByPin(sourcePin, uniuno::TimerHandle());
        executeAction(act, sourcePin);
        _ctx.pinManager->setIsHandledByPin(sourcePin, true);
        return;
    }
}

void RuleEngine::handleInput(int sourcePin, bool newState, unsigned long durationSec, const RuleConfig& rule) {
    INFOF("[Input] Pin %d state changed to %s (duration: %lus)", sourcePin, newState ? "HIGH" : "LOW", durationSec);
    
    if (*(_ctx.isDashboardOnline)) {
        char payload[64];
        snprintf(payload, sizeof(payload), "{\"id\":\"%d\",\"value\":%s}", sourcePin, newState ? "true" : "false");
        _ctx.mqttClient->publish("KamyarIoT/Achaemenid/State", payload);
    }

    if (_ctx.appTimer != nullptr) {
        uniuno::TimerHandle existingTimer = _ctx.pinManager->getCloudSyncTimerIdByPin(sourcePin);
        if (existingTimer.isActive()) {
            existingTimer.cancel();
            _ctx.pinManager->setCloudSyncTimerIdByPin(sourcePin, uniuno::TimerHandle());
        }
        
        uniuno::TimerHandle newTimer = _ctx.appTimer->setTimeout([this, sourcePin]() {
            _ctx.pinManager->setCloudSyncTimerIdByPin(sourcePin, uniuno::TimerHandle());
            bool finalState = _ctx.pinManager->getPinState(sourcePin);
            CloudSyncRequestEvent syncEvt{sourcePin, finalState};
            _ctx.eventBus->dispatch(syncEvt);
            INFOF("[Input] Synced debounced state of Pin %d to %s", sourcePin, finalState ? "HIGH" : "LOW");
        }, 1000);
        
        _ctx.pinManager->setCloudSyncTimerIdByPin(sourcePin, newTimer);
    }

    if (rule.active) {
        uniuno::rules::HoldTimeEvaluator evaluator(_ctx);

        if (_ctx.appTimer != nullptr) {
            uniuno::TimerHandle existingHoldTimer = _ctx.pinManager->getHoldTimerIdByPin(sourcePin);
            if (existingHoldTimer.isActive()) {
                existingHoldTimer.cancel();
                _ctx.pinManager->setHoldTimerIdByPin(sourcePin, uniuno::TimerHandle());
            }
        }

        if (newState == true) { // Changed to HIGH
            if (!_ctx.pinManager->getIsHandledByPin(sourcePin)) {
                evaluator.processRelease(rule.lowActions, rule.lowActionCount, durationSec, sourcePin);
            }
            
            _ctx.pinManager->setIsHandledByPin(sourcePin, false);
            
            if (rule.highActionCount == 1) {
                int reqHold = rule.highActions[0].requiredHoldTime;
                if (reqHold == 0) {
                    executeAction(rule.highActions[0], sourcePin);
                    _ctx.pinManager->setIsHandledByPin(sourcePin, true);
                } else if (_ctx.appTimer != nullptr) {
                    _ctx.pinManager->setPendingHoldAction(sourcePin, rule.highActions[0]);
                    uniuno::TimerHandle tid = _ctx.appTimer->setTimeout([](){}, reqHold * 1000);
                    _ctx.pinManager->setHoldTimerIdByPin(sourcePin, tid);
                }
            } else if (rule.highActionCount > 1 && _ctx.appTimer != nullptr) {
                bool has10s = false;
                RuleAction act10s;
                for (int i = 0; i < rule.highActionCount; i++) {
                    if (rule.highActions[i].requiredHoldTime == 10) {
                        has10s = true;
                        act10s = rule.highActions[i];
                        break;
                    }
                }
                
                if (has10s) {
                    _ctx.pinManager->setPendingHoldAction(sourcePin, act10s);
                    uniuno::TimerHandle tid = _ctx.appTimer->setTimeout([](){}, 11000);
                    _ctx.pinManager->setHoldTimerIdByPin(sourcePin, tid);
                }
            }
        } else { // Changed to LOW
            if (!_ctx.pinManager->getIsHandledByPin(sourcePin)) {
                evaluator.processRelease(rule.highActions, rule.highActionCount, durationSec, sourcePin);
            }
            
            _ctx.pinManager->setIsHandledByPin(sourcePin, false);
            
            if (rule.lowActionCount == 1) {
                int reqHold = rule.lowActions[0].requiredHoldTime;
                if (reqHold == 0) {
                    executeAction(rule.lowActions[0], sourcePin);
                    _ctx.pinManager->setIsHandledByPin(sourcePin, true);
                } else if (_ctx.appTimer != nullptr) {
                    _ctx.pinManager->setPendingHoldAction(sourcePin, rule.lowActions[0]);
                    uniuno::TimerHandle tid = _ctx.appTimer->setTimeout([](){}, reqHold * 1000);
                    _ctx.pinManager->setHoldTimerIdByPin(sourcePin, tid);
                }
            } else if (rule.lowActionCount > 1 && _ctx.appTimer != nullptr) {
                bool has10s = false;
                RuleAction act10s;
                for (int i = 0; i < rule.lowActionCount; i++) {
                    if (rule.lowActions[i].requiredHoldTime == 10) {
                        has10s = true;
                        act10s = rule.lowActions[i];
                        break;
                    }
                }
                
                if (has10s) {
                    _ctx.pinManager->setPendingHoldAction(sourcePin, act10s);
                    uniuno::TimerHandle tid = _ctx.appTimer->setTimeout([](){}, 11000);
                    _ctx.pinManager->setHoldTimerIdByPin(sourcePin, tid);
                }
            }
        }
    }
}
