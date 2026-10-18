#ifndef PIN_ENTRY_H
#define PIN_ENTRY_H

#include <Arduino.h>
#include <GpioSwitch.h>
#include <AchaemenidConfigProtocol.h>
#include <Timer/TimerHandle.h>

enum class SegmentType : uint8_t {
    Output,
    Input
};

struct PinEntry {
    // 32-byte arrays
    char segmentId[32];
    
    // Large structs/objects (ordered by typical descending size to minimize alignment padding)
    RuleConfig rule;
    RuleAction pendingHoldAction;
    GpioSwitch gpio;
    
    uniuno::TimerHandle autoOffTimer;
    uniuno::TimerHandle cloudSyncTimer;
    uniuno::TimerHandle ruleActionTimer;
    uniuno::TimerHandle holdTimer;

    // 4-byte fundamental types
    unsigned long stateStartTime;
    int pinNumber;
    int autoOffDelay;
    
    // 1-byte types
    SegmentType type;
    
    // Bitfields (Packed into a single byte)
    bool hasGpio : 1; // flag to know if gpio is initialized
    bool lastInputState : 1;
    bool pendingRuleActionState : 1;
    bool isHandled : 1;
    bool active : 1;
};

#endif
