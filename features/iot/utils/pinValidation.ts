export interface PinValidationResult {
  isValid: boolean;
  message: string;
  isWarning?: boolean;
}

export const validateEsp32Pin = (pinStr: string, type: string): PinValidationResult => {
  const pin = parseInt(pinStr, 10);

  if (isNaN(pin) || pin < 0 || pin > 39) {
    return { isValid: false, message: "شماره پایه نامعتبر است (باید بین ۰ تا ۳۹ باشد)." };
  }

  // Flash pins (strictly forbidden)
  const flashPins = [6, 7, 8, 9, 10, 11];
  if (flashPins.includes(pin)) {
    return {
      isValid: false,
      message: "این پایه‌ها برای حافظه فلش داخلی رزرو شده‌اند و استفاده از آن‌ها باعث اختلال دستگاه می‌شود.",
    };
  }

  // Input-only pins (no internal pull-up/pull-down, no output capability)
  const inputOnlyPins = [34, 35, 36, 39];
  if (inputOnlyPins.includes(pin)) {
    if (type !== "input") {
      return {
        isValid: false,
        message: "پایه‌های ۳۴، ۳۵، ۳۶ و ۳۹ فقط ورودی هستند و نمی‌توانند خروجی باشند.",
      };
    } else {
      return {
        isValid: true,
        message: "توجه: این پایه مقاومت Pull-Up داخلی ندارد. باید مقاومت خارجی (حداقل 10k) متصل کنید.",
        isWarning: true,
      };
    }
  }

  return { isValid: true, message: "" };
};
