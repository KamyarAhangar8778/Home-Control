import React from "react";

interface PinSelectorProps {
  customPin: string;
  setCustomPin: (val: string) => void;
}

export default function PinSelector({
  customPin,
  setCustomPin,
}: PinSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] theme-text-tertiary font-bold w-full text-right">
          تعیین پایه سخت‌افزاری ESP32:
        </label>
      </div>
      <input
        type="text"
        placeholder="مثال: 14"
        value={customPin}
        onChange={(e) => setCustomPin(e.target.value.replace(/[^0-9]/g, ""))}
        className="w-full h-10 px-3 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans text-right placeholder:text-[var(--text-muted)] shadow-sm"
        dir="ltr"
      />
    </div>
  );
}
