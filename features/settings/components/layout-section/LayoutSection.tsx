import React from "react";
import HeaderSettingsContent from "../header-settings/HeaderSettingsContent";
import { DashboardWidthSetting } from "./DashboardWidthSetting";
import { CompactLayoutToggles } from "./CompactLayoutToggles";

interface LayoutSectionProps {
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  dashboardWidth: 1 | 2 | 3 | 4 | 5;
  setDashboardWidth: (val: 1 | 2 | 3 | 4 | 5) => void;
  isGroupsCompactLayout: boolean;
  setIsGroupsCompactLayout: (val: boolean) => void;
  isSegmentsCompactLayout: boolean;
  setIsSegmentsCompactLayout: (val: boolean) => void;
}

export default function LayoutSection({
  headerPosition, setHeaderPosition,
  headerTitle, setHeaderTitle,
  dashboardWidth, setDashboardWidth,
  isGroupsCompactLayout, setIsGroupsCompactLayout,
  isSegmentsCompactLayout, setIsSegmentsCompactLayout,
}: LayoutSectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 space-y-4 rounded-2xl text-right">
        <HeaderSettingsContent
          headerPosition={headerPosition}
          setHeaderPosition={setHeaderPosition}
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
        />
      </div>

      <div className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 space-y-5 rounded-2xl text-right">
        <DashboardWidthSetting 
          dashboardWidth={dashboardWidth} 
          setDashboardWidth={setDashboardWidth} 
        />
        <CompactLayoutToggles 
          isGroupsCompactLayout={isGroupsCompactLayout}
          setIsGroupsCompactLayout={setIsGroupsCompactLayout}
          isSegmentsCompactLayout={isSegmentsCompactLayout}
          setIsSegmentsCompactLayout={setIsSegmentsCompactLayout}
        />
      </div>
    </div>
  );
}
