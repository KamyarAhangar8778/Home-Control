import { getMqttClient, getMqttSettings } from "./client";

export const publishPresence = (isVisible: boolean) => {
  const client = getMqttClient();
  if (!client || !client.connected) return;
  const settings = getMqttSettings();
  const commandTopic = `${settings.baseTopic}/Command`;
  const presenceBuf = new Uint8Array([0x04, isVisible ? 0x01 : 0x00]);
  client.publish(commandTopic, presenceBuf as Buffer, { qos: settings.qos });
  console.log(`[MQTT] Published presence: ${isVisible}`);
};
