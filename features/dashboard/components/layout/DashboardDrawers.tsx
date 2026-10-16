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
  const setAccent3 = useIoTStore(s => s.setAccent3);
  const accent4 = useIoTStore(s => s.accent4);
  const setAccent4 = useIoTStore(s => s.setAccent4);
  const selectedFont = useIoTStore(s => s.selectedFont);
  const setSelectedFont = useIoTStore(s => s.setSelectedFont);
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const setAnimationsEnabled = useIoTStore(s => s.setAnimationsEnabled);
  const animationsFps = useIoTStore(s => s.animationsFps);
  const setAnimationsFps = useIoTStore(s => s.setAnimationsFps);
  const headerAnimationType = useIoTStore(s => s.headerAnimationType);
  const setHeaderAnimationType = useIoTStore(s => s.setHeaderAnimationType);
  const headerTitle = useIoTStore(s => s.headerTitle);
  const setHeaderTitle = useIoTStore(s => s.setHeaderTitle);
  const matrixDensity = useIoTStore(s => s.matrixDensity);
  const setMatrixDensity = useIoTStore(s => s.setMatrixDensity);
  const matrixSize = useIoTStore(s => s.matrixSize);
  const setMatrixSize = useIoTStore(s => s.setMatrixSize);
  const matrixHoverSize = useIoTStore(s => s.matrixHoverSize);
  const setMatrixHoverSize = useIoTStore(s => s.setMatrixHoverSize);
  const matrixOpacity = useIoTStore(s => s.matrixOpacity);
  const setMatrixOpacity = useIoTStore(s => s.setMatrixOpacity);
  const matrixColor = useIoTStore(s => s.matrixColor);
  const setMatrixColor = useIoTStore(s => s.setMatrixColor);
  const matrixMoving = useIoTStore(s => s.matrixMoving);
  const setMatrixMoving = useIoTStore(s => s.setMatrixMoving);
  const matrixMouseEffect = useIoTStore(s => s.matrixMouseEffect);
  const setMatrixMouseEffect = useIoTStore(s => s.setMatrixMouseEffect);
  const matrixTwinkleEffect = useIoTStore(s => s.matrixTwinkleEffect);
  const setMatrixTwinkleEffect = useIoTStore(s => s.setMatrixTwinkleEffect);
  const matrixTwinkleSpeed = useIoTStore(s => s.matrixTwinkleSpeed);
  const setMatrixTwinkleSpeed = useIoTStore(s => s.setMatrixTwinkleSpeed);
  const isDark = useIoTStore(s => s.isDark);
  const headerPosition = useIoTStore(s => s.headerPosition);
  const setHeaderPosition = useIoTStore(s => s.setHeaderPosition);
  const dashboardWidth = useIoTStore(s => s.dashboardWidth);
  const setDashboardWidth = useIoTStore(s => s.setDashboardWidth);
  const dashboardBgColor = useIoTStore(s => s.dashboardBgColor);
  const setDashboardBgColor = useIoTStore(s => s.setDashboardBgColor);
  const dashboardBgOpacity = useIoTStore(s => s.dashboardBgOpacity);
  const setDashboardBgOpacity = useIoTStore(s => s.setDashboardBgOpacity);
  const isGroupsCompactLayout = useIoTStore(s => s.isGroupsCompactLayout);
  const setIsGroupsCompactLayout = useIoTStore(s => s.setIsGroupsCompactLayout);
  const isSegmentsCompactLayout = useIoTStore(s => s.isSegmentsCompactLayout);
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
          setAccent3={setAccent3}
          accent4={accent4}
          setAccent4={setAccent4}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          animationsEnabled={animationsEnabled}
          setAnimationsEnabled={setAnimationsEnabled}
          animationsFps={animationsFps}
          setAnimationsFps={setAnimationsFps}
          headerAnimationType={headerAnimationType}
          setHeaderAnimationType={setHeaderAnimationType}
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
          matrixDensity={matrixDensity}
          setMatrixDensity={setMatrixDensity}
          matrixSize={matrixSize}
          setMatrixSize={setMatrixSize}
          matrixHoverSize={matrixHoverSize}
          setMatrixHoverSize={setMatrixHoverSize}
          matrixOpacity={matrixOpacity}
          setMatrixOpacity={setMatrixOpacity}
          matrixColor={matrixColor}
          setMatrixColor={setMatrixColor}
          matrixMoving={matrixMoving}
          setMatrixMoving={setMatrixMoving}
          matrixMouseEffect={matrixMouseEffect}
          setMatrixMouseEffect={setMatrixMouseEffect}
          matrixTwinkleEffect={matrixTwinkleEffect}
          setMatrixTwinkleEffect={setMatrixTwinkleEffect}
          matrixTwinkleSpeed={matrixTwinkleSpeed}
          setMatrixTwinkleSpeed={setMatrixTwinkleSpeed}
          isDark={isDark}
          headerPosition={headerPosition}
          setHeaderPosition={setHeaderPosition}
          dashboardWidth={dashboardWidth}
          setDashboardWidth={setDashboardWidth}
          dashboardBgColor={dashboardBgColor}
          setDashboardBgColor={setDashboardBgColor}
          dashboardBgOpacity={dashboardBgOpacity}
          setDashboardBgOpacity={setDashboardBgOpacity}
          isGroupsCompactLayout={isGroupsCompactLayout}
          setIsGroupsCompactLayout={setIsGroupsCompactLayout}
          isSegmentsCompactLayout={isSegmentsCompactLayout}
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
