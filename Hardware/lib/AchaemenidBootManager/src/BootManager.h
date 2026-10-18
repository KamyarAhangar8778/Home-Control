#ifndef BOOT_MANAGER_H
#define BOOT_MANAGER_H

#include <INetworkManager.h>
#include <PinManager.h>
#include <Timer/Timer.h>
#include <Events/EventDispatcher.h>
#include <Core/Async/Executor.h>
#include <Optimization/StaticFunction.h>
#include <Optimization/CompilerTraits.h>
#include "ISegmentStorage.h"

struct BootContext {
    uniuno::INetworkManager* network;
    PinManager* pinManager;
    uniuno::Executor* executor;
    uniuno::EventDispatcher* eventBus;
    uniuno::Timer* appTimer;
    uniuno::ISegmentStorage* segmentStorage;
    bool* configLoadedFlag;
    String* rawConfigPayload;
};

enum class BootState : uint8_t {
    CONNECT_WIFI = 0,
    DONE = 1
};

class BootManager {
private:
    BootContext ctx_;
    BootState state_;
    uniuno::Future<void, void> wifiFut_;
    unsigned long fetchConfigStartTime_;

    uniuno::AsyncResult<void> bootPollFn();
    void bootErrorFn(uniuno::Error e);
    static void restartFn();

public:
    BootManager();
    void startBootSequenceAsync(BootContext ctx);
};

#endif // BOOT_MANAGER_H
