import React from "react";
import HeaderSettingsContent from "../header-settings/HeaderSettingsContent";
import { CompactLayoutToggles } from "./CompactLayoutToggles";

interface LayoutSectionProps {
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  isGroupsCompactLayout: boolean;
  setIsGroupsCompactLayout: (val: boolean) => void;
  isSegmentsCompactLayout: boolean;
  setIsSegmentsCompactLayout: (val: boolean) => void;
}

export default function LayoutSection({
  headerTitle, setHeaderTitle,
  isGroupsCompactLayout, setIsGroupsCompactLayout,
  isSegmentsCompactLayout, setIsSegmentsCompactLayout,
}: LayoutSectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 space-y-4 rounded-2xl text-right">
        <HeaderSettingsContent headerTitle={headerTitle} setHeaderTitle={setHeaderTitle} />
      </div>
      <div className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 space-y-5 rounded-2xl text-right">
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
