#include "PinStateManager.h"
#include <Utilities/logging.h>
#if defined(ESP32)
#include <soc/gpio_struct.h>
#endif

bool PinStateManager::setPinState(int pin, bool state) {
    PinEntry* entry = _registry.getEntryByPin(pin);
    if (!entry || !entry->hasGpio) {
        return false;
    }
    entry->gpio.setState(state);
    INFOF("[PinManager] Pin %d -> %s", pin, state ? "ON" : "OFF");
    return true;
}

bool PinStateManager::setStateById(const char* id, bool state) {
    int idx = _registry.findById(id);
    PinEntry* entry = _registry.getEntryByIndex(idx);
    if (!entry || !entry->hasGpio) {
        return false;
    }
    entry->gpio.setState(state);
    INFOF("[PinManager] '%s' (pin %d) -> %s", id, entry->pinNumber, state ? "ON" : "OFF");
    return true;
}

void PinStateManager::rebuildInputCache() {
    _numInputs = 0;
    for (int i = 0; i < MAX_PINS; i++) {
        const PinEntry* entry = _registry.getEntryByIndexConst(i);
        if (entry->active && entry->type == SegmentType::Input) {
            _inputIndices[_numInputs++] = i;
        }
    }
}

HOT_PATH IRAM_ATTR void PinStateManager::processInputs(std::function<void(int, bool, unsigned long, const RuleConfig&)> onInputChanged) {
    if (_numInputs == 0) return;

    unsigned long currentMillis = millis();

#if defined(ESP32)
    uint32_t gpio0_31 = GPIO.in;
    uint32_t gpio32_39 = GPIO.in1.val;
#endif

    for (uint8_t i = 0; i < _numInputs; i++) {
        uint8_t idx = _inputIndices[i];
        PinEntry* entry = _registry.getEntryByIndex(idx);
        if (!entry) continue;
        
        int pin = entry->pinNumber;

        if (entry->stateStartTime == 0) {
            entry->stateStartTime = currentMillis;
        }

        bool currentState = false;
#if defined(ESP32)
        if (pin < 32) {
            currentState = (gpio0_31 & (1ULL << pin)) != 0;
        } else if (pin < 40) {
            currentState = (gpio32_39 & (1ULL << (pin - 32))) != 0;
        }
#else
        currentState = digitalRead(pin) == HIGH;
#endif

        if (currentState != entry->lastInputState) {
            unsigned long durationSec = (currentMillis - entry->stateStartTime) / 1000;
            entry->stateStartTime = currentMillis;
            entry->lastInputState = currentState;
            if (onInputChanged != nullptr) {
                onInputChanged(pin, currentState, durationSec, entry->rule);
            }
        }
    }
}
