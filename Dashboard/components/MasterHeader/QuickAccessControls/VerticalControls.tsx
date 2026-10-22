import React from "react";
import { Settings as SettingsIcon, Layers, Clock3 } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import VoiceCommandButton from "../VoiceCommandButton";
import { QuickAccessControlsProps } from "./types";

export default function VerticalControls({
  setIsModulesMenuOpen,
  setIsMenuOpen,
  animationsEnabled,
  variant,
  isSidebarCollapsed,
}: QuickAccessControlsProps) {
  const setIsAutomationsMenuOpen = useIoTStore(s => s.setIsAutomationsMenuOpen);

  const itemClass = "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-hover-bg)] hover:text-[var(--text-primary)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent4)]";

  return (
    <nav className="space-y-1" aria-label="بخش‌های کاربری">
      {!isSidebarCollapsed && (
        <span className="mb-2 block px-3 text-[11px] font-semibold text-[var(--text-muted)]">
          بخش‌ها
        </span>
      )}

      <button
        onClick={() => setIsModulesMenuOpen(true)}
        className={itemClass}
        title="پالایه و ماژول‌ها"
        aria-label="پالایه و ماژول‌ها"
      >
        <Layers className={`h-5 w-5 shrink-0 ${animationsEnabled ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`} />
        {!isSidebarCollapsed && <span className="text-sm">پالایه و ماژول‌ها</span>}
      </button>

      <button
        onClick={() => setIsAutomationsMenuOpen(true)}
        className={itemClass}
        title="اتوماسیون‌ها"
        aria-label="اتوماسیون‌ها"
      >
        <Clock3 className="h-5 w-5 shrink-0" />
        {!isSidebarCollapsed && <span className="text-sm">اتوماسیون‌ها</span>}
      </button>

      <VoiceCommandButton
        animationsEnabled={animationsEnabled}
        variant={variant}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <button
        onClick={() => setIsMenuOpen(true)}
        className={itemClass}
        title="تنظیمات اصلی"
        aria-label="تنظیمات اصلی"
      >
        <SettingsIcon className="h-5 w-5 shrink-0" />
        {!isSidebarCollapsed && <span className="text-sm">تنظیمات اصلی</span>}
      </button>
    </nav>
  );
}
