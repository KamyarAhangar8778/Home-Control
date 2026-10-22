"use client";

import React from "react";
import MasterHeader from "@/components/MasterHeader";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface DashboardHeaderProps {
  position: "left" | "topOrMobile";
}

export default function DashboardHeader({ position }: DashboardHeaderProps) {
  const isDark = useIoTStore(s => s.isDark);
  const setIsDark = useIoTStore(s => s.setIsDark);
  const setIsModulesMenuOpen = useIoTStore(s => s.setIsModulesMenuOpen);
  const setIsMenuOpen = useIoTStore(s => s.setIsMenuOpen);
  const headerAnimationType = useIoTStore(s => s.headerAnimationType);
  const headerTitle = useIoTStore(s => s.headerTitle);
  const headerPosition = useIoTStore(s => s.headerPosition);
  const setHeaderPosition = useIoTStore(s => s.setHeaderPosition);
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const isSidebarCollapsed = useIoTStore(s => s.isSidebarCollapsed);
  const setIsSidebarCollapsed = useIoTStore(s => s.setIsSidebarCollapsed);
  const groupsCols = useIoTStore(s => s.groupsCols);
  const setGroupsCols = useIoTStore(s => s.setGroupsCols);
  const groupsOrder = useIoTStore(s => s.groupsOrder);
  const selectedGroupFilter = useIoTStore(s => s.selectedGroupFilter);
  const setSelectedGroupFilter = useIoTStore(s => s.setSelectedGroupFilter);

  if (position === "topOrMobile") return null;

  return (
    <aside
      className={`flex shrink-0 sticky top-0 md:top-4 h-screen md:h-fit p-1 flex-col justify-start overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] gap-4 transition-all duration-300 ${isSidebarCollapsed ? "w-16 md:w-20" : "w-16 md:w-72"}`}
      aria-label="ناوبری اصلی"
    >
      <MasterHeader
        isDark={isDark}
        setIsDark={setIsDark}
        setIsModulesMenuOpen={setIsModulesMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        headerAnimationType={headerAnimationType}
        headerTitle={headerTitle}
        groupsCols={groupsCols}
        setGroupsCols={setGroupsCols}
        headerPosition={headerPosition}
        setHeaderPosition={setHeaderPosition}
        animationsEnabled={animationsEnabled}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        groupsOrder={groupsOrder}
        selectedGroupFilter={selectedGroupFilter}
        setSelectedGroupFilter={setSelectedGroupFilter}
      />
    </aside>
  );
}
