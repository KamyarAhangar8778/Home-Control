#pragma once

#ifdef ESP8266

#include <ESP8266WiFi.h>
#include <WiFiAdapter.h>
#include <Optimization/SmallVector.h>
#include <Optimization/CompilerTraits.h>

namespace uniuno {

struct WiFiCredential {
  const char* ssid;
  const char* pass;
};

class ESP8266WiFiAdapter : public WiFiAdapter {
public:
  ESP8266WiFiAdapter() {}

  FORCE_INLINE bool mode(WiFiMode_t m) override { return WiFi.mode(m); }

  FORCE_INLINE WiFiMode_t get_mode() override { return WiFi.getMode(); }

  bool add_access_point(const char *ssid, const char *passphrase) override {
    if (!credentials.full()) {
      credentials.push_back({ssid, passphrase});
      return true;
    }
    return false;
  }

  FORCE_INLINE wl_status_t status() override { return WiFi.status(); }

  wl_status_t run(uint32_t connectTimeoutMs = 5000) override {
    if (status() == WL_CONNECTED) {
      return WL_CONNECTED;
    }

    if (credentials.empty()) {
      return WL_CONNECT_FAILED;
    }

    for (const auto& cred : credentials) {
      WiFi.begin(cred.ssid, cred.pass);
      
      uint32_t start_time = millis();
      while (millis() - start_time < connectTimeoutMs) {
        if (LIKELY(status() == WL_CONNECTED)) {
          return WL_CONNECTED;
        }
        delay(10);
      }
    }

    return WL_CONNECT_FAILED;
  }

  FORCE_INLINE bool disconnect(bool wifioff = false) override {
    return WiFi.disconnect(wifioff);
  }

private:
  SmallVector<WiFiCredential, 3> credentials;
};

} // namespace uniuno

#endif