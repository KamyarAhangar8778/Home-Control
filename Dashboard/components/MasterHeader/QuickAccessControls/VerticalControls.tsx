import React from "react";
import { Settings as SettingsIcon, Layers } from "lucide-react";
import { useIoTStore } from '@/features/iot/hooks/useIoTStore';
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
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

  return (
    <div className="space-y-2 mt-4">
      <span className="text-[10px] text-[var(--text-muted)] font-black block text-right uppercase tracking-wider">
        بخش‌های کاربری
      </span>

      <button
        onClick={() => setIsModulesMenuOpen(true)}
        className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] md:hover:border-[var(--accent4-medium)] text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98]"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[var(--accent4-transparent)] text-[var(--accent4)]">
            <Layers
              className={`w-4 h-4 ${animationsEnabled ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`}
            />
          </div>
          <span className="text-xs font-semibold">پالایه و ماژول‌ها</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
          Modules
        </span>
      </button>

      <button
        onClick={() => setIsAutomationsMenuOpen(true)}
        className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] md:hover:border-[var(--accent3-medium)] text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98] group"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[var(--accent3-transparent)] text-[var(--accent3)]">
            <svg xmlns="http://www.w3.org/00/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="12" x2="12" y2="6" className={animationsEnabled ? "animate-[spin_1s_linear_infinite]" : ""} style={{ transformOrigin: "12px 12px" }} />
              <line x1="12" y1="12" x2="16" y2="12" className={animationsEnabled ? "animate-[spin_12s_linear_infinite]" : ""} style={{ transformOrigin: "12px 12px" }} />
            </svg>
          </div>
          <span className="text-xs font-semibold">اتوماسیون‌ها</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
          Time
        </span>
      </button>

      <VoiceCommandButton 
        animationsEnabled={animationsEnabled} 
        variant={variant} 
        isSidebarCollapsed={isSidebarCollapsed} 
      />

      <button
        onClick={() => setIsMenuOpen(true)}
        className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] md:hover:border-[var(--accent3-medium)] text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98]"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gray-500/10 text-[var(--text-tertiary)] transition-all">
            <SettingsIcon
              className={`w-4 h-4 ${animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`}
            />
          </div>
          <span className="text-xs font-semibold">تنظیمات اصلی</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
          Setup
        </span>
      </button>
    </div>
  );
}
