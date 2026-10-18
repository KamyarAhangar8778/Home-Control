#include "RuleParsers.h"
#include <AppEvents.h>
#include <Utilities/logging.h>
#include <Optimization/CompilerTraits.h>
#include <Optimization/StaticString.h>

namespace uniuno {

FORCE_INLINE static int32_t readInt32LE(const uint8_t* buf, size_t offset) {
    int32_t val = 0;
    val |= ((int32_t)buf[offset]);
    val |= ((int32_t)buf[offset + 1] << 8);
    val |= ((int32_t)buf[offset + 2] << 16);
    val |= ((int32_t)buf[offset + 3] << 24);
    return val;
}

bool RuleParsers::canHandle(uint8_t cmdType) const {
    return cmdType == 0x05;
}

void RuleParsers::handle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (len > 0 && payload[0] == 0x05) {
        parseUpdateRule(payload, len, dispatcher);
    }
}

HOT_PATH IRAM_ATTR void RuleParsers::parseUpdateRule(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (LIKELY(len >= 3)) {
        size_t offset = 1;
        
        StaticString<32> idStr;
        while (offset < len && payload[offset] != '\0' && idStr.size() < idStr.capacity()) {
            char c[2] = {(char)payload[offset++], '\0'};
            idStr += c;
        }
        while (offset < len && payload[offset] != '\0') offset++;
        if (offset < len) offset++; 

        RuleConfig newRule;
        newRule.active = true;

        if (LIKELY(offset < len)) {
            uint8_t highCount = payload[offset++];
            int c = 0;
            for (int i = 0; i < highCount && offset + 11 <= len; i++) {
                if (LIKELY(c < 4)) {
                    newRule.highActions[c].targetPin = (int8_t)payload[offset];
                    newRule.highActions[c].requiredHoldTime = readInt32LE(payload, offset + 1);
                    newRule.highActions[c].actionState = (payload[offset + 5] == 0x01);
                    newRule.highActions[c].actionType = static_cast<RuleActionType>(payload[offset + 6]);
                    newRule.highActions[c].delay = readInt32LE(payload, offset + 7);
                    c++;
                }
                offset += 11;
            }
            newRule.highActionCount = c;
        }

        if (LIKELY(offset < len)) {
            uint8_t lowCount = payload[offset++];
            int c = 0;
            for (int i = 0; i < lowCount && offset + 11 <= len; i++) {
                if (LIKELY(c < 4)) {
                    newRule.lowActions[c].targetPin = (int8_t)payload[offset];
                    newRule.lowActions[c].requiredHoldTime = readInt32LE(payload, offset + 1);
                    newRule.lowActions[c].actionState = (payload[offset + 5] == 0x01);
                    newRule.lowActions[c].actionType = static_cast<RuleActionType>(payload[offset + 6]);
                    newRule.lowActions[c].delay = readInt32LE(payload, offset + 7);
                    c++;
                }
                offset += 11;
            }
            newRule.lowActionCount = c;
        }

        SegmentUpdateRuleRequestEvent evt{idStr.c_str(), newRule};
        dispatcher->dispatch(evt);
        INFOF("[MQTT Handler] Binary Update Rule: id=%s high=%d low=%d", idStr.c_str(), newRule.highActionCount, newRule.lowActionCount);
    }
}

} // namespace uniuno
