import { getMqttClient, getMqttSettings } from "./client";
import { initMqtt } from "./init";

export const publishPinCommand = (pinId: string, value: boolean, timer?: number) => {
  let client = getMqttClient();
  if (!client) {
    initMqtt();
    client = getMqttClient();
  }

  if (client?.connected) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    
    const buf = new Uint8Array(7);
    const view = new DataView(buf.buffer);
    buf[0] = 0x01;
    buf[1] = parseInt(pinId, 10) || 0;
    buf[2] = value ? 0x01 : 0x00;
    view.setInt32(3, timer !== undefined ? timer : -1, true);
    
    client.publish(commandTopic, buf as Buffer, { qos: settings.qos });
    console.log(`[MQTT Binary] Published toggle command: pin=${buf[1]} state=${value} timer=${timer}`);
  } else {
    console.warn("[MQTT] Client not connected. Cannot publish.");
  }
};

export const publishBatchPinCommand = (actions: Array<{ pin: string; state: boolean; timer?: number }>) => {
  let client = getMqttClient();
  if (!client) {
    initMqtt();
    client = getMqttClient();
  }

  if (client?.connected && actions.length > 0) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    
    const buf = new Uint8Array(2 + actions.length * 6);
    const view = new DataView(buf.buffer);
    buf[0] = 0x08;
    buf[1] = Math.min(actions.length, 255);
    
    let offset = 2;
    for (let i = 0; i < buf[1]; i++) {
      const action = actions[i];
      buf[offset] = parseInt(action.pin, 10) || 0;
      buf[offset + 1] = action.state ? 0x01 : 0x00;
      view.setInt32(offset + 2, action.timer !== undefined ? action.timer : -1, true);
      offset += 6;
    }
    
    client.publish(commandTopic, buf as Buffer, { qos: settings.qos });
    console.log(`[MQTT Binary] Published batch toggle command with ${buf[1]} actions`);
  } else if (!client?.connected) {
    console.warn("[MQTT] Client not connected. Cannot publish batch.");
  }
};
