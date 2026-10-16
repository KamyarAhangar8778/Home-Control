"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu } from "lucide-react";
import { BUTTON_CLIP } from "@/lib/presets";

interface SyncOverlayProps {
  isFullyReady: boolean;
  syncMessage: string;
  syncProgress: number;
  onBypass: () => void;
  workerUrl: string;
  setWorkerUrl: (url: string) => void;
  onRetry: () => void;
}

export default function SyncOverlay({
  isFullyReady,
  syncMessage,
  syncProgress,
  onBypass,
  workerUrl,
  setWorkerUrl,
  onRetry,
}: SyncOverlayProps) {
  return (
    <AnimatePresence>
      {!isFullyReady && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
          style={{
            background: "radial-gradient(ellipse_at_center, #0c0f1d 0%, #030408 100%)",
            fontFamily: "var(--font-vazir)",
          }}
        >
          {/* Modern rotating loading ring */}
          <div className="relative w-24 h-24 mb-6 shrink-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40"
            />
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>

          {/* Loader description & Persian Title */}
          <div className="space-y-3 max-w-lg flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold text-white tracking-wide font-sans">
              سامانه یکپارچه مانیتورینگ اینترنت اشیا
            </h3>
            <p className="text-xs text-slate-400">{syncMessage}</p>

            {/* Progress bar container */}
            <div className="w-64 h-1 bg-black/50 border border-gray-800/60 rounded-full overflow-hidden mx-auto relative mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${syncProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="text-[10px] text-zinc-500 font-mono mt-1">
              {syncProgress}% • CONNECTED ON STANDALONE_PORT
            </div>

            {/* Target Cloudflare Worker Status Hub */}
            <div className="w-80 mt-6 p-4 rounded-2xl border border-slate-800/80 bg-black/45 backdrop-blur-md space-y-2">
              <div className="text-center text-[10px] font-bold text-cyan-400">
                ورکر هدف کلودفلر (سرور مانیتورینگ)
              </div>
              <div className="text-[10px] font-mono text-zinc-300 select-all break-all border border-slate-800 bg-slate-950/50 p-2 rounded-xl text-center">
                {workerUrl || "https://api.agkalaa.ir"}
              </div>
              <div className="text-[9px] text-zinc-500 text-center leading-relaxed">
                در حال همگام‌سازی بلادرنگ پایه‌ها و دریافت مستمر داده‌های حافظه پایا...
              </div>
              
              <button
                type="button"
                onClick={onBypass}
                className="w-full mt-2 py-2 bg-cyan-950/40 md:hover:bg-cyan-900/60 border border-cyan-800/60 md:hover:border-cyan-500/80 text-cyan-300 md:hover:text-cyan-100 rounded-xl text-[10px] font-bold transition-all cursor-pointer font-sans"
              >
                دور زدن لودینگ و ورود به داشبورد
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
