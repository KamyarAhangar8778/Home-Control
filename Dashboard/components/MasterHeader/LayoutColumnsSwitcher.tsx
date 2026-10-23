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
      <div className="flex items-center justify-between p-2 bg-[var(--sidebar-control-bg)] border border-[var(--sidebar-border)] rounded-md gap-2">
        <span className="text-[10px] text-[var(--sidebar-muted)] font-bold">ستون‌ها:</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((cols) => (
            <button
              type="button"
              key={cols}
              onClick={() => setGroupsCols(cols)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                groupsCols === cols
                  ? "bg-[var(--sidebar-active)] text-[var(--sidebar-text)]"
                  : "text-[var(--sidebar-muted)] md:hover:text-[var(--sidebar-text)]"
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
    <div className={`flex ${variant === "vertical" && isSidebarCollapsed ? "flex-col" : "items-center"} bg-[var(--sidebar-control-bg)] border border-[var(--sidebar-border)] p-0.5 rounded-md text-xs gap-0.5 shrink-0`}>
      <button
        type="button"
        onClick={() => setGroupsCols(1)}
        aria-label="تک ستون"
        className={`p-1.5 flex items-center justify-center rounded transition-colors ${
          groupsCols === 1
            ? "bg-[var(--sidebar-active)] text-[var(--sidebar-text)] font-bold"
            : "text-[var(--sidebar-muted)] md:hover:text-[var(--sidebar-text)]"
        }`}
        title="نمایش تک ستونه"
      >
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <rect width="18" height="6" x="3" y="5" rx="3" />
          <rect width="18" height="6" x="3" y="13" rx="3" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setGroupsCols(2)}
        aria-label="دو ستون"
        className={`p-1.5 flex items-center justify-center rounded transition-colors ${
          groupsCols === 2
            ? "bg-[var(--sidebar-active)] text-[var(--sidebar-text)] font-bold"
            : "text-[var(--sidebar-muted)] md:hover:text-[var(--sidebar-text)]"
        }`}
        title="نمایش دو ستونه"
      >
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <circle cx="7" cy="7" r="3" />
          <circle cx="17" cy="7" r="3" />
          <circle cx="7" cy="17" r="3" />
          <circle cx="17" cy="17" r="3" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setGroupsCols(3)}
        aria-label="سه ستون"
        className={`p-1.5 flex items-center justify-center rounded transition-colors ${
          groupsCols === 3
            ? "bg-[var(--sidebar-active)] text-[var(--sidebar-text)] font-bold"
            : "text-[var(--sidebar-muted)] md:hover:text-[var(--sidebar-text)]"
        }`}
        title="نمایش سه ستونه"
      >
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
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
