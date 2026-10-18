"use client";

import React from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import LowDataModeBanner from "@/features/iot/components/notifications/LowDataModeBanner";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useDashboardLayout } from "../../hooks/useDashboardLayout";
import DashboardWorkspace from "./DashboardWorkspace";
import MobileVoiceCommandButton from "../widgets/MobileVoiceCommandButton";

export default function DashboardMain() {
  const { refetchIot, triggerCloudflarePush } = useDashboard();
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const headerPosition = useIoTStore(s => s.headerPosition);
  const dashboardWidth = useIoTStore(s => s.dashboardWidth);
  const activeGroupId = useIoTStore(s => s.activeGroupId);
  const activeSegmentId = useIoTStore(s => s.activeSegmentId);

  const segments = useIoTStore(s => s.segments);
  const lowDataMode = useIoTStore(s => s.lowDataMode);
  const manualSaveMode = useIoTStore(s => s.manualSaveMode);
  const unsavedChangesCount = useIoTStore(s => s.unsavedChangesCount);

  const isDragging = !!activeGroupId || !!activeSegmentId;
  const { innerWidthClass } = useDashboardLayout(dashboardWidth);

  return (
    <>
      {segments.length > 0 && (lowDataMode || (manualSaveMode && unsavedChangesCount > 0)) && (
        <LowDataModeBanner
          lowDataMode={lowDataMode}
          animationsEnabled={animationsEnabled}
          refetchIot={refetchIot}
          headerPosition={headerPosition}
          manualSaveMode={manualSaveMode}
          unsavedChangesCount={unsavedChangesCount}
          triggerCloudflarePush={triggerCloudflarePush}
        />
      )}

      <DashboardWorkspace />

      {!isDragging && (
        <footer className={`flex flex-col items-center gap-3 text-center text-[10px] theme-text-secondary font-sans border border-[var(--border-color)] bg-[var(--card-bg)]/80 backdrop-blur-md py-4 px-6 mt-12 mb-4 mx-auto ${innerWidthClass} w-full shadow-sm md:hover:shadow-lg rounded-xl transition-all duration-300 footer-animated-border`}>
          {/* Device Version Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card-hover-bg)] border border-[var(--border-color)] hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-500 cursor-default group hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            
            <span className="font-bold opacity-80 group-hover:opacity-100 transition-opacity duration-300 relative z-10">ورژن داشبورد:</span>
            
            <div className="flex sm:hidden items-center gap-1.5 text-[var(--accent3)] relative z-10">
              <Smartphone className="w-3.5 h-3.5 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300" />
              <span className="group-hover:font-bold transition-all duration-300">موبایل</span>
            </div>

            <div className="hidden sm:flex lg:hidden items-center gap-1.5 text-[var(--accent4)] relative z-10">
              <Tablet className="w-3.5 h-3.5 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300" />
              <span className="group-hover:font-bold transition-all duration-300">تبلت</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 relative z-10">
              <Monitor className="w-3.5 h-3.5 animate-[pulse_3s_ease-in-out_infinite] group-hover:animate-none group-hover:scale-125 group-hover:-translate-y-0.5 transition-transform duration-300" />
              <span className="group-hover:tracking-wide group-hover:font-bold transition-all duration-300">کامپیوتر</span>
            </div>
          </div>

          <span className="footer-animated-text block opacity-70">
            سامانه هوشمند و داشبورد تعاملی مانیتورینگ صنعت اینترنت اشیاء (الهام گرفته از طراحی
            کلودفلر)
          </span>
        </footer>
      )}
      <MobileVoiceCommandButton />
    </>
  );
}
