import React from "react";

interface Props {
  dashboardBgColor: string;
  setDashboardBgColor: (val: string) => void;
  dashboardBgOpacity: number;
  setDashboardBgOpacity: (val: number) => void;
  accent3: string;
  accent4: string;
  isDark: boolean;
}

export function MatrixBgColorPicker({
  dashboardBgColor, setDashboardBgColor,
  dashboardBgOpacity, setDashboardBgOpacity,
  accent3, accent4, isDark
}: Props) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg space-y-6">
      <div>
        <label className="text-sm font-bold text-[var(--text-primary)] mb-4 block">رنگ پس‌زمینه داشبورد</label>
        <div className="flex items-center gap-3 w-full" dir="ltr">
          <button
            onClick={() => setDashboardBgColor("default")}
            className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
              dashboardBgColor === "default"
                ? "border-[var(--text-primary)] scale-[1.02] shadow-md"
                : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
            }`}
            style={{ backgroundColor: isDark ? "#050609" : "#f4f5f7" }}
            title="پیش‌فرض"
          >
            <span className="text-[10px] font-bold text-gray-500">پیش‌فرض</span>
          </button>
          <button
            onClick={() => setDashboardBgColor("#888888")}
            className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
              dashboardBgColor === "#888888"
                ? "border-[var(--text-primary)] scale-[1.02] shadow-md"
                : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
            }`}
            style={{ backgroundColor: "#888888" }}
            title="خاکستری"
          />
          <button
            onClick={() => setDashboardBgColor("accent3")}
            className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
              dashboardBgColor === "accent3"
                ? "border-[var(--text-primary)] scale-[1.02] shadow-md"
                : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
            }`}
            style={{ backgroundColor: accent3 }}
            title="رنگ سوم"
          />
          <button
            onClick={() => setDashboardBgColor("accent4")}
            className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
              dashboardBgColor === "accent4"
                ? "border-[var(--text-primary)] scale-[1.02] shadow-md"
                : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
            }`}
            style={{ backgroundColor: accent4 }}
            title="رنگ چهارم"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--border-color)]">
        <div className="flex justify-between items-center mb-4 relative z-10">
          <label className="text-sm font-bold text-[var(--text-primary)]">شفافیت پس‌زمینه داشبورد (%)</label>
          <span className="text-xs font-mono text-[var(--accent3)] bg-[var(--accent3)]/10 px-2 py-1 rounded-md">
            {dashboardBgOpacity}%
          </span>
        </div>
        <input
          type="range" min="0" max="100" step="5"
          value={dashboardBgOpacity}
          onChange={(e) => setDashboardBgOpacity(Number(e.target.value))}
          className="w-full accent-[var(--accent3)] relative z-10 cursor-pointer"
          dir="ltr"
        />
      </div>
    </div>
  );
}
