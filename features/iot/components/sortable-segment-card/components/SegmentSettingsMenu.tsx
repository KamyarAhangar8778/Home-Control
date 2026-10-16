import React from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { ICON_MAP } from "@/features/iot/utils/icons";
import { BUTTON_CLIP } from "@/lib/presets";
import { SegmentData } from "../core/types";
import SegmentControls from "./SegmentControls";

interface SegmentSettingsMenuProps {
  segment: SegmentData;
  isSettingsOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  showIconInMenu: boolean;
  isPinOn: boolean;
  isUltraCompact: boolean;
  onRemove: (id: string) => void;
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

export default function SegmentSettingsMenu({
  segment,
  isSettingsOpen,
  menuRef,
  showIconInMenu,
  isPinOn,
  isUltraCompact,
  onRemove,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  mode,
  countdown,
  autoOffMenuProps,
}: SegmentSettingsMenuProps) {
  if (!isSettingsOpen) return null;

  return (
    <motion.div
      ref={menuRef}
      className="absolute top-0 z-[100]"
      onPointerDown={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-10%" }}
      animate={{ opacity: 1, scale: 1, x: "-50%", y: "-20%" }}
      exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-10%" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="relative w-[280px] sm:w-[340px] bg-[var(--card-bg-solid)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-sm p-4 flex flex-col gap-4 md:hover:-translate-y-1.5 transition-transform duration-300 cursor-default">
        {/* Hover glow overlay — opacity-only, GPU composited */}
        <div className="absolute inset-0 rounded-2xl border border-[var(--accent3)] shadow-xl opacity-0 transition-opacity duration-300 md:hover:opacity-100 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-3 text-right">
            {showIconInMenu && (
              <div
                className={`p-2 transition-colors ${isPinOn ? "bg-[var(--accent4-transparent)] text-[var(--accent4)]" : "bg-gray-800/20 text-gray-500"}`}
                style={{ clipPath: BUTTON_CLIP }}
              >
                {segment.icon ? (
                  ICON_MAP[segment.icon] ? (
                    React.createElement(ICON_MAP[segment.icon], { className: "w-4 h-4" })
                  ) : (
                    <span className="text-sm leading-none flex items-center justify-center w-4 h-4">{segment.icon}</span>
                  )
                ) : (
                  React.createElement(ICON_MAP["Cpu"], { className: "w-4 h-4" })
                )}
              </div>
            )}
            <div className="flex flex-col gap-1 text-right">
              {isUltraCompact && (
                <span className="font-sans font-extrabold theme-text-primary text-sm">
                  {segment.title}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onRemove(segment.id)}
            className="flex items-center gap-2 p-1.5 px-3 bg-red-500/10 text-red-600 md:hover:bg-red-500 md:hover:text-white transition-colors cursor-pointer rounded-lg shadow-sm"
            title="حذف سگمنت"
          >
            <span className="text-[10px] font-bold">برای حذف کردن سگمنت</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {onUpdateSegmentMode && segment.type !== "input" && (
          <div className="relative z-10 flex items-center justify-between mt-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              حالت عملکرد:
            </span>
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
      </div>
    </motion.div>
  );
}
