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

  const itemClass = "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-right text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-hover-bg)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent4)]";

  return (
    <nav className="space-y-1" aria-label="بخش‌های کاربری">
      {!isSidebarCollapsed && (
        <span className="mb-2 block px-3 text-xs font-medium text-[var(--text-muted)]">
          فضای خانه
        </span>
      )}

      <button
        onClick={() => setIsModulesMenuOpen(true)}
        className={itemClass}
        title="پالایه و ماژول‌ها"
        aria-label="پالایه و ماژول‌ها"
      >
        <Layers className="h-4 w-4 shrink-0" />
        {!isSidebarCollapsed && <span className="text-sm">پالایه و ماژول‌ها</span>}
      </button>

      <button
        onClick={() => setIsAutomationsMenuOpen(true)}
        className={itemClass}
        title="اتوماسیون‌ها"
        aria-label="اتوماسیون‌ها"
      >
        <Clock3 className="h-4 w-4 shrink-0" />
        {!isSidebarCollapsed && <span className="text-sm">اتوماسیون‌ها</span>}
      </button>

      <VoiceCommandButton
        animationsEnabled={animationsEnabled}
        variant={variant}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="my-3 border-t border-[var(--border-color)]" />

      <button
        onClick={() => setIsMenuOpen(true)}
        className={itemClass}
        title="تنظیمات اصلی"
        aria-label="تنظیمات اصلی"
      >
        <SettingsIcon className="h-4 w-4 shrink-0" />
        {!isSidebarCollapsed && <span className="text-sm">تنظیمات اصلی</span>}
      </button>
    </nav>
  );
}
