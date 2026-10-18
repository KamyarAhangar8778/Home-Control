#ifndef PIN_MANAGER_H
#define PIN_MANAGER_H

#include <Arduino.h>
#include <AchaemenidConfigProtocol.h>
#include <Optimization/CompilerTraits.h>
#include <functional>

#include "PinRegistry.h"
#include "timers/PinTimerManager.h"
#include "state/PinStateManager.h"

class PinManager {
public:
    PinManager();
    ~PinManager();

    bool addSegment(const char* id, SegmentType type, int pin, int autoOffDelay = 0, RuleConfig rule = RuleConfig());
    bool removeSegment(const char* id);
    bool updateSegmentRule(const char* id, const RuleConfig& rule);

    int getActiveCount() const;
    void printStatus() const;
    String exportStateJson() const;

    // --- State Delegation ---
    HOT_PATH FORCE_INLINE bool setPinState(int pin, bool state) {
        return _stateManager.setPinState(pin, state);
    }
    
    HOT_PATH FORCE_INLINE bool setStateById(const char* id, bool state) {
        return _stateManager.setStateById(id, state);
    }
    
    HOT_PATH FORCE_INLINE bool getPinState(int pin) const {
        return _stateManager.getPinState(pin);
    }

    HOT_PATH FORCE_INLINE void processInputs(std::function<void(int, bool, unsigned long, const RuleConfig&)> onInputChanged) {
        _stateManager.processInputs(onInputChanged);
    }

    HOT_PATH FORCE_INLINE RuleConfig getRuleByPin(int pin) const {
        return _stateManager.getRuleByPin(pin);
    }

    HOT_PATH FORCE_INLINE bool getIsHandledByPin(int pin) const {
        return _stateManager.getIsHandledByPin(pin);
    }

    HOT_PATH FORCE_INLINE void setIsHandledByPin(int pin, bool handled) {
        _stateManager.setIsHandledByPin(pin, handled);
    }
    
    HOT_PATH FORCE_INLINE bool getPendingRuleActionState(int pin) const {
        return _stateManager.getPendingRuleActionState(pin);
    }

    HOT_PATH FORCE_INLINE void setPendingRuleActionState(int pin, bool state) {
        _stateManager.setPendingRuleActionState(pin, state);
    }
    
    HOT_PATH FORCE_INLINE RuleAction getPendingHoldAction(int pin) const {
        return _stateManager.getPendingHoldAction(pin);
    }

    HOT_PATH FORCE_INLINE void setPendingHoldAction(int pin, const RuleAction& action) {
        _stateManager.setPendingHoldAction(pin, action);
    }

    // --- Timer Delegation ---
    HOT_PATH FORCE_INLINE int getAutoOffDelayByPin(int pin) const {
        return _timerManager.getAutoOffDelayByPin(pin);
    }

    HOT_PATH FORCE_INLINE void setAutoOffDelayByPin(int pin, int delay) {
        _timerManager.setAutoOffDelayByPin(pin, delay);
    }
    
    HOT_PATH FORCE_INLINE uniuno::TimerHandle getTimerIdByPin(int pin) const {
        return _timerManager.getTimerIdByPin(pin);
    }

    HOT_PATH FORCE_INLINE void setTimerIdByPin(int pin, uniuno::TimerHandle timer) {
        _timerManager.setTimerIdByPin(pin, timer);
    }
    
    HOT_PATH FORCE_INLINE uniuno::TimerHandle getCloudSyncTimerIdByPin(int pin) const {
        return _timerManager.getCloudSyncTimerIdByPin(pin);
    }

    HOT_PATH FORCE_INLINE void setCloudSyncTimerIdByPin(int pin, uniuno::TimerHandle timer) {
        _timerManager.setCloudSyncTimerIdByPin(pin, timer);
    }
    
    HOT_PATH FORCE_INLINE uniuno::TimerHandle getRuleActionTimerIdByPin(int pin) const {
        return _timerManager.getRuleActionTimerIdByPin(pin);
    }

    HOT_PATH FORCE_INLINE void setRuleActionTimerIdByPin(int pin, uniuno::TimerHandle timer) {
        _timerManager.setRuleActionTimerIdByPin(pin, timer);
    }
    
    HOT_PATH FORCE_INLINE uniuno::TimerHandle getHoldTimerIdByPin(int pin) const {
        return _timerManager.getHoldTimerIdByPin(pin);
    }

    HOT_PATH FORCE_INLINE void setHoldTimerIdByPin(int pin, uniuno::TimerHandle timer) {
        _timerManager.setHoldTimerIdByPin(pin, timer);
    }

    HOT_PATH FORCE_INLINE int findPinByRuleActionTimerId(uniuno::TimerId timerId) const {
        return _timerManager.findPinByRuleActionTimerId(timerId);
    }

    HOT_PATH FORCE_INLINE int findPinByHoldTimerId(uniuno::TimerId timerId) const {
        return _timerManager.findPinByHoldTimerId(timerId);
    }

private:
    PinRegistry _registry;
    PinTimerManager _timerManager;
    PinStateManager _stateManager;
};

#endif
