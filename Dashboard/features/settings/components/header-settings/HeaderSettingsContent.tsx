import React from "react";
import PositionSwitcher from "./PositionSwitcher";
import TitleInput from "./TitleInput";

interface HeaderSettingsContentProps {
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
}

export default function HeaderSettingsContent({
  headerPosition,
  setHeaderPosition,
  headerTitle,
  setHeaderTitle,
}: HeaderSettingsContentProps) {
  return (
    <div className="space-y-4 text-right font-sans">
      <PositionSwitcher headerPosition={headerPosition} setHeaderPosition={setHeaderPosition} />
      <TitleInput headerTitle={headerTitle} setHeaderTitle={setHeaderTitle} />
    </div>
  );
}
