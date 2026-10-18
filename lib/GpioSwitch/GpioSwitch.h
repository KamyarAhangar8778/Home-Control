#ifndef GPIO_SWITCH_H
#define GPIO_SWITCH_H

#include <Arduino.h>

class GpioSwitch {
public:
    // سازنده پیش‌فرض برای استفاده به عنوان Inline Object در ساختارها
    GpioSwitch();

    // سازنده: پین فیزیکی و حالت فعال‌بودن پیش‌فرض را دریافت می‌کند
    GpioSwitch(int8_t pin, bool activeHigh = true);

    // تعیین یا تغییر پین
    void setPin(int8_t pin, bool activeHigh = true);

    // راه‌اندازی پین به عنوان خروجی
    void begin();

    // روشن کردن سوئیچ
    void turnOn();

    // خاموش کردن سوئیچ
    void turnOff();

    // تغییر وضعیت سوئیچ به حالت مخالف
    void toggle();

    // قرار دادن وضعیت سوئیچ روی مقدار مشخص
    void setState(bool state);

    // خواندن وضعیت فعلی سوئیچ
    bool getState() const;

    // خواندن شماره پین فیزیکی
    int8_t getPin() const;

private:
    int8_t _pin = -1;
    bool _state : 1;
    bool _activeHigh : 1;

    // اعمال فیزیکی وضعیت به پایه میکروکنترلر
    void updateHardware();
};

#endif // GPIO_SWITCH_H
