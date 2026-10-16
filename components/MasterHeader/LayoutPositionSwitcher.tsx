import React from "react";
import { PanelTop, PanelLeft } from "lucide-react";

interface LayoutPositionSwitcherProps {
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
  variant: "vertical" | "horizontal";
  isSidebarCollapsed?: boolean;
}

export default function LayoutPositionSwitcher({
  headerPosition,
  setHeaderPosition,
  variant,
  isSidebarCollapsed,
}: LayoutPositionSwitcherProps) {
  const handleTogglePosition = (pos: "top" | "left") => {
    setHeaderPosition(pos);
  };

  if (variant === "vertical") {
    return (
      <div className={`grid ${isSidebarCollapsed ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
        <button
          onClick={() => handleTogglePosition("top")}
          className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[var(--border-color)] text-[11px] font-bold text-[var(--text-tertiary)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--card-hover-bg)] transition-all"
          title="قرارگیری هدر در بالای صفحه"
        >
          <PanelTop className="w-3.5 h-3.5" />
          {!isSidebarCollapsed && <span>هدر بالا</span>}
        </button>

        <button
          onClick={() => handleTogglePosition("left")}
          className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[var(--accent4)] bg-[var(--accent4-transparent)] text-[var(--accent4)] text-[11px] font-bold transition-all"
          title="قرارگیری منو در سمت چپ"
        >
          <PanelLeft className="w-3.5 h-3.5" />
          {!isSidebarCollapsed && <span>منوی چپ</span>}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center p-0.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl shadow-inner gap-0.5 shrink-0">
      <button
        onClick={() => handleTogglePosition("top")}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--accent3)] text-black shadow-sm transition-all"
        title="نمای پادشاهی بالا"
      >
        <PanelTop className="w-3 h-3" />
        <span className="hidden sm:inline">هدر بالا</span>
      </button>
      <button
        onClick={() => handleTogglePosition("left")}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[var(--text-tertiary)] md:hover:text-[var(--text-primary)] transition-all"
        title="نمای منوی ستونی چپ"
      >
        <PanelLeft className="w-3 h-3" />
        <span className="hidden sm:inline">منوی چپ</span>
      </button>
    </div>
  );
}
