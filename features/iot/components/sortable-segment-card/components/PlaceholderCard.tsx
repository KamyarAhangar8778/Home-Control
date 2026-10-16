import React from "react";
import { motion } from "motion/react";
import { X, Plus, GripVertical } from "lucide-react";
import { SegmentData } from "../core/types";

interface PlaceholderCardProps {
  segment: SegmentData;
  onRemove: (id: string) => void;
  onSetupPlaceholder?: (id: string) => void;
  attributes: any;
  listeners: any;
  isCompact: boolean;
  isUltraCompact: boolean;
  animationsEnabled?: boolean;
}

export default function PlaceholderCard({
  segment,
  onRemove,
  onSetupPlaceholder,
  attributes,
  listeners,
  isCompact,
  isUltraCompact,
  animationsEnabled = true,
}: PlaceholderCardProps) {
  return (
    <motion.div
      className="w-full h-full relative"
      layout={animationsEnabled ? "position" : false}
      transition={animationsEnabled ? { type: "spring", stiffness: 380, damping: 32 } : undefined}
      initial={animationsEnabled ? { opacity: 0, scale: 0.93, y: 10 } : false}
      animate={animationsEnabled ? { opacity: 1, scale: 1, y: 0 } : false}
      exit={
        animationsEnabled
          ? { opacity: 0, scale: 0.85, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
          : undefined
      }
    >
      <div className="absolute top-2 left-2 z-20 flex gap-1.5">
        <button
          onClick={() => onRemove(segment.id)}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 md:hover:bg-[var(--accent3-transparent)] dark:md:hover:bg-[var(--accent3-transparent)] text-slate-700 dark:text-gray-300 md:hover:text-[var(--accent3)] transition-colors cursor-pointer rounded-lg shadow-sm"
          title="حذف جایگاه خالی"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <div
          {...attributes}
          {...listeners}
          className="p-1.5 bg-slate-200/90 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 md:hover:bg-[var(--accent3-transparent)] dark:md:hover:bg-[var(--accent3-transparent)] text-slate-700 dark:text-gray-300 md:hover:text-[var(--accent3)] cursor-grab active:cursor-grabbing transition-colors rounded-lg shadow-sm"
          title="کشیدن جایگاه"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>
      {/* Translate lives here — GPU composited, never causes paint */}
      <div className="w-full h-full md:hover:-translate-y-1.5 transition-transform duration-350 rounded-2xl group/ph-card">
        <button
          onClick={() => onSetupPlaceholder && onSetupPlaceholder(segment.id)}
          className={`relative w-full h-full border-2 border-dashed border-[var(--accent3-medium)]/30 bg-[var(--card-bg)] flex flex-col items-center justify-center gap-2 cursor-pointer text-center rounded-2xl overflow-hidden ${
            isUltraCompact
              ? "p-3 min-h-[90px]"
              : isCompact
                ? "p-4 min-h-[128px]"
                : "p-6 min-h-[178px]"
          }`}
        >
          {/* Hover glow overlay — opacity-only, GPU composited */}
          <div className="absolute inset-0 rounded-2xl border border-[var(--accent3)] shadow-xl opacity-0 transition-opacity duration-350 md:group-hover/ph-card:opacity-100 pointer-events-none" />

          <div
            className="relative z-10 p-2 bg-[var(--accent3-transparent)] text-[var(--accent3)]"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          >
            <Plus className="w-4 h-4" />
          </div>
          {!isUltraCompact && (
            <div className="relative z-10">
              <span className="block font-sans font-bold text-xs md:text-sm theme-text-primary">
                {isCompact ? "تعیین سگمنت" : "جایگذاری سگمنت در اینجا"}
              </span>
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
}
