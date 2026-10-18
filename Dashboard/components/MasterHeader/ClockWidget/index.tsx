import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { getPersianDateString, getTimeString } from "./persianDateUtils";
import { ClockWidgetProps } from "./types";
import VerticalClock from "./VerticalClock";
import HorizontalClock from "./HorizontalClock";

export default function ClockWidget({ variant, isSidebarCollapsed }: ClockWidgetProps) {
  const [time, setTime] = useState<Date | null>(null);
  const isPageVisible = useIoTStore((state) => state.isPageVisible);

  useEffect(() => {
    setTime(new Date());
    
    if (!isPageVisible) return;
    
    const timer = setInterval(() => {
      setTime(prev => {
        const now = new Date();
        if (prev && prev.getSeconds() === now.getSeconds()) return prev;
        return now;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPageVisible]);

  if (!time) {
    return (
      <div className={`flex items-center justify-center p-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] ${variant === "vertical" ? "w-full" : ""}`}>
         <Clock className="w-4 h-4 text-[var(--text-muted)] animate-pulse" />
      </div>
    );
  }

  const timeString = getTimeString(time);
  const dateString = getPersianDateString(time);

  if (variant === "vertical") {
    return <VerticalClock time={time} timeString={timeString} dateString={dateString} isSidebarCollapsed={isSidebarCollapsed} />;
  }

  return <HorizontalClock time={time} timeString={timeString} dateString={dateString} />;
}
