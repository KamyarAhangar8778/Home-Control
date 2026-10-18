"use client";

import React from "react";
import { Columns2, LayoutGrid } from "lucide-react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

interface LayoutSelectorProps {
  maxCols: number;
  onColsChange: (cols: number) => void;
  parentGroupsCols: number;
  fullWidth?: boolean;
}

export default function LayoutSelector({
  maxCols,
  onColsChange,
  parentGroupsCols,
  fullWidth = false,
}: LayoutSelectorProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={`flex ${parentGroupsCols === 3 ? "flex-row" : "flex-col sm:flex-row"} ${fullWidth ? "w-full *:flex-1" : ""} items-center bg-[var(--bg-main)] border border-[var(--border-color)] p-0.5 sm:p-1 rounded-xl text-xs gap-0.5 shrink-0 shadow-sm`}>
      <button
        onClick={() => onColsChange(1)}
        aria-label="تک ستون"
        className={`${parentGroupsCols === 3 ? "p-0.5 sm:p-1" : "p-1.5"} flex items-center justify-center rounded-lg transition-all cursor-pointer select-none ${
          maxCols === 1
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] shadow-inner"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--card-bg-solid)]"
        }`}
        title="نمایش تک ستونه"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 sm:w-4 sm:h-4"
        >
          <rect width="18" height="6" x="3" y="5" rx="2" />
          <rect width="18" height="6" x="3" y="13" rx="2" />
        </svg>
      </button>
      <button
        onClick={() => onColsChange(2)}
        aria-label="دو ستون"
        className={`${parentGroupsCols === 3 ? "p-0.5 sm:p-1" : "p-1.5"} flex items-center justify-center rounded-lg transition-all cursor-pointer select-none ${
          maxCols === 2
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] shadow-inner"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--card-bg-solid)]"
        }`}
        title="نمایش دو ستونه"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 sm:w-4 sm:h-4"
        >
          <circle cx="7" cy="7" r="3" />
          <circle cx="17" cy="7" r="3" />
          <circle cx="7" cy="17" r="3" />
          <circle cx="17" cy="17" r="3" />
        </svg>
      </button>
      <button
        onClick={() => onColsChange(3)}
        aria-label="سه ستون"
        className={`${parentGroupsCols === 3 ? "p-0.5 sm:p-1" : "p-1.5"} flex items-center justify-center rounded-lg transition-all cursor-pointer select-none ${
          maxCols === 3
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] shadow-inner"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--card-bg-solid)]"
        }`}
        title="نمایش سه ستونه"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 sm:w-4 sm:h-4"
        >
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
