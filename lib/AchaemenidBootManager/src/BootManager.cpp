#include "BootManager.h"
#include <Utilities/logging.h>
#include <ConfigApplier.h>
#include <AppEvents.h>
#include <AchaemenidWebSocketClient.h>

BootManager::BootManager() 
    : state_(BootState::CONNECT_WIFI),
      wifiFut_(uniuno::Future<void, void>::resolve()),
      fetchConfigStartTime_(0) 
{}

uniuno::AsyncResult<void> BootManager::bootPollFn() {
    if (state_ == BootState::CONNECT_WIFI) {
        auto res = wifiFut_.poll();
        if (UNLIKELY(res.is_rejected())) return uniuno::AsyncResult<void>::reject(*res.get_error());
        if (LIKELY(res.is_resolved())) {
            INFO("[Boot] WiFi Connected. Boot Tasks Complete.");
            
            NetworkStatusEvent netEvt{true};
            ctx_.eventBus->dispatch(netEvt);

            state_ = BootState::DONE;
            return uniuno::AsyncResult<void>::resolve();
        }
    }
    return uniuno::AsyncResult<void>::pending();
}

void BootManager::restartFn() {
    ESP.restart();
}

void BootManager::bootErrorFn(uniuno::Error e) {
    ERRORF("[Boot] Critical Failure: %s. Restarting in 5s...", (const char*)e);
    if (ctx_.appTimer != nullptr) {
        ctx_.appTimer->setTimeout(uniuno::makeStaticFunction(&BootManager::restartFn), 5000);
    } else {
        delay(5000);
        ESP.restart();
    }
}

void BootManager::startBootSequenceAsync(BootContext ctx) {
    ctx_ = ctx;

    // بارگذاری بلافاصله تنظیمات از NVS هنگام شروع بوت (آفلاین بوت کاملاً ایزوله از شبکه)
    INFO("[Boot] Booting up... Loading config from NVS immediately.");
    ParseResult nvsResult = {}; // Zero-initialize to avoid garbage memory
    if (ctx_.segmentStorage != nullptr && ctx_.segmentStorage->loadSegmentConfig(nvsResult)) {
        int applied = ConfigApplier::apply(nvsResult, ctx_.pinManager);
        ctx_.pinManager->printStatus();
        *(ctx_.configLoadedFlag) = true;

        Serial.println("==========================================");
        Serial.println("  Instant Boot — Config loaded from NVS   ");
        Serial.println("==========================================");

        ConfigLoadedEvent evt;

        evt.pinCount = applied;
        ctx_.eventBus->dispatch(evt);
    } else {
        WARNING("[Boot] NVS empty or storage unavailable. No configuration loaded. Please push config.");
    }

    state_ = BootState::CONNECT_WIFI;
    INFO("[BootManager] Starting WiFi connection (using configured APs)...");
    wifiFut_ = ctx_.network->connectAsync();
    
    // We bind poll and error functions to this instance for executor
    auto bootFuture = uniuno::create_future([this]() { return this->bootPollFn(); });
    ctx_.executor->execute(bootFuture, [this](uniuno::Error e) { this->bootErrorFn(e); });
}
