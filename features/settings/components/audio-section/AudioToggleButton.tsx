import React from "react";
import { Button } from "@/components/ui/button";
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

      <Button variant="ghost"
        onClick={onToggle}
        type="button"
        disabled={isLoading}
        className={`switch-toggle w-full h-auto min-h-[5.5rem] flex-row-reverse justify-between gap-3 whitespace-normal rounded-2xl border p-4 text-right transition-colors duration-200 hover:bg-[var(--card-hover-bg)] hover:text-[var(--text-primary)] focus-visible:ring-[var(--accent3)] group ${
          isMusicOn
            ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] shadow-[var(--accent3-transparent)]"
            : "bg-[var(--card-bg-solid)] border-[var(--border-color)] hover:border-[var(--text-muted)]"
        } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        <div
          className={`flex h-6 w-10 shrink-0 items-center rounded-full p-1 transition-colors duration-300 ${
            isMusicOn ? "bg-[var(--accent3)]" : "bg-[var(--card-hover-bg)] border border-[var(--border-color)]"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
              isMusicOn ? "translate-x-0" : "-translate-x-4"
            }`}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-1 text-right">
          <span
            className={`block text-sm font-bold transition-colors ${
              isMusicOn ? "text-[var(--accent3)]" : "text-[var(--text-secondary)]"
            }`}
          >
            موزیک پس‌زمینه
          </span>
          <span className="block text-[10px] leading-relaxed text-[var(--text-muted)] font-mono uppercase tracking-wider">
            {isLoading ? "Loading..." : isMusicOn ? "Active / Playing" : "Disabled / Paused"}
          </span>
        </div>

        <div
          className={`shrink-0 rounded-xl p-2.5 transition-colors duration-200 ${
            isMusicOn
              ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] shadow-[inset_0_0_8px_rgba(99,102,241,0.2)]"
              : "bg-[var(--card-hover-bg)] text-[var(--text-muted)]"
          }`}
        >
          {isMusicOn ? <Activity className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
        </div>
      </Button>
    </div>
  );
}
