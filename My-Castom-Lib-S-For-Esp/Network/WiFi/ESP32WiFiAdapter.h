#pragma once

#ifdef ESP32

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiAdapter.h>

namespace uniuno {

class ESP32WiFiAdapter : public WiFiAdapter {
public:
  ESP32WiFiAdapter() : wifi_multi() {}

  bool mode(WiFiMode_t m) override { 
    return WiFi.mode(m); 
  }

  WiFiMode_t get_mode() override { 
    return WiFi.getMode(); 
  }

  bool add_access_point(const char *ssid, const char *passphrase) override {
    return this->wifi_multi.addAP(ssid, passphrase);
  }

  wl_status_t status() override { 
    return WiFi.status(); 
  }

  wl_status_t run(uint32_t connectTimeoutMs = 5000) override {
    return this->wifi_multi.run(connectTimeoutMs);
  }

  bool disconnect(bool wifioff = false) override {
    return WiFi.disconnect(wifioff);
  }

private:
  WiFiMulti wifi_multi;
};

} // namespace uniuno

#endif
