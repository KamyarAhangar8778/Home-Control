import mqtt from "mqtt";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { getMqttClient, setMqttClient, getMqttSettings, stateCallbacks } from "./client";

// Queue for batched state updates
const pendingStateUpdates = new Map<string, boolean>();
let updateRafId: number | null = null;

// ESP32 online/offline detection از طریق LWT
const markEspStatus = (isOnline: boolean) => {
  useIoTStore.getState().setIsLocal(isOnline);
  if (isOnline) {
    console.log("[MQTT] ESP32 is ONLINE.");
  } else {
    console.warn("[MQTT] ESP32 is OFFLINE (LWT triggered).");
  }
};

const flushStateUpdates = () => {
  updateRafId = null;
  if (pendingStateUpdates.size === 0) return;
  
  const updatesToProcess = new Map(pendingStateUpdates);
  pendingStateUpdates.clear();
  
  // Batch update zustand store
  useIoTStore.getState().setPinsState((prev) => {
    const next = { ...prev };
    updatesToProcess.forEach((state, pinId) => {
      next[pinId] = state;
    });
    return next;
  });

  stateCallbacks.forEach((cb) => {
    updatesToProcess.forEach((state, pinId) => {
      cb(pinId, state);
    });
  });
};

const queueStateUpdate = (pinId: string, state: boolean) => {
  pendingStateUpdates.set(pinId, state);
  if (!updateRafId && typeof window !== "undefined") {
    updateRafId = requestAnimationFrame(flushStateUpdates);
  }
};

export const initMqtt = () => {
  let client = getMqttClient();
  if (!client) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    const stateTopic = `${settings.baseTopic}/State`;
    const statusTopic = `${settings.baseTopic}/Status`;
    const qos = settings.qos;

    client = mqtt.connect(settings.brokerUrl, {
      clientId: "dashboard_" + Math.random().toString(16).substring(2, 10),
      reconnectPeriod: 5000,
    });
    setMqttClient(client);

    client.on("connect", () => {
      console.log(`[MQTT] Connected to ${settings.brokerUrl}!`);
      client?.subscribe(stateTopic);
      client?.subscribe(statusTopic);
      
      queueMicrotask(() => {
        const isPageVisible = useIoTStore.getState().isPageVisible;
        const presenceBuf = new Uint8Array([0x04, isPageVisible ? 0x01 : 0x00]);
        client?.publish(commandTopic, presenceBuf as Buffer, { qos });
        
        // Request full state from ESP32 RAM (Global SSOT)
        const syncBuf = new Uint8Array([0x09]);
        client?.publish(commandTopic, syncBuf as Buffer, { qos });
      });
    });

    client.on("message", (topic, payload) => {
      if (topic === statusTopic) {
        try {
          const strPayload = payload.toString().toLowerCase();
          if (strPayload === "offline") {
            markEspStatus(false);
          } else {
            const data = JSON.parse(strPayload);
            if (data.status === "online") {
              markEspStatus(true);
              if (data.ip && useIoTStore.getState().localIp !== data.ip) {
                useIoTStore.getState().setLocalIp(data.ip);
              }
            } else if (data.status === "offline") {
              markEspStatus(false);
            }
          }
        } catch (e) {
          // Fallback if not JSON (e.g. LWT is plain text "offline")
          if (payload.toString() === "offline") {
            markEspStatus(false);
          }
        }
      }
      else if (topic === stateTopic) {
        try {
          if (payload.length > 0) {
            const cmdType = payload[0];
            
            if (cmdType === 0x06 && payload.length >= 3) {
              const pinNum = payload[1];
              const state = payload[2] === 0x01;
              console.log(`[MQTT] Received state update from ESP32: pin=${pinNum} state=${state}`);
              queueStateUpdate(pinNum.toString(), state);
            }
            else if (payload[0] === 123) {
              const data = JSON.parse(payload.toString());
              if (data.type === "state_sync" && data.states) {
                // Full state sync from ESP32
                console.log(`[MQTT] Received full state sync from ESP32:`, data.states);
                useIoTStore.getState().setPinsState(data.states);
              } else if (data.command === "ping") {
                queueMicrotask(() => {
                  const isPageVisible = useIoTStore.getState().isPageVisible;
                  const presenceBuf = new Uint8Array([0x04, isPageVisible ? 0x01 : 0x00]);
                  client?.publish(commandTopic, presenceBuf as Buffer, { qos });
                });
              } else if (data.id !== undefined && data.value !== undefined) {
                console.log(`[MQTT] Received JSON state update from ESP32: pin=${data.id} state=${data.value}`);
                queueStateUpdate(data.id.toString(), data.value);
              }
            }
          }
        } catch (e) {
          console.error("Failed to parse MQTT state message", e);
        }
      }
    });

    client.on("error", (err) => {
      console.error("[MQTT] Connection error:", err);
    });
  }
};

export const reconnectMqtt = () => {
  const client = getMqttClient();
  if (client) {
    client.end(true);
    setMqttClient(null);
  }
  initMqtt();
};
