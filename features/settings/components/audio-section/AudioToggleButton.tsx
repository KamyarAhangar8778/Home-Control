import React from "react";
import { Activity, VolumeX } from "lucide-react";

interface Props {
  isMusicOn: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export function AudioToggleButton({ isMusicOn, isLoading, onToggle }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] text-[var(--text-tertiary)] leading-relaxed text-right">
        پخش پیوسته موزیک پس‌زمینه برای افزایش تمرکز و آرامش حین استفاده از داشبورد هوشمند.
      </p>

      <button
        onClick={onToggle}
        type="button"
        disabled={isLoading}
        className={`switch-toggle w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer text-right group ${
          isMusicOn
            ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] shadow-[var(--accent3-transparent)]"
            : "bg-[var(--card-bg-solid)] border-[var(--border-color)] hover:border-[var(--text-muted)]"
        } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        <div
          className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${
            isMusicOn ? "bg-[var(--accent3)]" : "bg-[var(--card-hover-bg)] border border-[var(--border-color)]"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
              isMusicOn ? "translate-x-0" : "-translate-x-4"
            }`}
          />
        </div>

        <div className="text-right space-y-0.5 max-w-[70%]">
          <span
            className={`block text-sm font-bold transition-colors ${
              isMusicOn ? "text-[var(--accent3)]" : "text-[var(--text-secondary)]"
            }`}
          >
            موزیک پس‌زمینه
          </span>
          <span className="block text-[9px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
            {isLoading ? "Loading..." : isMusicOn ? "Active / Playing" : "Disabled / Paused"}
          </span>
        </div>

        <div
          className={`p-2.5 rounded-xl transition-all duration-300 ${
            isMusicOn
              ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] shadow-[inset_0_0_8px_rgba(99,102,241,0.2)]"
              : "bg-[var(--card-hover-bg)] text-[var(--text-muted)]"
          }`}
        >
          {isMusicOn ? <Activity className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
        </div>
      </button>
    </div>
  );
}
