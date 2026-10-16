import React from "react";
import { Settings2 } from "lucide-react";

interface TriggerButtonProps {
  variant: "horizontal" | "vertical";
  isSidebarCollapsed?: boolean;
  animationsEnabled?: boolean;
  onClick: () => void;
}

export default function TriggerButton({ variant, isSidebarCollapsed, animationsEnabled, onClick }: TriggerButtonProps) {
  if (variant === "vertical" && !isSidebarCollapsed) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] hover:border-[var(--accent3-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98]"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[var(--accent3-transparent)] text-[var(--accent3)]">
            <Settings2
              className={`w-4 h-4 ${animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`}
            />
          </div>
          <span className="text-xs font-semibold">قوانین و شرط‌ها</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
          Rules
        </span>
      </button>
    );
  }

  return (
    <button
      id="mobile-global-rules-trigger"
      onClick={onClick}
      className="p-2 md:p-2.5 bg-[var(--card-bg-solid)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:border-[var(--accent3)] active:scale-[0.97] group flex justify-center items-center w-full"
      title="تنظیمات شرط‌ها"
    >
      <Settings2 className={`w-4 h-4 transition-transform duration-300 ${animationsEnabled ? "group-hover:rotate-90" : ""}`} />
    </button>
  );
}
