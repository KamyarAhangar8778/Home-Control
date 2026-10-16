import React, { useState, useEffect } from "react";
import { soundManager } from "@/lib/audio";
import { reconnectMqtt, getMqttSettings } from "@/features/iot/services/mqttService";
import { Radio, RefreshCw, Save } from "lucide-react";
import { fetchConfigFromCloudflare, saveConfigToCloudflare } from "@/features/iot/services/cloudflare/api";
import { DEFAULT_ESP_CONFIG } from "@/features/iot/services/esp32Config";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { MqttFormFields } from "./MqttFormFields";
import { MqttQosSelector } from "./MqttQosSelector";

export default function MqttSection() {
  const [brokerWsUrl, setBrokerWsUrl] = useState("");
  const [brokerHost, setBrokerHost] = useState("");
  const [brokerPort, setBrokerPort] = useState(1883);
  const [baseTopic, setBaseTopic] = useState("");
  const [qos, setQos] = useState<0 | 1 | 2>(1);
  const [isSaved, setIsSaved] = useState(false);
  const setMqttConfig = useIoTStore((state) => state.setMqttConfig);
  const showToast = useIoTStore((state) => state.showToast);

  useEffect(() => {
    // Load initially from local
    const settings = getMqttSettings();
    setBrokerWsUrl(settings.brokerUrl);
    setBrokerHost("broker.emqx.io");
    setBrokerPort(1883);
    setBaseTopic(settings.baseTopic);
    setQos(settings.qos);

    // Fetch from Cloudflare to sync
    fetchConfigFromCloudflare().then(config => {
      if (config && config.mqtt) {
        setBrokerWsUrl(config.mqtt.broker_ws_url);
        setBrokerHost(config.mqtt.broker_host);
        setBrokerPort(config.mqtt.broker_port);
        setBaseTopic(config.mqtt.base_topic);
        setQos(config.mqtt.qos);
      }
    });
  }, []);

  const handleSaveAndReconnect = async () => {
    soundManager.playClick();
    
    // Save locally for dashboard fast reconnect
    localStorage.setItem("mqtt_broker_url", brokerWsUrl);
    localStorage.setItem("mqtt_base_topic", baseTopic);
    localStorage.setItem("mqtt_qos", qos.toString());

    const newMqttConfig = {
      broker_ws_url: brokerWsUrl,
      broker_host: brokerHost,
      broker_port: brokerPort,
      base_topic: baseTopic,
      qos: qos
    };
    setMqttConfig(newMqttConfig);
    
    // Save to Cloudflare for Worker & ESP32
    try {
      const config = await fetchConfigFromCloudflare() || DEFAULT_ESP_CONFIG;
      config.mqtt = newMqttConfig;
      const res = await saveConfigToCloudflare(config);
      if (res.success) {
        showToast(res.message, "success");
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        showToast(res.message, "error");
      }
    } catch (e) {
      console.error("Failed to save MQTT settings to cloud", e);
      showToast("خطا در ارتباط با سرور کلودفلر", "error");
    }

    reconnectMqtt();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[10px] text-[var(--text-tertiary)] leading-relaxed text-right">
          تنظیمات ارتباطی داشبورد با ماژول‌های ESP را مدیریت کنید. پس از ذخیره، اتصال مجدداً برقرار می‌شود.
        </p>
      </div>

      <div className="space-y-4">
        <MqttFormFields 
          brokerWsUrl={brokerWsUrl} setBrokerWsUrl={setBrokerWsUrl}
          brokerHost={brokerHost} setBrokerHost={setBrokerHost}
          brokerPort={brokerPort} setBrokerPort={setBrokerPort}
          baseTopic={baseTopic} setBaseTopic={setBaseTopic}
        />
        <MqttQosSelector qos={qos} setQos={setQos} />
      </div>

      <button
        onClick={handleSaveAndReconnect}
        className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm font-bold ${
          isSaved
            ? "bg-[var(--accent4-transparent)] text-[var(--accent4)] border border-[var(--accent4)]"
            : "bg-[var(--accent3)] hover:bg-[var(--accent3-dark)] text-white shadow-lg shadow-[var(--accent3-transparent)]"
        }`}
      >
        {isSaved ? (
          <>
            <Save className="w-4 h-4" />
            ذخیره شد
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            ذخیره و اتصال مجدد
          </>
        )}
      </button>
    </div>
  );
}
