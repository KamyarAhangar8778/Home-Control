import { getMqttClient, getMqttSettings } from "./client";
import { initMqtt } from "./init";

export const publishAddSegmentCommand = (id: string, type: string, pin: number, value: boolean) => {
  let client = getMqttClient();
  if (!client) { initMqtt(); client = getMqttClient(); }
  if (client?.connected) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    
    const idBytes = new TextEncoder().encode(id);
    const typeBytes = new TextEncoder().encode(type);
    
    const buf = new Uint8Array(3 + idBytes.length + 1 + typeBytes.length + 1);
    buf[0] = 0x02;
    buf[1] = pin;
    buf[2] = value ? 0x01 : 0x00;
    
    let offset = 3;
    buf.set(idBytes, offset); offset += idBytes.length;
    buf[offset++] = 0;
    buf.set(typeBytes, offset); offset += typeBytes.length;
    buf[offset++] = 0;

    client.publish(commandTopic, buf as Buffer, { qos: settings.qos });
    console.log(`[MQTT Binary] Published add_segment: pin=${pin} id=${id}`);
  }
};

export const publishDeleteSegmentCommand = (id: string) => {
  let client = getMqttClient();
  if (!client) { initMqtt(); client = getMqttClient(); }
  if (client?.connected) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    
    const idBytes = new TextEncoder().encode(id);
    const buf = new Uint8Array(1 + idBytes.length + 1);
    buf[0] = 0x03;
    buf.set(idBytes, 1);
    buf[1 + idBytes.length] = 0;
    
    client.publish(commandTopic, buf as Buffer, { qos: settings.qos });
    console.log(`[MQTT Binary] Published delete_segment: id=${id}`);
  }
};

export const publishUpdateRuleCommand = (
  id: string, 
  highActions: Array<{ reqHold: number; targetPin: string; actionOn: boolean; actionType?: number; delay?: number; }> = [],
  lowActions: Array<{ reqHold: number; targetPin: string; actionOn: boolean; actionType?: number; delay?: number; }> = []
) => {
  let client = getMqttClient();
  if (!client) { initMqtt(); client = getMqttClient(); }
  if (client?.connected) {
    const settings = getMqttSettings();
    const commandTopic = `${settings.baseTopic}/Command`;
    const idBytes = new TextEncoder().encode(id);
    
    const bufSize = 1 + idBytes.length + 1 + 1 + (highActions.length * 11) + 1 + (lowActions.length * 11);
    const buf = new Uint8Array(bufSize);
    const view = new DataView(buf.buffer);
    
    buf[0] = 0x05;
    let offset = 1;
    buf.set(idBytes, offset); offset += idBytes.length;
    buf[offset++] = 0;
    
    buf[offset++] = highActions.length;
    highActions.forEach(a => {
        buf[offset++] = parseInt(a.targetPin || "-1", 10) & 0xFF;
        view.setInt32(offset, a.reqHold || 0, true); offset += 4;
        buf[offset++] = a.actionOn ? 1 : 0;
        buf[offset++] = a.actionType || 0;
        view.setInt32(offset, a.delay || 0, true); offset += 4;
    });
    
    buf[offset++] = lowActions.length;
    lowActions.forEach(a => {
        buf[offset++] = parseInt(a.targetPin || "-1", 10) & 0xFF;
        view.setInt32(offset, a.reqHold || 0, true); offset += 4;
        buf[offset++] = a.actionOn ? 1 : 0;
        buf[offset++] = a.actionType || 0;
        view.setInt32(offset, a.delay || 0, true); offset += 4;
    });

    client.publish(commandTopic, buf as Buffer, { qos: settings.qos });
    console.log(`[MQTT Binary] Published update_rule: id=${id} size=${bufSize}b`);
  }
};
