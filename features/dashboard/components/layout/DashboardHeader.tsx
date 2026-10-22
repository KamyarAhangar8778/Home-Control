"use client";

import React from "react";
import MasterHeader from "@/components/MasterHeader";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export default function DashboardHeader() {
  const setIsModulesMenuOpen = useIoTStore(s => s.setIsModulesMenuOpen);
  const setIsMenuOpen = useIoTStore(s => s.setIsMenuOpen);
  const headerTitle = useIoTStore(s => s.headerTitle);
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const isSidebarCollapsed = useIoTStore(s => s.isSidebarCollapsed);
  const setIsSidebarCollapsed = useIoTStore(s => s.setIsSidebarCollapsed);
  const groupsCols = useIoTStore(s => s.groupsCols);
  const setGroupsCols = useIoTStore(s => s.setGroupsCols);

  return (
    <aside
      className={`flex shrink-0 sticky top-0 md:top-4 h-screen md:h-fit p-1 flex-col justify-start overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] gap-4 transition-all duration-300 ${isSidebarCollapsed ? "w-16 md:w-20" : "w-16 md:w-72"}`}
      aria-label="ناوبری اصلی"
    >
      <MasterHeader
        setIsModulesMenuOpen={setIsModulesMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        headerTitle={headerTitle}
        groupsCols={groupsCols}
        setGroupsCols={setGroupsCols}
        animationsEnabled={animationsEnabled}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
    </aside>
  );
}
