import React from "react";
import { Columns2, LayoutGrid } from "lucide-react";

interface LayoutColumnsSwitcherProps {
  groupsCols: number;
  setGroupsCols: (val: number) => void;
  variant: "vertical" | "horizontal";
  isSidebarCollapsed?: boolean;
}

export default function LayoutColumnsSwitcher({
  groupsCols,
  setGroupsCols,
  variant,
  isSidebarCollapsed,
}: LayoutColumnsSwitcherProps) {
  if (variant === "vertical" && !isSidebarCollapsed) {
    return (
      <div className="flex items-center justify-between p-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg gap-2">
        <span className="text-[10px] text-[var(--text-tertiary)] font-bold">ستون‌ها:</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((cols) => (
            <button
              key={cols}
              onClick={() => setGroupsCols(cols)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                groupsCols === cols
                  ? "bg-[var(--accent3)] text-black"
                  : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)]"
              }`}
            >
              {cols} ستون
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${variant === "vertical" && isSidebarCollapsed ? "flex-col" : "items-center"} bg-[var(--bg-main)] border border-[var(--border-color)] p-0.5 rounded-xl text-xs gap-0.5 shrink-0`}>
      <button
        onClick={() => setGroupsCols(1)}
        aria-label="تک ستون"
        className={`p-1.5 flex items-center justify-center rounded-lg transition-all ${
          groupsCols === 1
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)]"
        }`}
        title="نمایش تک ستونه"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <rect width="18" height="6" x="3" y="5" rx="3" />
          <rect width="18" height="6" x="3" y="13" rx="3" />
        </svg>
      </button>
      <button
        onClick={() => setGroupsCols(2)}
        aria-label="دو ستون"
        className={`p-1.5 flex items-center justify-center rounded-lg transition-all ${
          groupsCols === 2
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)]"
        }`}
        title="نمایش دو ستونه"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <circle cx="7" cy="7" r="3" />
          <circle cx="17" cy="7" r="3" />
          <circle cx="7" cy="17" r="3" />
          <circle cx="17" cy="17" r="3" />
        </svg>
      </button>
      <button
        onClick={() => setGroupsCols(3)}
        aria-label="سه ستون"
        className={`p-1.5 flex items-center justify-center rounded-lg transition-all ${
          groupsCols === 3
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)]"
        }`}
        title="نمایش سه ستونه"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <circle cx="5" cy="7" r="2" />
          <circle cx="12" cy="7" r="2" />
          <circle cx="19" cy="7" r="2" />
          <circle cx="5" cy="17" r="2" />
          <circle cx="12" cy="17" r="2" />
          <circle cx="19" cy="17" r="2" />
        </svg>
      </button>
    </div>
  );
}
