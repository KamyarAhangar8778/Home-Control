"use client";

import React from "react";
import { WifiOff } from "lucide-react";
import { soundManager } from "@/lib/audio";

interface LowDataToggleProps {
  lowDataMode: boolean;
  setLowDataMode: (val: boolean) => void;
  animationsEnabled: boolean;
  isDark?: boolean;
}

export default function LowDataToggle({
  lowDataMode,
  setLowDataMode,
  animationsEnabled,
  isDark = true,
}: LowDataToggleProps) {
  const handleToggle = () => {
    const nextVal = !lowDataMode;
    setLowDataMode(nextVal);
    if (nextVal) soundManager.playToggleOn();
    else soundManager.playToggleOff();
  };

  return (
    <div className="border-b border-accent3-medium/10 pb-4 space-y-2">
      <p className="text-[10px] theme-text-tertiary leading-relaxed">
        اگر در مصرف اینترنت با محدودیت حجم روبرو هستید، سامانه را در حالت کم‌مصرف قرار دهید تا
        دریافت‌های خودکار متوقف شده و مصرف پس‌زمینه کاملاً مهار گردد:
      </p>

      <button
        onClick={handleToggle}
        className={`switch-toggle w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer text-right group ${
          lowDataMode
            ? isDark
              ? "bg-amber-950/20 border-accent3/60 shadow-[0_0_12px_rgba(212,175,55,0.1)]"
              : "bg-amber-50/80 border-amber-300 shadow-[0_2px_4px_rgba(212,175,55,0.06)]"
            : isDark
              ? "bg-slate-950/40 border-slate-800 hover:border-slate-700"
              : "bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm"
        }`}
      >
        {/* Text Info */}
        <div className="text-right space-y-0.5 max-w-[70%]">
          <span
            className={`font-sans font-extrabold text-xs block flex items-center gap-1 w-full justify-end transition-colors duration-300 ${
              lowDataMode
                ? isDark
                  ? "text-[rgba(212,175,55,1)]"
                  : "text-amber-600"
                : isDark
                  ? "text-gray-200"
                  : "text-slate-800"
            }`}
          >
            <span>{lowDataMode ? "حالت کم‌مصرف اینترنت: روشن" : "حالت کم‌مصرف اینترنت: خاموش"}</span>
            <WifiOff
              className={`w-3.5 h-3.5 ${lowDataMode ? "text-accent3" : isDark ? "text-gray-400" : "text-slate-500"}`}
            />
          </span>
          <span
            className={`text-[9px] block leading-normal font-sans font-medium transition-colors duration-300 ${
              isDark
                ? "text-gray-400 group-hover:text-gray-300"
                : "text-slate-500 group-hover:text-slate-600"
            }`}
          >
            {lowDataMode
              ? "غیرفعال‌سازی همگام‌سازی ۳ ثانیه‌ای زنده (دریافت اطلاعات فقط با رفرش دستی شما)"
              : "همگام‌سازی هوشمند زنده و پویای هر ۳ ثانیه از سرور ابری"}
          </span>
        </div>

        {/* Modern Premium Toggle Switch */}
        <div
          className={`relative inline-flex h-6 w-11 rounded-full p-0.5 items-center transition-all duration-300 shrink-0 cursor-pointer focus:outline-none select-none hover:scale-110 active:scale-95 hover:brightness-110 ${
            lowDataMode
              ? "bg-[var(--accent4)] shadow-[0_0_8px_var(--accent4-transparent)]"
              : isDark
                ? "bg-black/30 border border-slate-800/40"
                : "bg-slate-200 border border-slate-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow-md transform ${
              animationsEnabled
                ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                : ""
            } ${lowDataMode ? "-translate-x-5" : "translate-x-0"}`}
          />
        </div>
      </button>
    </div>
  );
}
