#pragma once

#ifdef ESP32

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiAdapter.h>
#include <Optimization/SmallVector.h>
#include <Optimization/CompilerTraits.h>

namespace uniuno {

struct WiFiCredential {
  const char* ssid;
  const char* pass;
};

class ESP32WiFiAdapter : public WiFiAdapter {
public:
  ESP32WiFiAdapter() {}

  FORCE_INLINE bool mode(WiFiMode_t m) override { 
    bool result = WiFi.mode(m); 
    WiFi.setSleep(false); // <--- ZERO LATENCY WIFI
    return result;
  }

  FORCE_INLINE WiFiMode_t get_mode() override { 
    return WiFi.getMode(); 
  }

  bool add_access_point(const char *ssid, const char *passphrase) override {
    if (!credentials.full()) {
      credentials.push_back({ssid, passphrase});
      wifiMulti.addAP(ssid, passphrase);
      return true;
    }
    return false;
  }

  FORCE_INLINE wl_status_t status() override { 
    return WiFi.status(); 
  }

  wl_status_t run(uint32_t connectTimeoutMs = 5000) override {
    if (status() == WL_CONNECTED) {
      return WL_CONNECTED;
    }

    if (credentials.empty()) {
      return WL_CONNECT_FAILED;
    }

    // WiFiMulti.run() will scan and connect to the strongest AP concurrently
    uint32_t start_time = millis();
    while (millis() - start_time < connectTimeoutMs) {
      if (wifiMulti.run() == WL_CONNECTED) {
        return WL_CONNECTED;
      }
      delay(10);
    }

    return WL_CONNECT_FAILED;
  }

  FORCE_INLINE bool disconnect(bool wifioff = false) override {
    return WiFi.disconnect(wifioff);
  }

private:
  SmallVector<WiFiCredential, 3> credentials;
  WiFiMulti wifiMulti;
};

} // namespace uniuno

#endif
