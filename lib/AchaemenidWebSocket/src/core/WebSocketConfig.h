#pragma once

#include <Optimization/StaticString.h>
#include <Arduino.h>

namespace uniuno {

// Cloudflare Workers close idle connections after ~100s.
// Send a ping every 45s to keep the connection alive.
static constexpr unsigned long WS_PING_INTERVAL_MS     = 45000UL;
static constexpr unsigned long WS_RETRY_DELAY_MS       = 5000UL;
static constexpr unsigned long WS_NO_NETWORK_DELAY_MS  = 1000UL;

// FreeRTOS task parameters
static constexpr uint32_t WS_CONNECT_TASK_STACK   = 8192;
static constexpr UBaseType_t WS_CONNECT_TASK_PRIO = 1;
static constexpr BaseType_t  WS_CONNECT_TASK_CORE = 0; // Core 0 — away from Arduino loop

/**
 * @brief WebSocket Configuration container using stack/bss-friendly StaticString.
 */
struct WebSocketConfig {
    uniuno::StaticString<128> serverUrl;
    
    bool isValid() const {
        return !serverUrl.empty();
    }
};

} // namespace uniuno
