# مستندات پروتکل ارتباطی وب‌ساکت (WebSocket) بین داشبورد هخامنشی و ESP32

این سند حاوی تشریح کامل ساختار پیام‌ها، قالب فراخوانی‌ها، نمونه‌های عملی و کدهای لازم برای پیاده‌سازی پایداری ارتباط دوطرفه و بلادرنگ (Real-time) بین داشبورد مدیریتی هخامنشی و میکروکنترلر ESP32 با استفاده از پروتکل وب‌ساکت (WebSocket) است.

---

## ۱. چرا وب‌ساکت؟ (WebSocket vs HTTP)
در سناریوهای مرسوم کنترل سخت‌افزار (Internet of Things)، استفاده از پروتکل HTTP به صورت Polling (درخواست‌های دوره‌ای مداوم) مشکلات زیر را به همراه دارد:
- **تاخیر ملموس (Latency):** برای خاموش یا روشن کردن یک رله، کاربر ناچار به صبر تا درخواست بعدی ESP32 است.
- **سربار پهنای باند (Overhead):** هر هدر HTTP بخش چشمگیری از ترافیک شبکه را اشغال می‌کند.
- **عدم امکان ارسال از سمت سرور (Push Notifications):** سرور نمی‌تواند به طور مستقیم به ESP32 دستور بدهد، مگر اینکه ارتباط از پیش متصل و باز (Full-Duplex) باشد.

پروتکل **WebSocket** با ایجاد یک کانال دائم و پایدار روی پروتکل TCP روی پورت ۳۰۰۰، ارتباط دوطرفه بسیار سریع (زیر میلی‌ثانیه) را برای سیستم به ارمغان می‌آورد؛ بدین معنا که به محض کلیک کاربر روی داشبورد، پایه مربوطه روی هاردویر تغییر وضعیت می‌دهد.

---

## ۲. قالب کلی پیام‌ها (General Message Format)
تمامی ارتباطات روی وب‌ساکت با فرمت استاندارد **JSON** مبادله می‌شوند تا فرآیند سریال‌سازی (Serialization) در فرانت‌اند و پارس (Parsing) آن روی میکروکنترلر به ساده‌ترین شکل ممکن صورت گیرد.

هر بسته داده ارسال شونده دارای یک فیلد پایه به نام `event` (رویداد) و یک فیلد داده فرعی به نام `payload` (بار مفید داده) است. این امر سبب تفکیک رویدادها از یکدیگر در توابع دریافت پیام می‌گردد.

```json
{
  "event": "نام_رویداد",
  "payload": {
    "جزئیات_مربوط_به_رویداد": "مقدار"
  }
}
```

---

## ۳. تشریح پروتکل تغییر وضعیت پایه‌ها (GPIO control)
یکی از نیازهای اصلی سیستم، تغییر وضعیت پایه‌های سخت‌افزاری (روشن و خاموش کردن رله، چراغ تالار آپادانا، پمپ آب باغ پردیس و ...) است.

### سناریو: باز کردن یا بستن دروازه ملل (پایه شماره ۴) یا پمپ آب (پایه شماره ۱۲)

#### الف) پیام ارسالی از داشبورد به ESP32 جهت تغییر حالت پایه (Command Event)
زمانی که کاربر روی سوییچ مربوطه در فرانت کلیک می‌کند، داشبورد پیام زیر را ارسال می‌کند:

```json
{
  "event": "pin_control",
  "payload": {
    "pin": "4",
    "state": true,
    "timestamp": "2026-06-07T07:42:00Z"
  }
}
```

**توضیحات فیلدها:**
- `event`: همیشه برابر با `"pin_control"` قرار می‌گیرد تا سخت‌افزار بداند باید یک پایه خروجی را کنترل کند.
- `payload.pin`: شماره پایه به صورت رشته متنی (مثلاً `"4"` یا `"12"`) که مطابق با پایه‌های فیزیکی میکروکنترلر است.
- `payload.state`: یک متغیر باینری (`true` برای روشن/HIGH و `false` برای خاموش/LOW).
- `payload.timestamp`: زمان وقوع رویداد بر مبنای استاندارد ISO 8601 (جهت رفع تداخل‌های تاخیر شبکه).

---

#### ب) پیام ارسالی از ESP32 به داشبورد پس از اجرای دستور (Acknowledge Event)
سخت‌افزار پس از دریافت دستور و اعمال آن روی پایه فیزیکی، جهت تایید موفقیت‌آمیز بودن فرآیند، فیدبک زیر را به داشبورد ارسال می‌کند تا وضعیت نمایشگر سوییچ روی وب بروزرسانی شود:

```json
{
  "event": "pin_status",
  "payload": {
    "pin": "4",
    "state": true,
    "success": true,
    "current_current_ma": 142.5
  }
}
```

**چرا ارسال تاییدیه (ACK) مهم است؟**
اگر سخت‌افزار به دلیلی اتصالش قطع باشد یا پایه آسیب دیده باشد، سوییچ نرم‌افزاری نباید تغییر وضعیت موهوم نشان دهد. پیاده‌سازی مکانیزم تاییدیه به اصل طراحی **Server as Source of Truth** هویت می‌بخشد.

---

### ج) پیام‌های تغییر آنالوگ / شدت نور دیمر (PWM Brightness Control)
به منظور به کارگیری مدولاسیون عرض پالس (PWM) جهت کنترل دیمرهایی نظیر تالار آپادانا (پایه شماره ۲ یا ۴):

**داشبورد به ESP32:**
```json
{
  "event": "pwm_control",
  "payload": {
    "pin": "2",
    "value": 185
  }
}
```
*مقدار `value` عددی بین `0` تا `255` (کنترل ۸ بیتی معمولی در سیستم آردوینو) را شامل می‌شود.*

---

## ۴. ارسال تلمتری سنسورها از ESP32 به داشبورد (Telemetry Event)
ESP32 هر ۵ الی ۱۰ ثانیه یک‌بار (یا به محض تغییر ناگهانی ارزش سنسورها)، مجموع اطلاعات فیزیکی را تحت عنوان رویداد تلمتری مخابره می‌کند:

```json
{
  "event": "telemetry",
  "payload": {
    "sensors": {
      "atarTemp": 25.8,
      "anahitaMoisture": 48.0,
      "vayuAirQuality": 105.0,
      "mithraLight": 612.0
    },
    "uptime_seconds": 1284,
    "rssi": -64
  }
}
```

**توضیحات فیلدهای سنسورهای هخامنشی:**
- `atarTemp`: دمای محیطی ثبت شده توسط "سنسور آذرخش".
- `anahitaMoisture`: میزان رطوبت خاک ثبت شده توسط "سنجش آناهیتا".
- `vayuAirQuality`: میزان پاکیزگی یا ذرات معلق ثبت شده توسط گره هواشناسی "وایو".
- `mithraLight`: خروجی سنسور نوری خورشیدی "مهر".
- `uptime_seconds`: زمان کل روشن بودن میکروکنترلر به ثانیه.
- `rssi`: قدرت سیگنال وای‌فای (برای بررسی کیفیت سیگنال فیزیکی شبکه).

---

## ۵. رویداد ضربان قلب (Heartbeat / Keep-Alive)
برای ردگیری اینکه آیا میکروکنترلر آنلاین است (یا اتصال آن به علت نوسان برق قطع شده)، پروتکل پینگ-پونگ زیر بصورت مداوم (مثلاً هر ۳۰ ثانیه) تکرار می‌شود:

**ESP32 به داشبورد:**
```json
{
  "event": "ping",
  "payload": {
    "device_id": "pasargad_node_01"
  }
}
```

**پاسخ فوری داشبورد به ESP32:**
```json
{
  "event": "pong",
  "payload": {
    "server_time": "2026-06-07T07:42:20Z"
  }
}
```

---

## ۶. کد مرجع کامل برای پیاده‌سازی روی ESP32 (Arduino C++)
شما می‌توانید قطعه کد زیر را تحویل سیستم هوش مصنوعی دیگری که وظیفه برنامه‌نویسی سخت‌افزار را دارد دهید تا آن را شخصی‌سازی و بر روی برد توسعه ESP32 کامپایل و پروگرم نماید:

```cpp
/*
 *  ========================================================================
 *  Achaemenid Smart System (سامانه هوشمند مرزی پاسارگاد - پادشاهی هخامنشی)
 *  WebSocket Client Engine v2.0 - Optimized with ArduinoJson & WebSocketsClient
 *  ========================================================================
 *  
 *  کتابخانه‌های مورد نیاز:
 *  - ArduinoJson (by Benoit Blanchon) -> برای پارس و سریالایز JSON
 *  - WebSockets (by Markus Sattler) -> برای برقراری ارتباط وب‌ساکت دائم
 */

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

// پیکربندی اتصالات وای‌فای شبکه‌
const char* ssid     = "Kouroush_Great_AP";
const char* password = "AchaemenidEmpireSecureKey";

// مشخصات سرور وب‌ساکت داشبورد مرکزی هخامنشی
const char* ws_host = "your-dashboard-deployment.run.app"; // آدرس سرور اصلی بدون http
const int ws_port   = 80; // در حالت HTTPS معمولاً 443 یا پورت معین شما
const char* ws_path = "/api/iot/ws"; // اندپوینت سوکت در گیت‌وی پروژه

WebSocketsClient webSocket;
unsigned long lastTelemetryTime = 0;
const unsigned long telemetryInterval = 5000; // ارسال گزارش سنسورها هر ۵ ثانیه

// پین‌های فیزیکی بکار گرفته شده در سامانه پاسارگاد
const int PIN_LED_APADANA = 2;  // ال‌دی روشنایی تالار
const int PIN_RELAY_GATE   = 4;  // رله تحریک قفل اهرم دروازه ملل
const int PIN_PUMP_GARDEN  = 12; // پمپ حوضچه پردیس شاهی

// توابع شبیه‌ساز یا خواننده سنسورهای واقعی
float readAtarTemperature() { return 24.5 + (random(-10, 10) / 10.0); }
int readAnahitaWater()      { return 40 + random(-2, 5); }
int readVayuAirQuality()    { return 100 + random(-5, 10); }
int readMithraLight()       { return 650 + random(-30, 30); }

// تابع هندر رویداد پیام‌های وب‌ساکت واصل شده از داشبورد
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("[WebSocket] اتصال با پایگاه مرکزی قطع گردید.");
      break;
      
    case WStype_CONNECTED:
      Serial.print("[WebSocket] ارتباط با دروازه هخامنشی برقرار شد به آدرس: ");
      Serial.println(ws_path);
      // ارسال یک اعلان شناسایی به محض متصل شدن
      sendDeviceHello();
      break;
      
    case WStype_TEXT:
      Serial.printf("[WebSocket] دریافت پیام خام: %s\n", payload);
      handleIncomingMessage(payload, length);
      break;
      
    case WStype_BIN:
      // در این پروتکل داده‌های باینری بکار گرفته نمی‌شوند.
      break;
      
    case WStype_ERROR:
      Serial.println("[WebSocket] رخداد خطا در لایه سوکت.");
      break;
  }
}

// سلام دستگاه به سرور (Handshake payload)
void sendDeviceHello() {
  JsonDocument doc;
  doc["event"] = "device_ready";
  JsonObject data = doc.createNestedObject("payload");
  data["device_id"] = "pasargad_node_01";
  data["chipset"] = "ESP32-S3";
  data["firmware"] = "Achaemenid-OS v2.0";
  
  String output;
  serializeJson(doc, output);
  webSocket.sendTXT(output);
}

// تابع اختصاصی جهت پردازش پیام‌های دریافتی از وب‌ساکت داشبورد
void handleIncomingMessage(uint8_t * payload, size_t length) {
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  
  if (error) {
    Serial.print("خطا در فهم ساختار داده جی‌سون: ");
    Serial.println(error.c_str());
    return;
  }
  
  const char* eventName = doc["event"];
  if (!eventName) return;
  
  // ۱. بررسی رویداد کنترل پایه (GPIO Pin Control)
  if (strcmp(eventName, "pin_control") == 0) {
    JsonObject data = doc["payload"];
    const char* pinStr = data["pin"];
    bool state = data["state"];
    
    int targetPin = atoi(pinStr);
    
    // اعمال وضعیت به صورت سخت‌افزاری
    if (targetPin == PIN_LED_APADANA || targetPin == PIN_RELAY_GATE || targetPin == PIN_PUMP_GARDEN) {
      pinMode(targetPin, OUTPUT);
      digitalWrite(targetPin, state ? HIGH : LOW);
      Serial.printf("[Action] پایه %d با موفقیت به حالت %s تغییر یافت.\n", targetPin, state ? "روشن" : "خاموش");
      
      // ارسال تاییدیه بازگشت به فرانت‌اند
      sendPinAcknowledge(targetPin, state);
    } else {
      Serial.printf("[Warn] تلاش برای کنترل پایه غیرمجاز: %d\n", targetPin);
    }
  }
}

// ارسال تاییدیه اجرای فرامین کنترل پایه‌ها به فرانت‌اند
void sendPinAcknowledge(int pin, bool state) {
  JsonDocument doc;
  doc["event"] = "pin_status";
  JsonObject payload = doc.createNestedObject("payload");
  payload["pin"] = String(pin);
  payload["state"] = state;
  payload["success"] = true;
  
  String output;
  serializeJson(doc, output);
  webSocket.sendTXT(output);
  Serial.println("[Feedback] پیغام تایید فرستاده شد.");
}

// ارسال داده‌های جمع‌آوری شده سنسورهای چهارگانه (تلمتری) به سرور
void sendSensorTelemetry() {
  JsonDocument doc;
  doc["event"] = "telemetry";
  
  JsonObject payload = doc.createNestedObject("payload");
  JsonObject sensors = payload.createNestedObject("sensors");
  
  sensors["atarTemp"] = readAtarTemperature();
  sensors["anahitaMoisture"] = readAnahitaWater();
  sensors["vayuAirQuality"] = readVayuAirQuality();
  sensors["mithraLight"] = readMithraLight();
  
  payload["uptime_seconds"] = millis() / 1000;
  
  String output;
  serializeJson(doc, output);
  webSocket.sendTXT(output);
  Serial.println("[Telemetry] اطلاعات سنسورهای هخامنشی مخابره شد.");
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // تعریف جهت پایه‌ها برای ابزارهای کنترلی
  pinMode(PIN_LED_APADANA, OUTPUT);
  pinMode(PIN_RELAY_GATE, OUTPUT);
  pinMode(PIN_PUMP_GARDEN, OUTPUT);
  
  // پیش‌فرض خاموش سازی پایه‌ها در شروع مجدد
  digitalWrite(PIN_LED_APADANA, LOW);
  digitalWrite(PIN_RELAY_GATE, LOW);
  digitalWrite(PIN_PUMP_GARDEN, LOW);

  // اتصال و راه‌اندازی وای‌فای
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected! Royal Palace online.");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // تنظیم آدرس سرور و پورت وب‌ساکت و متد هندلر
  webSocket.begin(ws_host, ws_port, ws_path);
  webSocket.onEvent(webSocketEvent);
  
  // تلاش مجدد برای اتصال خودکار پس از قطع پیوند با سرور هخامنشی (هر ۵ ثانیه)
  webSocket.setReconnectInterval(5000);
}

void loop() {
  webSocket.loop();
  
  // ارسال دوره‌ای پارامترهای محیطی سنسورها
  if (millis() - lastTelemetryTime >= telemetryInterval) {
    lastTelemetryTime = millis();
    if (WiFi.status() == WL_CONNECTED) {
       sendSensorTelemetry();
    }
  }
}
```

---

## ۷. نکات توسعه اختصاصی برای توسعه‌دهنده سخت‌افزار
۱. **مدیریت قطع ناگهانی اتصال (Auto-Reconnection):** در کد بالا متد `webSocket.setReconnectInterval(5000)` مسئول تلاش مداوم و خودکار برای اتصال دوباره به درگاه شبکه در صورت افت کیفیت سیگنال است. این تنظیم نباید حذف شود تا گره مانیتورینگ مستحکم بماند.
۲. **حفاظت در برابر نوسانات نویز پایه‌ها (Hardware Bounce Protection):** برای رله‌ها بخصوص رله بکار گرفته شده روی پایه ۴ (دروازه ملل)، حواستان به بکارگیری خازن و مقاومت فیلتر کننده باشد تا جریان‌های برگشتی و تحریک سلفی موتورها سبب هنگ کردن میکروکنترلر شما به علت تداخل میدان الکترومغناطیسی نگردد.
۳. **ساختار JSON در پاتفرم‌های دارای سیستم عامل بلادرنگ (FreeRTOS):** پیشنهاد می‌شود فرآیند وب‌ساکت به همراه کتابخانه `ArduinoJson` را در یک تسک مجزا در FreeRTOS قرار دهید (مثلاً هسته شماره ۱ ESP32) و امورات حسگری و رله را بر روی هسته شماره ۰ پیاده‌سازی کنید تا بیشترین نرخ پاسخ‌دهی حاصل گردد.
