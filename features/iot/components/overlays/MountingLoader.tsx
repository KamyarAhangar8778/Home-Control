"use client";

import React from "react";
import { Cpu } from "lucide-react";

export default function MountingLoader() {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
      style={{
        background: "radial-gradient(ellipse_at_center, #0c0f1d 0%, #030408 100%)",
      }}
    >
      <div className="relative w-20 h-20 mb-8 shrink-0 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border border-dashed border-cyan-500/50 animate-spin"
          style={{ animationDuration: "12s" }}
        />
        <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
      </div>

      <div className="space-y-3 max-w-lg justify-center items-center flex flex-col">
        <h3 className="text-lg font-bold tracking-wide font-sans text-white">
          داشبورد هوشمند اینترنت اشیا
        </h3>
        <p className="text-xs text-slate-400">در حال بارگذاری ایمن ماژول‌ها و منابع سیستم...</p>

        <div className="w-48 h-1 bg-black/50 border border-gray-800/60 rounded-full overflow-hidden mx-auto mt-2">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
            style={{ width: "45%" }}
          />
        </div>
      </div>
    </div>
  );
}
