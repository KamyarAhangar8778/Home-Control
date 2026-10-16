import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { SegmentData } from "../core/types";

interface SegmentControlsProps {
  segment: SegmentData;
  mode: "switch" | "push";
  onUpdateSegmentMode: (id: string, mode: "switch" | "push") => void;
  onUpdateSegmentAutoOff?: (id: string, autoOff: number) => void;
  countdown?: number | null;
  showAutoOffMenu: boolean;
  setShowAutoOffMenu: (val: boolean) => void;
  autoOffButtonRef: React.RefObject<HTMLButtonElement | null>;
  autoOffMenuRef: React.RefObject<HTMLDivElement | null>;
}

const formatTime = (seconds: number) => {
  if (seconds === 0) return "غیرفعال";
  if (seconds < 60) return `${seconds} ثانیه`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m} دقیقه`;
  return `${m} دقیقه و ${s} ثانیه`;
};

export default function SegmentControls({
  segment,
  mode,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  countdown,
  showAutoOffMenu,
  setShowAutoOffMenu,
  autoOffButtonRef,
  autoOffMenuRef,
}: SegmentControlsProps) {
  const autoOffValue = segment.auto_off || 0;

  return (
    <div
      className="flex items-center bg-white dark:bg-slate-950 border border-black dark:border-slate-800 p-[3px] rounded-full shadow-sm relative"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => onUpdateSegmentMode(segment.id, "switch")}
        className={`px-2.5 py-1 text-[9.5px] font-sans font-extrabold transition-all duration-150 cursor-pointer select-none rounded-full ${
          mode === "switch"
            ? "bg-[var(--accent3)] text-black font-black shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
            : "text-slate-600 md:hover:text-slate-900 dark:text-gray-400 dark:md:hover:text-white"
        }`}
        title="حالت سوئیچ دائمی"
      >
        سوئیچ
      </button>
      {(!segment.auto_off || segment.auto_off === 0) && (
        <button
          onClick={() => onUpdateSegmentMode(segment.id, "push")}
          className={`px-2.5 py-1 text-[9.5px] font-sans font-extrabold transition-all duration-150 cursor-pointer select-none rounded-full ${
            mode === "push"
              ? "bg-[var(--accent3)] text-black font-black shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
              : "text-slate-600 md:hover:text-slate-900 dark:text-gray-400 dark:md:hover:text-white"
          }`}
          title="حالت شستی لحظه‌ای"
        >
          شستی
        </button>
      )}

      {onUpdateSegmentAutoOff && (
        <div className="relative flex items-center ml-1 pl-1 border-l border-slate-300 dark:border-slate-700">
          <button
            ref={autoOffButtonRef}
            onClick={() => setShowAutoOffMenu(!showAutoOffMenu)}
            className={`p-1 rounded-full transition-all group/timer-btn ${
              autoOffValue > 0
                ? "text-[var(--accent3)] shadow-[0_0_8px_rgba(255,165,0,0.3)] bg-[var(--accent3)]/10"
                : "text-slate-500 md:hover:text-slate-800 dark:md:hover:text-white md:hover:bg-slate-200 dark:md:hover:bg-slate-800"
            }`}
            title="تنظیم زمان تایمر خودکار"
          >
            <motion.svg
              animate={autoOffValue > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={autoOffValue > 0 ? { repeat: Infinity, duration: 2, repeatDelay: 1 } : {}}
              className="transition-transform group-hover/timer-btn:rotate-12"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </motion.svg>
          </button>
          {countdown !== null && countdown !== undefined && (
            <span className="text-[10px] font-bold text-[var(--accent3)] mr-1 tabular-nums">
              {countdown}s
            </span>
          )}

          <AnimatePresence>
            {showAutoOffMenu && (
              <motion.div
                ref={autoOffMenuRef}
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full mt-2 left-0 w-56 bg-[var(--card-bg-solid)] backdrop-blur-xl border border-[var(--border-color)] rounded-xl shadow-xl p-3 z-50 cursor-default"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold theme-text-primary">
                    تایمر: {formatTime(autoOffValue)}
                  </span>
                  {autoOffValue > 0 && (
                    <button
                      onClick={() => onUpdateSegmentAutoOff(segment.id, 0)}
                      className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded md:hover:bg-red-500 md:hover:text-white transition-colors"
                    >
                      غیرفعال کردن
                    </button>
                  )}
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  value={autoOffValue}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    onUpdateSegmentAutoOff(segment.id, val);
                    if (val > 0 && mode === "push") {
                      onUpdateSegmentMode(segment.id, "switch");
                    }
                  }}
                  className="w-full accent-[var(--accent3)] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer hover:h-2 transition-all"
                />
                <div className="flex justify-between text-[9px] text-slate-500 mt-2 px-1 font-medium">
                  <span>خاموش</span>
                  <span>10 دقیقه</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
