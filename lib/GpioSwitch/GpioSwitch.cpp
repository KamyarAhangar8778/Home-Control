#include "GpioSwitch.h"

GpioSwitch::GpioSwitch() 
    : _pin(-1), _state(false), _activeHigh(true) {}

GpioSwitch::GpioSwitch(int8_t pin, bool activeHigh) 
    : _pin(pin), _state(false), _activeHigh(activeHigh) {}

void GpioSwitch::setPin(int8_t pin, bool activeHigh) {
    _pin = pin;
    _activeHigh = activeHigh;
}

void GpioSwitch::begin() {
    pinMode(_pin, OUTPUT);
    updateHardware();
}

void GpioSwitch::turnOn() {
    _state = true;
    updateHardware();
}

void GpioSwitch::turnOff() {
    _state = false;
    updateHardware();
}

void GpioSwitch::toggle() {
    _state = !_state;
    updateHardware();
}

void GpioSwitch::setState(bool state) {
    _state = state;
    updateHardware();
}

bool GpioSwitch::getState() const {
    return _state;
}

int8_t GpioSwitch::getPin() const {
    return _pin;
}

void GpioSwitch::updateHardware() {
    // اگر activeHigh باشد، روشن بودن یعنی HIGH و خاموش بودن یعنی LOW
    // اگر activeLow باشد (مانند برخی رله‌ها)، روشن بودن یعنی LOW و خاموش بودن یعنی HIGH
    if (_activeHigh) {
        digitalWrite(_pin, _state ? HIGH : LOW);
    } else {
        digitalWrite(_pin, _state ? LOW : HIGH);
    }
}
