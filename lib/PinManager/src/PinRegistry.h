#ifndef PIN_REGISTRY_H
#define PIN_REGISTRY_H

#include "PinEntry.h"
#include <Optimization/CompilerTraits.h>

static const int MAX_PINS = 16;

class PinRegistry {
public:
    PinRegistry() {
        for (int i = 0; i < MAX_PINS; i++) {
            _entries[i].active = false;
            _entries[i].hasGpio = false;
            _entries[i].segmentId[0] = '\0';
            _entries[i].pinNumber = -1;
            _entries[i].autoOffDelay = 0;
            _entries[i].lastInputState = false;
            _entries[i].pendingRuleActionState = false;
            _entries[i].pendingHoldAction = RuleAction();
            _entries[i].isHandled = false;
        }
        for (int i = 0; i < 40; i++) {
            _pinToIndex[i] = -1;
        }
    }

    HOT_PATH FORCE_INLINE PinEntry* getEntryByPin(int pin) {
        if (pin < 0 || pin >= 40) return nullptr;
        int idx = _pinToIndex[pin];
        return (idx < 0) ? nullptr : &_entries[idx];
    }

    HOT_PATH FORCE_INLINE const PinEntry* getEntryByPinConst(int pin) const {
        if (pin < 0 || pin >= 40) return nullptr;
        int idx = _pinToIndex[pin];
        return (idx < 0) ? nullptr : &_entries[idx];
    }

    HOT_PATH FORCE_INLINE PinEntry* getEntryByIndex(int index) {
        if (index < 0 || index >= MAX_PINS) return nullptr;
        return &_entries[index];
    }

    HOT_PATH FORCE_INLINE const PinEntry* getEntryByIndexConst(int index) const {
        if (index < 0 || index >= MAX_PINS) return nullptr;
        return &_entries[index];
    }

    HOT_PATH int findEmptySlot() const {
        for (int i = 0; i < MAX_PINS; i++) {
            if (!_entries[i].active) return i;
        }
        return -1;
    }

    HOT_PATH int findById(const char* id) const {
        for (int i = 0; i < MAX_PINS; i++) {
            if (_entries[i].active && strcmp(_entries[i].segmentId, id) == 0) {
                return i;
            }
        }
        return -1;
    }

    HOT_PATH FORCE_INLINE void mapPin(int pin, int index) {
        if (pin >= 0 && pin < 40) {
            _pinToIndex[pin] = index;
        }
    }

    HOT_PATH FORCE_INLINE void unmapPin(int pin) {
        if (pin >= 0 && pin < 40) {
            _pinToIndex[pin] = -1;
        }
    }

private:
    PinEntry _entries[MAX_PINS];
    int _pinToIndex[40];
};

#endif // PIN_REGISTRY_H
