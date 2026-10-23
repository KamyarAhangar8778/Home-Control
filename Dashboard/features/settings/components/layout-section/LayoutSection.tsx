import React from "react";
import HeaderSettingsContent from "../header-settings/HeaderSettingsContent";

interface LayoutSectionProps {
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
}

export default function LayoutSection({
  headerTitle, setHeaderTitle,
}: LayoutSectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 space-y-4 rounded-2xl text-right">
        <HeaderSettingsContent headerTitle={headerTitle} setHeaderTitle={setHeaderTitle} />
      </div>
    </div>
  );
}
