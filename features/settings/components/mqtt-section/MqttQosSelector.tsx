import React from "react";
import { soundManager } from "@/lib/audio";

interface Props {
  qos: 0 | 1 | 2;
  setQos: (val: 0 | 1 | 2) => void;
}

export function MqttQosSelector({ qos, setQos }: Props) {
  return (
    <div className="space-y-2 text-right pt-2">
      <label className="text-xs font-bold text-[var(--text-primary)] px-1">
        کیفیت سرویس (QoS)
      </label>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((q) => (
          <button
            key={q}
            onClick={() => {
              soundManager.playClick();
              setQos(q as 0 | 1 | 2);
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all duration-300 ${
              qos === q
                ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)]"
                : "bg-[var(--card-bg-solid)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--card-hover-bg)] hover:border-[var(--accent4)]"
            }`}
          >
            QoS {q}
          </button>
        ))}
      </div>
      <p className="text-[9px] text-[var(--text-muted)] pt-1 px-1">
        {qos === 0 && "ارسال حداکثر یکبار. بدون تضمین تحویل."}
        {qos === 1 && "ارسال حداقل یکبار. تضمین تحویل با احتمال تکرار."}
        {qos === 2 && "ارسال دقیقا یکبار. امن‌ترین و کندترین حالت."}
      </p>
    </div>
  );
}
