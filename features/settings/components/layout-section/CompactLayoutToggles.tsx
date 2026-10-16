import React from "react";

interface Props {
  isGroupsCompactLayout: boolean;
  setIsGroupsCompactLayout: (val: boolean) => void;
  isSegmentsCompactLayout: boolean;
  setIsSegmentsCompactLayout: (val: boolean) => void;
}

export function CompactLayoutToggles({
  isGroupsCompactLayout, setIsGroupsCompactLayout,
  isSegmentsCompactLayout, setIsSegmentsCompactLayout
}: Props) {
  return (
    <div className="border-t border-[var(--border-color)] pt-4 mt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-right flex-1 ml-4">
          <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">چیدمان فشرده گروه‌ها</h4>
          <p className="text-[10px] text-[var(--text-secondary)]">حذف فضاهای خالی بین ستون‌های گروه‌ها</p>
        </div>
        <button
          onClick={() => setIsGroupsCompactLayout(!isGroupsCompactLayout)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isGroupsCompactLayout ? "bg-[var(--accent4)]" : "bg-[var(--border-color)]"}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isGroupsCompactLayout ? "-translate-x-6" : "-translate-x-1"}`} />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-right flex-1 ml-4">
          <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">چیدمان فشرده سگمنت‌ها</h4>
          <p className="text-[10px] text-[var(--text-secondary)]">حذف فضاهای خالی درون گروه‌ها</p>
        </div>
        <button
          onClick={() => setIsSegmentsCompactLayout(!isSegmentsCompactLayout)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isSegmentsCompactLayout ? "bg-[var(--accent4)]" : "bg-[var(--border-color)]"}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isSegmentsCompactLayout ? "-translate-x-6" : "-translate-x-1"}`} />
        </button>
      </div>
    </div>
  );
}
