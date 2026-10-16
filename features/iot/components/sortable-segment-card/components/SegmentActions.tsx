import React from "react";
import { X, GripVertical } from "lucide-react";
import { SegmentData } from "../core/types";
import SegmentControls from "./SegmentControls";

interface SegmentActionsProps {
  segment: SegmentData;
  onRemove: (id: string) => void;
  attributes: any;
  listeners: any;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  onUpdateSegmentAutoOff?: (id: string, autoOff: number) => void;
  mode: "switch" | "push";
  countdown?: number | null;
  autoOffMenuProps: {
    showAutoOffMenu: boolean;
    setShowAutoOffMenu: (val: boolean) => void;
    autoOffButtonRef: React.RefObject<HTMLButtonElement | null>;
    autoOffMenuRef: React.RefObject<HTMLDivElement | null>;
  };
}

export default function SegmentActions({
  segment,
  onRemove,
  attributes,
  listeners,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  mode,
  countdown,
  autoOffMenuProps,
}: SegmentActionsProps) {
  return (
    <>
      <button
        onClick={() => onRemove(segment.id)}
        className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 text-slate-700 dark:text-gray-300 md:hover:border-[var(--accent3)] md:hover:text-[var(--accent3)] transition-all cursor-pointer rounded-lg shadow-sm"
        title="حذف این سگمنت"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div
        {...attributes}
        {...listeners}
        className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 text-slate-700 dark:text-gray-300 md:hover:border-[var(--accent3)] md:hover:text-[var(--accent3)] cursor-grab active:cursor-grabbing transition-all rounded-lg shadow-sm"
        title="کشیدن برای جابه‌جایی"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      {onUpdateSegmentMode && segment.type !== "input" && (
        <div className="mr-1.5">
          <SegmentControls
            segment={segment}
            mode={mode}
            onUpdateSegmentMode={onUpdateSegmentMode}
            onUpdateSegmentAutoOff={onUpdateSegmentAutoOff}
            countdown={countdown}
            {...autoOffMenuProps}
          />
        </div>
      )}
    </>
  );
}
