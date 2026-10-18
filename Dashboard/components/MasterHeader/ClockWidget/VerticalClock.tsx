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
      <div className="w-full flex justify-center items-center p-2.5 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] md:hover:text-[var(--accent3)] transition-all duration-350 md:hover:-translate-y-1 md:hover:shadow-md md:hover:border-[var(--accent3)] group" title={dateString}>
        <RealTimeClock time={time} className="w-4 h-4 transition-transform duration-500 md:group-hover:rotate-90 shrink-0" />
      </div>
    );
  }
  
  return (
    <div className="w-full flex flex-col items-center justify-center p-3 gap-1 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl transition-all duration-350 md:hover:-translate-y-1.5 md:hover:shadow-xl md:hover:border-[var(--accent3)] group">
      <div className="flex items-center gap-2 text-[var(--accent3)] mb-1">
        <RealTimeClock time={time} className="w-4 h-4 transition-transform duration-500 md:group-hover:rotate-180" />
        <span className="font-mono font-bold text-lg tracking-widest" dir="ltr">{timeString}</span>
      </div>
      <div className="text-[11px] font-bold text-[var(--text-secondary)] md:group-hover:text-[var(--text-primary)] transition-colors">
        {dateString}
      </div>
      <div className="text-[9px] text-[var(--text-muted)] md:group-hover:text-[var(--accent3)] transition-colors mt-0.5">
        تاریخ شاهنشاهی
      </div>
    </div>
  );
}
