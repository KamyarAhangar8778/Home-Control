import React from "react";

interface PinToggleProps {
  isPinOn: boolean;
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  animationsEnabled?: boolean;
  isUltraCompact?: boolean;
  isVertical?: boolean;
}

export default function PinToggle({
  isPinOn,
  buttonProps,
  animationsEnabled = true,
  isUltraCompact = false,
  isVertical = false,
}: PinToggleProps) {
  return (
    <button
      {...(buttonProps as any)}
      className={`switch-toggle relative inline-flex ${isVertical ? "w-6 h-11 flex-col" : "h-6 w-11"} rounded-full p-0.5 items-center transition-all duration-300 shrink-0 cursor-pointer focus:outline-none select-none md:hover:scale-110 active:scale-95 md:hover:brightness-110 ${
        isUltraCompact ? "shadow-inner" : ""
      } ${
        isPinOn
          ? "bg-[var(--accent4)] shadow-[0_0_8px_rgba(16,185,129,0.35)]"
          : isUltraCompact
            ? "bg-black/50 border border-slate-800"
            : "bg-black/30 border border-slate-800/40"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow-md transform ${
          animationsEnabled ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""
        } ${isVertical ? (isPinOn ? "translate-y-0" : "translate-y-5") : (isPinOn ? "-translate-x-5" : "translate-x-0")}`}
      />
    </button>
  );
}
