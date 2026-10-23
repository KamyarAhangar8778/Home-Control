"use client";

import React from "react";
import SettingsDrawer from "@/features/settings/components/SettingsDrawer";
import ModulesDrawer from "@/features/iot/components/ModulesDrawer";
import AutomationsDrawer from "@/features/iot/components/AutomationsDrawer";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export default function DashboardDrawers() {
  const isMenuOpen = useIoTStore(s => s.isMenuOpen);
  const setIsMenuOpen = useIoTStore(s => s.setIsMenuOpen);
  const isModulesMenuOpen = useIoTStore(s => s.isModulesMenuOpen);
  const setIsModulesMenuOpen = useIoTStore(s => s.setIsModulesMenuOpen);
  const isAutomationsMenuOpen = useIoTStore(s => s.isAutomationsMenuOpen);
  const setIsAutomationsMenuOpen = useIoTStore(s => s.setIsAutomationsMenuOpen);
  const activeSettingsTab = useIoTStore(s => s.activeSettingsTab);
  const setActiveSettingsTab = useIoTStore(s => s.setActiveSettingsTab);
  const accent3 = useIoTStore(s => s.accent3);
  const accent4 = useIoTStore(s => s.accent4);
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const setAnimationsEnabled = useIoTStore(s => s.setAnimationsEnabled);
  const animationsFps = useIoTStore(s => s.animationsFps);
  const setAnimationsFps = useIoTStore(s => s.setAnimationsFps);
  const headerTitle = useIoTStore(s => s.headerTitle);
  const setHeaderTitle = useIoTStore(s => s.setHeaderTitle);
  const isDark = useIoTStore(s => s.isDark);
  const setIsGroupsCompactLayout = useIoTStore(s => s.setIsGroupsCompactLayout);
  const setIsSegmentsCompactLayout = useIoTStore(s => s.setIsSegmentsCompactLayout);
  const { handleAddSegment, handleRemoveSegment } = useDashboard();
  
  const segments = useIoTStore(s => s.segments);

  return (
    <React.Suspense fallback={null}>
      {isMenuOpen && (
        <SettingsDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          activeTab={activeSettingsTab}
          setActiveTab={setActiveSettingsTab}
          accent3={accent3}
          accent4={accent4}
          animationsEnabled={animationsEnabled}
          setAnimationsEnabled={setAnimationsEnabled}
          animationsFps={animationsFps}
          setAnimationsFps={setAnimationsFps}
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
          isDark={isDark}
          setIsGroupsCompactLayout={setIsGroupsCompactLayout}
          setIsSegmentsCompactLayout={setIsSegmentsCompactLayout}
        />
      )}

      {isModulesMenuOpen && (
        <ModulesDrawer
          isOpen={isModulesMenuOpen}
          onClose={() => setIsModulesMenuOpen(false)}
          onAddSegment={handleAddSegment}
          segments={segments}
          onRemoveSegment={handleRemoveSegment}
          isDark={isDark}
          accent3={accent3}
          accent4={accent4}
          animationsEnabled={animationsEnabled}
        />
      )}

      {isAutomationsMenuOpen && (
        <AutomationsDrawer
          isOpen={isAutomationsMenuOpen}
          onClose={() => setIsAutomationsMenuOpen(false)}
          isDark={isDark}
          animationsEnabled={animationsEnabled}
        />
      )}
    </React.Suspense>
  );
}
