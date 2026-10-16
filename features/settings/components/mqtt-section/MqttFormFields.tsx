import React from "react";

interface Props {
  brokerWsUrl: string;
  setBrokerWsUrl: (val: string) => void;
  brokerHost: string;
  setBrokerHost: (val: string) => void;
  brokerPort: number;
  setBrokerPort: (val: number) => void;
  baseTopic: string;
  setBaseTopic: (val: string) => void;
}

export function MqttFormFields({
  brokerWsUrl, setBrokerWsUrl,
  brokerHost, setBrokerHost,
  brokerPort, setBrokerPort,
  baseTopic, setBaseTopic
}: Props) {
  return (
    <>
      <div className="space-y-2 text-right">
        <label className="text-xs font-bold text-[var(--text-primary)] px-1">
          آدرس سرور داشبورد (WebSocket URL)
        </label>
        <input
          type="text" dir="ltr"
          value={brokerWsUrl}
          onChange={(e) => setBrokerWsUrl(e.target.value)}
          className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
          placeholder="wss://broker.emqx.io:8084/mqtt"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 space-y-2 text-right">
          <label className="text-xs font-bold text-[var(--text-primary)] px-1">
            آدرس سرور سخت‌افزار (TCP Host)
          </label>
          <input
            type="text" dir="ltr"
            value={brokerHost}
            onChange={(e) => setBrokerHost(e.target.value)}
            className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
            placeholder="broker.emqx.io"
          />
        </div>
        <div className="col-span-1 space-y-2 text-right">
          <label className="text-xs font-bold text-[var(--text-primary)] px-1">
            پورت (Port)
          </label>
          <input
            type="number" dir="ltr"
            value={brokerPort}
            onChange={(e) => setBrokerPort(parseInt(e.target.value) || 1883)}
            className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
            placeholder="1883"
          />
        </div>
      </div>

      <div className="space-y-2 text-right">
        <label className="text-xs font-bold text-[var(--text-primary)] px-1">
          موضوع پایه (Base Topic)
        </label>
        <input
          type="text" dir="ltr"
          value={baseTopic}
          onChange={(e) => setBaseTopic(e.target.value)}
          className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
          placeholder="KamyarIoT/Achaemenid"
        />
      </div>
    </>
  );
}
