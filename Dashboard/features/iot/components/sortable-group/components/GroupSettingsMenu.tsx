import React from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import LayoutSelector from "./LayoutSelector";

interface GroupSettingsMenuProps {
  id: string;
  isSettingsOpen: boolean;
  isCompact: boolean;
  isMobile: boolean;
  maxCols: number;
  onColsChange: (cols: number) => void;
  onAddPlaceholder: (groupId: string) => void;
  setIsSettingsOpen: (open: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

export default function GroupSettingsMenu({
  id,
  isSettingsOpen,
  isCompact,
  isMobile,
  maxCols,
  onColsChange,
  onAddPlaceholder,
  setIsSettingsOpen,
  menuRef,
}: GroupSettingsMenuProps) {
  if (!isSettingsOpen) return null;

  return (
    <motion.div
      ref={menuRef}
      className="absolute top-[calc(100%+8px)] z-[100]"
      onPointerDown={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.95, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ right: 0 }}
    >
      <div className="relative w-auto bg-[var(--card-bg-solid)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-xl p-3 sm:p-4 flex flex-col gap-3 md:hover:-translate-y-1.5 transition-transform duration-300 cursor-default">
        {/* Hover glow overlay — opacity-only, GPU composited */}
        <div className="absolute inset-0 rounded-2xl border border-[var(--accent3)] shadow-2xl opacity-0 transition-opacity duration-300 md:hover:opacity-100 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between border-b border-[var(--border-color)] pb-2 min-w-[150px] sm:min-w-[180px]">
          <span className="font-sans font-extrabold theme-text-primary text-xs sm:text-sm truncate max-w-[180px] sm:max-w-[220px]">
            {id}
          </span>
        </div>
        {(isCompact || isMobile) && (
          <div className="relative z-10 flex flex-col gap-2 w-full">
            <span className="text-[10px] font-bold text-slate-500">
              تعداد ستون‌های سگمنت
            </span>
            <LayoutSelector
              maxCols={maxCols}
              onColsChange={(cols) => {
                onColsChange(cols);
                setIsSettingsOpen(false);
              }}
              parentGroupsCols={3}
              fullWidth={true}
            />
          </div>
        )}

        <div
          className={`relative z-10 flex flex-col gap-2 ${(isCompact || isMobile) ? "pt-2 border-t border-[var(--border-color)]" : ""}`}
        >
          <button
            onClick={() => {
              onAddPlaceholder(id);
              setIsSettingsOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors w-full"
          >
            <Plus className="w-4 h-4" />
            <span>اضافه کردن سگمنت</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
