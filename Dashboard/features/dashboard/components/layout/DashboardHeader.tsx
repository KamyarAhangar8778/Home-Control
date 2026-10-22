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
      className={`sticky top-0 z-20 flex h-screen shrink-0 flex-col overflow-y-auto border-l border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] px-2 py-4 transition-[width] duration-200 md:px-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] ${isSidebarCollapsed ? "w-16 md:w-16" : "w-16 md:w-64"}`}
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
