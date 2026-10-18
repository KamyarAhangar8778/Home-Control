"use client";

import React from "react";
import WelcomePortal from "@/features/iot/components/welcome-portal";
import IoTWorkspace from "@/features/iot/components/IoTWorkspace";
import { WorkspaceSkeleton } from "@/features/iot/components/workspace";
import MacroSidebar from "../widgets/MacroSidebar";
import GroupFilterSelector from "@/components/MasterHeader/GroupFilterSelector";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useWorkspaceSwipe } from "../../hooks/useWorkspaceSwipe";
import { useDashboardLayout } from "../../hooks/useDashboardLayout";

export default function DashboardWorkspace() {
  const {
    sensors,
    isLoadingIoT,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleGroupColsChange,
    handleAddPlaceholder,
    handleRemoveGroup,
    handleRemoveSegment,
    handleTogglePin,
    handleSetPinState,
    handleUpdateSegmentMode,
    handleUpdateSegmentAutoOff,
    handleUpdateSegmentRule,
    handleSetupPlaceholder,
    isFullyReady,
  } = useDashboard();

  const isDark = useIoTStore(s => s.isDark);
  const accent3 = useIoTStore(s => s.accent3);
  const accent4 = useIoTStore(s => s.accent4);
  const setIsMenuOpen = useIoTStore(s => s.setIsMenuOpen);
  const setIsModulesMenuOpen = useIoTStore(s => s.setIsModulesMenuOpen);
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const headerPosition = useIoTStore(s => s.headerPosition);
  const dashboardWidth = useIoTStore(s => s.dashboardWidth);
  const isGroupsCompactLayout = useIoTStore(s => s.isGroupsCompactLayout);
  const isSegmentsCompactLayout = useIoTStore(s => s.isSegmentsCompactLayout);
  const activeSegmentId = useIoTStore(s => s.activeSegmentId);
  const activeGroupId = useIoTStore(s => s.activeGroupId);

  const segmentsLength = useIoTStore(s => s.segments.length);
  const selectedGroupFilter = useIoTStore(s => s.selectedGroupFilter);
  const setSelectedGroupFilter = useIoTStore(s => s.setSelectedGroupFilter);
  const groupsOrder = useIoTStore(s => s.groupsOrder);
  const groupsCols = useIoTStore(s => s.groupsCols);
  const groupConfigs = useIoTStore(s => s.groupConfigs);

  const { onTouchStart, onTouchMove, onTouchEnd } = useWorkspaceSwipe(selectedGroupFilter, setSelectedGroupFilter, groupsOrder);
  const { innerWidthClass, outerWidthClass } = useDashboardLayout(dashboardWidth);

  const isLeftHeader = headerPosition === "left";

  return (
    <div 
      className={`w-full flex ${isLeftHeader ? "flex-col items-center" : "flex-row-reverse items-start justify-center gap-6"} ${outerWidthClass} mx-auto transition-all duration-500`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="hidden lg:block pt-[115px]">
        <React.Suspense fallback={<div className="w-20 lg:w-24 shrink-0 bg-transparent h-full" />}><MacroSidebar /></React.Suspense>
      </div>
      <main className={`flex-1 flex flex-col justify-center items-center text-center ${innerWidthClass} mx-auto space-y-8 py-4 w-full relative transition-all duration-500`}>
        {!isFullyReady ? (
          <div className="w-full flex flex-col gap-4">
            <div className="-mt-6 sm:-mt-10 mb-2 w-full flex justify-center">
               <div className="w-32 h-10 bg-[var(--card-bg)] rounded-2xl animate-pulse border border-[var(--border-color)]" />
            </div>
            <WorkspaceSkeleton groupsCols={groupsCols} />
          </div>
        ) : segmentsLength === 0 ? (
          <React.Suspense fallback={<div className="w-full h-96 flex items-center justify-center"><div className="w-12 h-12 rounded-full border-2 border-[var(--accent3)] border-t-transparent animate-spin" /></div>}><WelcomePortal
            setIsMenuOpen={setIsMenuOpen}
            setIsModulesMenuOpen={setIsModulesMenuOpen}
            accent3={accent3}
            accent4={accent4}
            animationsEnabled={animationsEnabled}
            isDark={isDark}
          /></React.Suspense>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="-mt-6 sm:-mt-10 mb-2 w-full flex justify-center">
              <div className="block md:hidden w-full">
                <React.Suspense fallback={<div className="h-16 w-full" />}><MacroSidebar forceHorizontal={true} /></React.Suspense>
              </div>
              <div className="hidden md:flex w-full justify-center">
                <GroupFilterSelector
                  groupsOrder={groupsOrder}
                  selectedGroupFilter={selectedGroupFilter}
                  setSelectedGroupFilter={setSelectedGroupFilter}
                  animationsEnabled={animationsEnabled}
                />
              </div>
            </div>
            
            <IoTWorkspace
              sensors={sensors}
              groupsOrder={groupsOrder}
              groupsCols={groupsCols}
              groupConfigs={groupConfigs}
              isLoadingIoT={isLoadingIoT}
              activeSegmentId={activeSegmentId}
              activeGroupId={activeGroupId}
              animationsEnabled={animationsEnabled}
              selectedGroupFilter={selectedGroupFilter}
              isGroupsCompactLayout={isGroupsCompactLayout}
              isSegmentsCompactLayout={isSegmentsCompactLayout}
              dashboardWidth={dashboardWidth}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragEnd={handleDragEnd}
              handleGroupColsChange={handleGroupColsChange}
              handleAddPlaceholder={handleAddPlaceholder}
              handleRemoveGroup={handleRemoveGroup}
              handleRemoveSegment={handleRemoveSegment}
              handleTogglePin={handleTogglePin}
              handleSetPinState={handleSetPinState}
              handleUpdateSegmentMode={handleUpdateSegmentMode}
              handleUpdateSegmentAutoOff={handleUpdateSegmentAutoOff}
              handleUpdateSegmentRule={handleUpdateSegmentRule}
              handleSetupPlaceholder={handleSetupPlaceholder}
            />
          </div>
        )}
      </main>
    </div>
  );
}
