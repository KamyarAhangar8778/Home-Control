import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  animationsEnabled?: boolean;
  variant: "vertical" | "horizontal";
  isSidebarCollapsed?: boolean;
}

export default function ThemeToggle({
  isDark,
  setIsDark,
  animationsEnabled,
  variant,
  isSidebarCollapsed,
}: ThemeToggleProps) {
  if (variant === "vertical" && !isSidebarCollapsed) {
    return (
      <div className="pt-4 border-t border-[var(--border-color)]">
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-main)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] transition-all text-xs font-medium"
        >
          <span className="text-[11px] text-[var(--text-secondary)]">
            {isDark ? "حالت تیره" : "حالت روشن"}
          </span>
          <div className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500">
            {isDark ? (
              <Moon
                className={`w-4 h-4 text-indigo-400 ${animationsEnabled ? "animate-[bounce_3s_infinite]" : ""}`}
              />
            ) : (
              <Sun
                className={`w-4 h-4 text-orange-400 ${animationsEnabled ? "animate-[spin_20s_linear_infinite]" : ""}`}
              />
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={variant === "vertical" ? "pt-4 border-t border-[var(--border-color)] flex justify-center" : ""}>
      <button
        onClick={() => setIsDark(!isDark)}
        className={`${variant === "vertical" ? "w-full flex justify-center items-center" : "hidden md:flex"} p-2 md:p-2.5 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-all active:scale-[0.97]`}
        title="تغییر رنگ پوسته"
      >
        {isDark ? (
          <Sun
            className={`w-4 h-4 text-orange-400 ${animationsEnabled ? "animate-[spin_20s_linear_infinite]" : ""}`}
          />
        ) : (
          <Moon
            className={`w-4 h-4 text-indigo-400 ${animationsEnabled ? "animate-[bounce_3s_infinite]" : ""}`}
          />
        )}
      </button>
    </div>
  );
}


