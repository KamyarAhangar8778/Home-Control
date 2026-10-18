import React from "react";
import { Settings as SettingsIcon, Layers } from "lucide-react";
import { useIoTStore } from '@/features/iot/hooks/useIoTStore';
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import VoiceCommandButton from "../VoiceCommandButton";
import { QuickAccessControlsProps } from "./types";

export default function HorizontalControls({
  setIsModulesMenuOpen,
  setIsMenuOpen,
  animationsEnabled,
  variant,
  isSidebarCollapsed,
}: QuickAccessControlsProps) {
  const setIsAutomationsMenuOpen = useIoTStore(s => s.setIsAutomationsMenuOpen);

  return (
    <div className="flex items-center gap-1">
      <VoiceCommandButton 
        animationsEnabled={animationsEnabled} 
        variant={variant} 
        isSidebarCollapsed={isSidebarCollapsed} 
      />

      <button
        onClick={() => setIsModulesMenuOpen(true)}
        className="p-2 md:p-2.5 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-all md:hover:border-[var(--accent4)] active:scale-[0.97] group flex justify-center items-center"
        title="مدیریت ماژول‌ها و ابزارها"
      >
        <Layers
          className={`w-4 h-4 transition-transform duration-300 ${animationsEnabled ? "md:group-hover:scale-110" : ""}`}
        />
      </button>

      <button
        onClick={() => setIsAutomationsMenuOpen(true)}
        className="p-2 md:p-2.5 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-all md:hover:border-[var(--accent3)] active:scale-[0.97] group flex justify-center items-center"
        title="اتوماسیون‌های زمانی"
      >
        <svg xmlns="http://www.w3.org/00/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 transition-transform duration-300 ${animationsEnabled ? "md:group-hover:scale-110" : ""}`}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="12" x2="12" y2="6" className={animationsEnabled ? "animate-[spin_1s_linear_infinite]" : ""} style={{ transformOrigin: "12px 12px" }} />
          <line x1="12" y1="12" x2="16" y2="12" className={animationsEnabled ? "animate-[spin_12s_linear_infinite]" : ""} style={{ transformOrigin: "12px 12px" }} />
        </svg>
      </button>

      <button
        onClick={() => setIsMenuOpen(true)}
        className="p-2 md:p-2.5 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-all md:hover:border-[var(--accent3)] active:scale-[0.97] group flex justify-center items-center"
        title="پیکربندی سیستم"
      >
        <SettingsIcon
          className={`w-4 h-4 transition-transform duration-300 ${animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`}
        />
      </button>
    </div>
  );
}
