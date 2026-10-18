#include "../PinManager.h"
#include <Utilities/logging.h>

bool PinManager::addSegment(const char* id, SegmentType type, int pin, int autoOffDelay, RuleConfig rule) {
    if (_registry.findById(id) >= 0) {
        WARNINGF("[PinManager] Segment '%s' already exists.", id);
        return false;
    }
    if (_registry.getEntryByPin(pin) != nullptr) {
        WARNINGF("[PinManager] Pin %d already in use.", pin);
        return false;
    }
    int slot = _registry.findEmptySlot();
    if (slot < 0) {
        WARNING("[PinManager] No empty slot for new segment.");
        return false;
    }

    PinEntry* entry = _registry.getEntryByIndex(slot);
    if (!entry) return false;

    strncpy(entry->segmentId, id, sizeof(entry->segmentId) - 1);
    entry->segmentId[sizeof(entry->segmentId) - 1] = '\0';
    entry->type = type;
    entry->pinNumber   = pin;
    entry->autoOffDelay = autoOffDelay;
    entry->autoOffTimer = uniuno::TimerHandle();
    entry->cloudSyncTimer = uniuno::TimerHandle();
    entry->ruleActionTimer = uniuno::TimerHandle();
    entry->holdTimer = uniuno::TimerHandle();
    entry->pendingRuleActionState = false;
    entry->pendingHoldAction = RuleAction();
    entry->isHandled = false;
    entry->rule        = rule;
    
    if (type == SegmentType::Input) {
        pinMode(pin, INPUT_PULLUP);
        entry->lastInputState = digitalRead(pin) == HIGH;
        entry->hasGpio = false;
    } else {
        entry->gpio.setPin(pin);
        entry->gpio.begin();
        entry->hasGpio = true;
    }
    
    _registry.mapPin(pin, slot);
    entry->active = true;
    
    INFOF("[PinManager] Added segment '%s' on pin %d (Type: %s)", id, pin, (type == SegmentType::Input ? "input" : "output"));
    _stateManager.rebuildInputCache();
    return true;
}

bool PinManager::removeSegment(const char* id) {
    int idx = _registry.findById(id);
    if (idx < 0) {
        WARNINGF("[PinManager] Segment '%s' not found.", id);
        return false;
    }
    
    PinEntry* entry = _registry.getEntryByIndex(idx);
    if (!entry) return false;

    if (entry->hasGpio) {
        entry->gpio.turnOff();
        entry->hasGpio = false;
    }
    entry->autoOffTimer.cancel();
    entry->cloudSyncTimer.cancel();
    entry->ruleActionTimer.cancel();
    entry->holdTimer.cancel();
    
    _registry.unmapPin(entry->pinNumber);

    entry->active    = false;
    entry->pinNumber = -1;
    entry->segmentId[0] = '\0';
    entry->autoOffDelay = 0;
    entry->autoOffTimer = uniuno::TimerHandle();
    entry->cloudSyncTimer = uniuno::TimerHandle();
    entry->ruleActionTimer = uniuno::TimerHandle();
    entry->lastInputState = false;
    entry->pendingRuleActionState = false;
    entry->pendingHoldAction = RuleAction();
    entry->holdTimer = uniuno::TimerHandle();
    entry->isHandled = false;
    
    INFOF("[PinManager] Removed segment '%s'", id);
    _stateManager.rebuildInputCache();
    return true;
}

bool PinManager::updateSegmentRule(const char* id, const RuleConfig& rule) {
    int idx = _registry.findById(id);
    if (idx < 0) return false;
    PinEntry* entry = _registry.getEntryByIndex(idx);
    if (entry) entry->rule = rule;
    return true;
}
