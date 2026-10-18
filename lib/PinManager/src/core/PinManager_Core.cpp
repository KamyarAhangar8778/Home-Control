#include "../PinManager.h"
#include <Utilities/logging.h>

PinManager::PinManager() : _registry(), _timerManager(_registry), _stateManager(_registry) {
}

PinManager::~PinManager() {
    // No dynamic memory to clean up anymore!
}

int PinManager::getActiveCount() const {
    int count = 0;
    for (int i = 0; i < MAX_PINS; i++) {
        const PinEntry* entry = _registry.getEntryByIndexConst(i);
        if (entry->active) count++;
    }
    return count;
}

void PinManager::printStatus() const {
    Serial.println("========= Pin Manager Status =========");
    Serial.printf("  Active pins: %d / %d\n", getActiveCount(), MAX_PINS);
    for (int i = 0; i < MAX_PINS; i++) {
        const PinEntry* entry = _registry.getEntryByIndexConst(i);
        if (!entry->active) continue;
        bool st;
        if (entry->type == SegmentType::Input) {
            st = digitalRead(entry->pinNumber) == HIGH;
        } else {
            st = entry->hasGpio ? entry->gpio.getState() : false;
        }
        Serial.printf("  [%d] id=%s  type=%s pin=%d  state=%s  autoOff=%ds\n",
            i, entry->segmentId, (entry->type == SegmentType::Input ? "input" : "output"),
            entry->pinNumber, st ? "ON" : "OFF", entry->autoOffDelay);
    }
    Serial.println("======================================");
}

String PinManager::exportStateJson() const {
    String json = "{\"type\":\"state_sync\",\"states\":{";
    bool first = true;
    for (int i = 0; i < MAX_PINS; i++) {
        const PinEntry* entry = _registry.getEntryByIndexConst(i);
        if (entry->active && entry->type != SegmentType::Input && entry->hasGpio) {
            if (!first) json += ",";
            json += "\"" + String(entry->pinNumber) + "\":" + (entry->gpio.getState() ? "true" : "false");
            first = false;
        }
    }
    json += "}}";
    return json;
}
