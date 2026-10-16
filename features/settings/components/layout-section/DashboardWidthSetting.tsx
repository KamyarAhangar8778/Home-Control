import React from "react";
import { Maximize2 } from "lucide-react";

interface Props {
  dashboardWidth: 1 | 2 | 3 | 4 | 5;
  setDashboardWidth: (val: 1 | 2 | 3 | 4 | 5) => void;
}

export function DashboardWidthSetting({ dashboardWidth, setDashboardWidth }: Props) {
  return (
    <>
      <div className="flex items-center gap-2 justify-end mb-1">
        <span className="text-sm font-bold text-[var(--text-primary)]">عرض داشبورد</span>
        <Maximize2 className="w-4 h-4 text-[var(--accent4)]" />
      </div>
      
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        با تغییر این مقدار می‌توانید فضای خالی کنار داشبورد را کاهش داده و المان‌ها را عریض‌تر کنید.
      </p>

      <div className="px-2 pt-2 pb-6">
        <input
          type="range" min="1" max="5" step="1"
          value={dashboardWidth}
          onChange={(e) => setDashboardWidth(parseInt(e.target.value) as 1|2|3|4|5)}
          className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent3)] accent-[var(--accent3)]"
          dir="ltr"
        />
        <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] mt-2 font-bold px-1" dir="ltr">
          <span>متمرکز</span><span>۲</span><span>۳</span><span>۴</span><span>تمام‌عرض</span>
        </div>
      </div>
    </>
  );
}
