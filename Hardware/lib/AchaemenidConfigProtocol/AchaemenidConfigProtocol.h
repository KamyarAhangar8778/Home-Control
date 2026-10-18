#ifndef ACHAEMENID_CONFIG_PROTOCOL_H
#define ACHAEMENID_CONFIG_PROTOCOL_H

#include "IConfigParser.h"

namespace uniuno {

/**
 * @class AchaemenidConfigProtocol
 * @brief پروتکل متنی مقاوم (Robust Key-Value Protocol) برای تبادل تنظیمات بین سرور و سخت‌افزار
 */
class AchaemenidConfigProtocol : public IConfigParser {
public:
    // تجزیه رشته متنی Key=Value دریافتی از /config/esp به صورت Zero-Allocation
    bool parse(const char* payload, ParseResult& outResult) override;

    // چاپ نتیجه تحلیل در سریال (برای دیباگ)
    void printResult(const ParseResult* result);

private:
    // تبدیل رشته پین به عدد صحیح
    int parsePinNumber(const char* pinStr);
};

} // namespace uniuno

#endif // ACHAEMENID_CONFIG_PROTOCOL_H
