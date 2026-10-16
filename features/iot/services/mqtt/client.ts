import { MqttClient } from "mqtt";

export let client: MqttClient | null = null;

export type StateChangeCallback = (pinId: string, state: boolean) => void;
export const stateCallbacks: StateChangeCallback[] = [];

export const onMqttStateChange = (cb: StateChangeCallback) => {
  stateCallbacks.push(cb);
  return () => {
    const idx = stateCallbacks.indexOf(cb);
    if (idx > -1) stateCallbacks.splice(idx, 1);
  };
};

import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export const getMqttSettings = () => {
  const mqttConfig = useIoTStore.getState().mqttConfig;
  return {
    brokerUrl: mqttConfig?.broker_ws_url || "wss://broker.emqx.io:8084/mqtt",
    baseTopic: mqttConfig?.base_topic || "KamyarIoT/Achaemenid",
    qos: (mqttConfig?.qos ?? 1) as 0 | 1 | 2
  };
};

export const getMqttClient = () => client;
export const setMqttClient = (newClient: MqttClient | null) => {
  client = newClient;
};
