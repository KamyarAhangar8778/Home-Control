import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sliders, Trash2 } from "lucide-react";
import { Segment } from "../core/types";

interface SegmentListProps {
  segments: Segment[];
  onRemoveSegment: (id: string) => void;
}

export default function SegmentList({ segments, onRemoveSegment }: SegmentListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
        <Sliders className="w-3.5 h-3.5 text-[var(--accent3)]" />
        <span className="text-[11px] font-bold theme-text-secondary">
          سگمنت‌های مستقر در پیش‌نمایش ({segments.length})
        </span>
      </div>

      {segments.length === 0 ? (
        <p className="text-[10px] theme-text-muted py-3 text-center border border-dashed border-[var(--border-color)] rounded-xl bg-black/10">
          هیچ سگمنت سفارشی تعریف نشده است.
        </p>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <AnimatePresence>
            {segments.map((seg) => (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={seg.id}
                className="p-3 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl flex items-center justify-between gap-3 text-right group md:hover:border-[var(--accent3-medium)] transition-all shadow-sm"
              >
                <button
                  onClick={() => onRemoveSegment(seg.id)}
                  className="p-1.5 bg-red-500/10 md:hover:bg-red-500/20 text-red-500 md:hover:text-red-400 transition-colors cursor-pointer rounded-lg"
                  title="حذف سگمنت"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold theme-text-primary truncate">
                    {seg.title}
                  </span>
                  <span className="block text-[9px] theme-text-muted font-mono" dir="ltr">
                    GPIO {seg.pin} • {seg.mode === "push" ? "MOMENTARY PUSH" : "ON/OFF SWITCH"}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
