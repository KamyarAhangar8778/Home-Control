#ifndef PIN_TIMER_MANAGER_H
#define PIN_TIMER_MANAGER_H

#include "PinRegistry.h"
#include <Optimization/CompilerTraits.h>
#include <Timer/TimerHandle.h>

class PinTimerManager {
public:
    PinTimerManager(PinRegistry& registry) : _registry(registry) {}

    HOT_PATH FORCE_INLINE int getAutoOffDelayByPin(int pin) const {
        const PinEntry* entry = _registry.getEntryByPinConst(pin);
        return entry ? entry->autoOffDelay : 0;
    }

    HOT_PATH FORCE_INLINE void setAutoOffDelayByPin(int pin, int delay) {
        PinEntry* entry = _registry.getEntryByPin(pin);
        if (entry) entry->autoOffDelay = delay;
    }
    
    HOT_PATH FORCE_INLINE uniuno::TimerHandle getTimerIdByPin(int pin) const {
        const PinEntry* entry = _registry.getEntryByPinConst(pin);
        return entry ? entry->autoOffTimer : uniuno::TimerHandle();
    }

    HOT_PATH FORCE_INLINE void setTimerIdByPin(int pin, uniuno::TimerHandle timer) {
        PinEntry* entry = _registry.getEntryByPin(pin);
        if (entry) entry->autoOffTimer = timer;
    }
    
    HOT_PATH FORCE_INLINE uniuno::TimerHandle getCloudSyncTimerIdByPin(int pin) const {
        const PinEntry* entry = _registry.getEntryByPinConst(pin);
        return entry ? entry->cloudSyncTimer : uniuno::TimerHandle();
    }

    HOT_PATH FORCE_INLINE void setCloudSyncTimerIdByPin(int pin, uniuno::TimerHandle timer) {
        PinEntry* entry = _registry.getEntryByPin(pin);
        if (entry) entry->cloudSyncTimer = timer;
    }
    
    HOT_PATH FORCE_INLINE uniuno::TimerHandle getRuleActionTimerIdByPin(int pin) const {
        const PinEntry* entry = _registry.getEntryByPinConst(pin);
        return entry ? entry->ruleActionTimer : uniuno::TimerHandle();
    }

    HOT_PATH FORCE_INLINE void setRuleActionTimerIdByPin(int pin, uniuno::TimerHandle timer) {
        PinEntry* entry = _registry.getEntryByPin(pin);
        if (entry) entry->ruleActionTimer = timer;
    }
    
    HOT_PATH FORCE_INLINE uniuno::TimerHandle getHoldTimerIdByPin(int pin) const {
        const PinEntry* entry = _registry.getEntryByPinConst(pin);
        return entry ? entry->holdTimer : uniuno::TimerHandle();
    }

    HOT_PATH FORCE_INLINE void setHoldTimerIdByPin(int pin, uniuno::TimerHandle timer) {
        PinEntry* entry = _registry.getEntryByPin(pin);
        if (entry) entry->holdTimer = timer;
    }

    int findPinByRuleActionTimerId(uniuno::TimerId timerId) const;
    int findPinByHoldTimerId(uniuno::TimerId timerId) const;

private:
    PinRegistry& _registry;
};

#endif // PIN_TIMER_MANAGER_H
