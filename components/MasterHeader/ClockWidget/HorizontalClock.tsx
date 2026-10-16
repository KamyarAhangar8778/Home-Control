import React from "react";
import RealTimeClock from "./RealTimeClock";

interface HorizontalClockProps {
  time: Date;
  timeString: string;
  dateString: string;
}

export default function HorizontalClock({ time, timeString, dateString }: HorizontalClockProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl transition-all duration-350 md:hover:-translate-y-1 md:hover:shadow-md md:hover:border-[var(--accent3)] group cursor-default">
      <RealTimeClock time={time} className="w-4 h-4 text-[var(--text-tertiary)] md:group-hover:text-[var(--accent3)] transition-all duration-500 md:group-hover:rotate-180 shrink-0" />
      <div className="flex flex-col items-start justify-center">
        <span className="font-mono font-bold text-sm text-[var(--text-primary)] md:group-hover:text-[var(--accent3)] transition-colors" dir="ltr">
          {timeString}
        </span>
        <span className="text-[9px] font-bold text-[var(--text-secondary)] md:group-hover:text-[var(--text-primary)] transition-colors">
          {dateString}
        </span>
      </div>
    </div>
  );
}
