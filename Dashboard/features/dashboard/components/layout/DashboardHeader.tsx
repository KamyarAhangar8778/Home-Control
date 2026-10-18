"use client";

import React from "react";
import MasterHeader from "@/components/MasterHeader";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface DashboardHeaderProps {
  position: "left" | "topOrMobile";
}

export default function DashboardHeader({ position }: DashboardHeaderProps) {
  // Removed useDashboard as we don't need functions from it in DashboardHeader (they were all state variables)
  
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

  if (position === "left") {
    return (
      <aside 
        className={`hidden md:flex md:shrink-0 md:sticky md:top-4 md:h-fit p-1 flex-col justify-start overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] gap-4 transition-all duration-300 ${
          isSidebarCollapsed ? "md:w-20" : "md:w-72"
        }`}
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

  // position === "topOrMobile"
  const showHeader = headerPosition === "top" || headerPosition === "left";
  if (!showHeader) return null;

  return (
    <div className={headerPosition === "left" ? "md:hidden w-full" : "w-full"}>
      <MasterHeader
        isDark={isDark}
        setIsDark={setIsDark}
        setIsModulesMenuOpen={setIsModulesMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        headerAnimationType={headerAnimationType}
        headerTitle={headerTitle}
        groupsCols={groupsCols}
        setGroupsCols={setGroupsCols}
        headerPosition={headerPosition === "left" ? "top" : headerPosition}
        setHeaderPosition={setHeaderPosition}
        animationsEnabled={animationsEnabled}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        groupsOrder={groupsOrder}
        selectedGroupFilter={selectedGroupFilter}
        setSelectedGroupFilter={setSelectedGroupFilter}
      />
    </div>
  );
}
