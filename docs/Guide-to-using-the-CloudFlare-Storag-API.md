# راهنمای استفاده از API و نحوه کارکرد سیستم

این مستند برای راهنمایی توسعه‌دهندگان جهت اتصال سخت‌افزار (ESP32) و داشبورد به بک‌اند کلودفلر (Cloudflare Worker + Durable Objects + KV) تهیه شده است.

---

## ۱. معماری کلی سیستم (System Workflow)

در این پروژه، ذخیره‌سازی داده‌ها به دو دسته کلی تقسیم شده است:

1. **داده‌های پر تغییر (Durable Objects):** 
   - **وضعیت پین‌ها (ESP32):** وضعیت لحظه‌ای هر ماژول یا پین.
   - **وضعیت داشبورد:** تنظیمات لحظه‌ای و پر تغییر کاربر (مثل سوئیچ بین حالت شب و روز).
2. **داده‌های کم تغییر (Cloudflare KV):**
   - **تنظیمات اصلی پروژه:** یک فایل بزرگ JSON که تنظیمات و پیکربندی‌های کلی داشبورد (مثل فونت، هدر و استایل اصلی) را در سراسر دنیا با کمترین تاخیر سرویس می‌دهد.

---

## ۲. مشخصات نقاط دسترسی (API Endpoints)

آدرس پایه سرور شما: `https://my-iot-worker.YOUR_SUBDOMAIN.workers.dev`

### الف) تنظیمات اصلی داشبورد (Cloudflare KV)
این مسیر برای خواندن و نوشتن فایل اصلی پیکربندی داشبورد استفاده می‌شود.

*   **ذخیره تنظیمات (POST):**
    *   مسیر: `/config`
    *   هدرها: `Content-Type: application/json`
    *   بدنه درخواست: یک شیء JSON دلخواه شامل تنظیمات بزرگ.
    *   پاسخ: `{"success":true,"message":"Settings saved"}`
*   **خواندن تنظیمات (GET):**
    *   مسیر: `/config`
    *   پاسخ: فایل JSON تنظیماتی که قبلا ذخیره شده بود.
*   **خواندن تنظیمات فیلتر شده مخصوص سخت‌افزار (GET):**
    *   مسیر: `/config/esp`
    *   توضیحات: این مسیر محتوای فایل اصلی را می‌خواند اما برای سرعت بیشتر و صرفه‌جویی در حافظه سخت‌افزار ESP، فقط یک آرایه از فیلد‌های ضروری ماژول‌ها (`id`, `type`, `pin`) را در قالب JSON برمی‌گرداند.
    *   مثال پاسخ: `[{"id":"module_1","type":"gpio_toggle","pin":"2"}, ...]`

### ب) وضعیت‌های پر تغییر داشبورد (Durable Object)
این مسیر برای تنظیمات لحظه‌ای مانند حالت تاریک/روشن و مواردی که مدام تغییر می‌کنند طراحی شده است.

*   **ذخیره وضعیت (POST):**
    *   مسیر: `/dashboard`
    *   هدرها: `Content-Type: application/json`
    *   بدنه درخواست: `{"theme": "dark", "sidebar_open": true}`
    *   پاسخ: وضعیت ادغام شده جدید.
*   **خواندن وضعیت (GET):**
    *   مسیر: `/dashboard`
    *   پاسخ: تمام وضعیت‌های لحظه‌ای ذخیره شده برای داشبورد.

### پ) وضعیت پین‌های سخت‌افزاری (Durable Object)
هر پین به صورت کاملاً مستقل و ایزوله در یک نمونه Durable Object مدیریت می‌شود.

*   **تغییر وضعیت یک پین (POST):**
    *   مسیر: `/pins/{pin_id}` (مثال: `/pins/4`)
    *   هدرها: `Content-Type: application/json`
    *   بدنه درخواست: `{"value": true}`
    *   پاسخ: وضعیت جدید (مانند: `{"value": true}`)
*   **گرفتن وضعیت فعلی پین (GET):**
    *   مسیر: `/pins/{pin_id}`
    *   پاسخ: وضعیت فعلی آن پین.

---

## ۳. نحوه اتصال و کد نمونه برای ESP32 (Arduino C++)

برای ارتباط سخت‌افزار با این سیستم، می‌توانید از این توابع برای ارسال و دریافت وضعیت پین‌ها استفاده کنید:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "https://my-iot-worker.YOUR_SUBDOMAIN.workers.dev/pins/";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");

  // بازیابی وضعیت پین شماره ۴ از سرور هنگام بوت شدن
  bool pinState = recoverPinState(4);
  pinMode(4, OUTPUT);
  digitalWrite(4, pinState ? HIGH : LOW);
}

void loop() {
  // کدهای لاجیک برنامه شما...
}

// تابع بازیابی وضعیت پین (GET)
bool recoverPinState(int pinId) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(serverUrl) + String(pinId));
    int responseCode = http.GET();
    
    if (responseCode == 200) {
      String payload = http.getString();
      StaticJsonDocument<256> doc;
      deserializeJson(doc, payload);
      if (doc.containsKey("value")) {
        return doc["value"].as<bool>();
      }
    }
    http.end();
  }
  return false;
}

// تابع به‌روزرسانی وضعیت پین (POST)
bool updatePinStateOnServer(int pinId, bool value) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(serverUrl) + String(pinId));
    http.addHeader("Content-Type", "application/json");
    
    String requestBody = "{\"value\":" + String(value ? "true" : "false") + "}";
    int responseCode = http.POST(requestBody);
    http.end();
    
    return responseCode == 200;
  }
  return false;
}
```

---

## ۴. توسعه و گسترش

- **انعطاف‌پذیری وضعیت داشبورد:** مسیر `/dashboard` هیچ محدودیتی روی کلیدهای JSON اعمال نمی‌کند. شما می‌توانید هر متغیری (مانند نام کاربری موقت، وضعیت منوها و ...) را در آن با یک درخواست `POST` اضافه کنید تا با داده‌های قبلی ادغام (Merge) شود.
- **تغییرات کلی قالب:** همیشه تغییرات سنگین پیکربندی را به مسیر `/config` بفرستید تا با سرعت و در مقیاس جهانی پردازش و توزیع شود.
