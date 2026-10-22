import React from "react";
import RealTimeClock from "./RealTimeClock";

interface VerticalClockProps {
  time: Date;
  timeString: string;
  dateString: string;
  isSidebarCollapsed?: boolean;
}

export default function VerticalClock({ time, timeString, dateString, isSidebarCollapsed }: VerticalClockProps) {
  if (isSidebarCollapsed) {
    return (
      <div className="w-full flex justify-center items-center p-2.5 bg-[var(--sidebar-control-bg)] md:hover:bg-[var(--sidebar-hover)] border border-[var(--sidebar-border)] rounded-md text-[var(--sidebar-muted)] md:hover:text-[var(--sidebar-text)] transition-colors group" title={dateString}>
        <RealTimeClock time={time} className="w-4 h-4 shrink-0" />
      </div>
    );
  }
  
  return (
    <div className="w-full flex flex-col items-center justify-center p-3 gap-1 bg-[var(--sidebar-control-bg)] md:hover:bg-[var(--sidebar-hover)] border border-[var(--sidebar-border)] rounded-md transition-colors group">
      <div className="flex items-center gap-2 text-[var(--sidebar-text)] mb-1">
        <RealTimeClock time={time} className="w-4 h-4" />
        <span className="font-mono font-bold text-lg tracking-widest" dir="ltr">{timeString}</span>
      </div>
      <div className="text-[11px] font-bold text-[var(--sidebar-muted)] md:hover:text-[var(--sidebar-text)] transition-colors">
        {dateString}
      </div>
      <div className="text-[9px] text-[var(--sidebar-muted)] transition-colors mt-0.5">
        تاریخ شاهنشاهی
      </div>
    </div>
  );
}
