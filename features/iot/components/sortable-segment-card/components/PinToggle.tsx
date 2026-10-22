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
      aria-pressed={isPinOn}
      {...(buttonProps as any)}
      className={`switch-toggle relative inline-flex ${isVertical ? "w-6 h-11 flex-col" : "h-6 w-11"} rounded-full p-0.5 items-center transition-colors duration-200 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] select-none ${
        isUltraCompact ? "shadow-inner" : ""
      } ${
        isPinOn
          ? "bg-[var(--primary)]"
          : "bg-[var(--input)] border border-[var(--border)]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-[var(--primary-foreground)] shadow-sm transform ${
          animationsEnabled ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""
        } ${isVertical ? (isPinOn ? "translate-y-0" : "translate-y-5") : (isPinOn ? "translate-x-0" : "-translate-x-5")}`}
      />
    </button>
  );
}
