#include "PinTimerManager.h"

int PinTimerManager::findPinByRuleActionTimerId(uniuno::TimerId timerId) const {
    if (timerId == uniuno::INVALID_TIMER_ID) return -1;
    for (int i = 0; i < MAX_PINS; i++) {
        const PinEntry* entry = _registry.getEntryByIndexConst(i);
        if (entry->active && entry->ruleActionTimer.getId() == timerId) {
            return entry->pinNumber;
        }
    }
    return -1;
}

int PinTimerManager::findPinByHoldTimerId(uniuno::TimerId timerId) const {
    if (timerId == uniuno::INVALID_TIMER_ID) return -1;
    for (int i = 0; i < MAX_PINS; i++) {
        const PinEntry* entry = _registry.getEntryByIndexConst(i);
        if (entry->active && entry->holdTimer.getId() == timerId) {
            return entry->pinNumber;
        }
    }
    return -1;
}
