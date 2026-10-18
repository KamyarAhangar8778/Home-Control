==========================================
  Achaemenid IoT Node - Modular Async
==========================================
[INFO]::[ESP-CODE-S/src/main.cpp:32]:[System] Hardware timer started at 1ms resolution.
[INFO]::[ESP-CODE-S/src/setup/NetworkStorage.cpp:103]:[NetworkStorage] [DEBUG] Stored MQTT Config - Host: 'broker.emqx.io', Port: 1883, Topic: 'KamyarIoT/Achaemenid', 
QOS: 0
[INFO]::[ESP-CODE-S/src/setup/NetworkStorage.cpp:110]:[NetworkStorage] Loaded 0 WiFi networks and MQTT config from NVS
[INFO]::[ESP-CODE-S/src/main.cpp:68]:[System] Restored MQTT settings from NVS (Host: broker.emqx.io)
[INFO]::[ESP-CODE-S/src/main.cpp:71]:[System] Setup completed. Starting Async Boot Sequence...
[INFO]::[ESP-CODE-S/lib/AchaemenidBootManager/src/BootManager.cpp:50]:[Boot] Booting up... Loading config from NVS immediately.
[SegStorage] Loaded 5 segments from NVS (offline fallback)
[INFO]::[ESP-CODE-S/lib/PinManager/src/Core/PinManager_Setup.cpp:48]:[PinManager] Added segment 'iszmn6e' on pin 2 (Type: output)
[INFO]::[ESP-CODE-S/lib/PinManager/src/state/PinManager_State.cpp:23]:[PinManager] 'iszmn6e' (pin 2) -> OFF
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:29]:[ConfigApplier] Pin 2 registered (id=iszmn6e, value=0)
[INFO]::[ESP-CODE-S/lib/PinManager/src/Core/PinManager_Setup.cpp:48]:[PinManager] Added segment 'ocpa1hl' on pin 14 (Type: output)
[INFO]::[ESP-CODE-S/lib/PinManager/src/state/PinManager_State.cpp:23]:[PinManager] 'ocpa1hl' (pin 14) -> OFF
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:29]:[ConfigApplier] Pin 14 registered (id=ocpa1hl, value=0)
[INFO]::[ESP-CODE-S/lib/PinManager/src/Core/PinManager_Setup.cpp:48]:[PinManager] Added segment '7xhkvz2' on pin 4 (Type: output)
[INFO]::[ESP-CODE-S/lib/PinManager/src/state/PinManager_State.cpp:23]:[PinManager] '7xhkvz2' (pin 4) -> OFF
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:29]:[ConfigApplier] Pin 4 registered (id=7xhkvz2, value=0)
[INFO]::[ESP-CODE-S/lib/PinManager/src/Core/PinManager_Setup.cpp:48]:[PinManager] Added segment '48ef3dw' on pin 5 (Type: input)
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:29]:[ConfigApplier] Pin 5 registered (id=48ef3dw, value=0)
[INFO]::[ESP-CODE-S/lib/PinManager/src/Core/PinManager_Setup.cpp:48]:[PinManager] Added segment 'y0stih7' on pin 19 (Type: input)
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:29]:[ConfigApplier] Pin 19 registered (id=y0stih7, value=0)
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:35]:[ConfigApplier] Applied 5 GPIO segments.
========= Pin Manager Status =========
  Active pins: 5 / 16
  [0] id=iszmn6e  type=output pin=2  state=OFF  autoOff=0s
  [1] id=ocpa1hl  type=output pin=14  state=OFF  autoOff=0s
  [2] id=7xhkvz2  type=output pin=4  state=OFF  autoOff=0s
  [3] id=48ef3dw  type=input pin=5  state=ON  autoOff=0s
  [4] id=y0stih7  type=input pin=19  state=ON  autoOff=0s
======================================
==========================================
  Instant Boot — Config loaded from NVS   
==========================================
[INFO]::[ESP-CODE-S/src/Events/EventHandlers.cpp:118]:[Event] Config loaded with 5 pins.
[INFO]::[ESP-CODE-S/src/setup/NetworkStorage.cpp:66]:[NetworkStorage] Network configuration saved to NVS (Preferences)
[INFO]::[ESP-CODE-S/src/Events/EventHandlers.cpp:130]:[MQTT] Using MQTT settings already restored by main.cpp
[INFO]::[ESP-CODE-S/lib/AchaemenidBootManager/src/BootManager.cpp:70]:[BootManager] Starting WiFi connection (using configured APs)...
[INFO]::[ESP-CODE-S/lib/AchaemenidNetwork/AchaemenidNetwork.cpp:20]:[AchaemenidNetwork] Async connection to added SSIDs...
[INFO]::[ESP-CODE-S/lib/AchaemenidNetwork/AchaemenidNetwork.cpp:26]:[AchaemenidNetwork] Successfully connected to WiFi! Network: DLink., IP: 192.168.1.9
[INFO]::[ESP-CODE-S/lib/AchaemenidBootManager/src/BootManager.cpp:20]:[Boot] WiFi Connected. Boot Tasks Complete.
[LocalWS] Server started on port 81
[WebSocket] [Task] Connecting to Cloudflare Worker (SSL handshake)...
[MQTT] Connecting to broker.emqx.io...
[MQTT] Connected to MQTT broker!
[MQTT] Subscribed to topic: KamyarIoT/Achaemenid/Command
[WebSocket] Connection Closed
[WebSocket] [Task] Connection failed. Will retry in loop().
[WebSocket] [Task] Connecting to Cloudflare Worker (SSL handshake)...
[ 10111][E][ssl_client.cpp:37] _handle_error(): [send_ssl_data():382]: (-69) UNKNOWN ERROR CODE (0045)
[WebSocket] Connection Closed
[WebSocket] [Task] Connection failed. Will retry in loop().
[WebSocket] [Task] Connecting to Cloudflare Worker (SSL handshake)...
[WebSocket] Connection Closed
[WebSocket] [Task] Connection failed. Will retry in loop().
[WebSocket] [Task] Connecting to Cloudflare Worker (SSL handshake)...
[ 15485][E][ssl_client.cpp:37] _handle_error(): [send_ssl_data():382]: (-78) UNKNOWN ERROR CODE (004E)
[WebSocket] Connection Closed
[WebSocket] [Task] Connection failed. Will retry in loop().
[WebSocket] [Task] Connecting to Cloudflare Worker (SSL handshake)...