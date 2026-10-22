"use client";

import React from "react";
import { motion } from "motion/react";
import { WifiOff } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/reui/alert";

interface LowDataModeBannerProps {
  lowDataMode: boolean;
  animationsEnabled: boolean;
  refetchIot: () => void;
  manualSaveMode?: boolean;
  unsavedChangesCount?: number;
  triggerCloudflarePush?: () => void;
}

export default function LowDataModeBanner({
  lowDataMode,
  animationsEnabled,
  refetchIot,
  manualSaveMode = false,
  unsavedChangesCount = 0,
  triggerCloudflarePush,
}: LowDataModeBannerProps) {
  if (!lowDataMode && !(manualSaveMode && unsavedChangesCount > 0)) return null;

  return (
    <div
      className="flex flex-col gap-2 max-w-5xl md:mt-0 max-md:mt-6 mx-auto w-full"
    >
      {lowDataMode && (
        <motion.div
          initial={animationsEnabled ? { opacity: 0, y: -10 } : {}}
          animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
          className="w-full"
        >
          <Alert
            variant="warning"
            className="!flex flex-col sm:flex-row-reverse items-center justify-between gap-4 !border-[var(--accent3-medium)]/85 !bg-[var(--card-bg-solid)] px-6 py-4 text-right shadow-md transition-all duration-300 md:hover:border-[var(--accent3)] md:hover:shadow-[0_0_15px_var(--accent3-transparent)]"
          >
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-[var(--accent3)] animate-pulse shrink-0" />
            <div className="min-w-0">
              <AlertTitle className="!col-start-auto !min-h-0 !line-clamp-none text-[12.5px] font-sans font-extrabold text-[var(--text-primary)] drop-shadow-sm">
                حالت صرفه‌جویی در مصرف اینترنت فعال است
              </AlertTitle>
              <AlertDescription className="!col-start-auto text-[12px] text-[var(--text-secondary)]">
                دریافت خودکار داده‌ها متوقف شده است.
              </AlertDescription>
            </div>
          </div>
          <AlertAction className="max-sm:w-full">
            <motion.button
              type="button"
              onClick={refetchIot}
              whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
              className="px-5 py-2.5 bg-[var(--accent3)] text-black md:hover:bg-[var(--accent3)]/90 font-sans font-extrabold transition-all text-xs cursor-pointer select-none rounded-xl shadow-md max-sm:w-full"
            >
              به‌روزرسانی کنونی
            </motion.button>
          </AlertAction>
          </Alert>
        </motion.div>
      )}

      {manualSaveMode && unsavedChangesCount > 0 && (
        <motion.div
          initial={animationsEnabled ? { opacity: 0, y: -10 } : {}}
          animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
          className="w-full"
        >
          <Alert
            variant="success"
            className="!flex flex-col sm:flex-row-reverse items-center justify-between gap-4 !border-emerald-500/40 !bg-emerald-950/20 px-6 py-4 text-right shadow-md transition-all duration-300 md:hover:border-emerald-500 md:hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0">
              {unsavedChangesCount}
            </div>
            <div className="min-w-0">
              <AlertTitle className="!col-start-auto !min-h-0 !line-clamp-none text-[12.5px] font-sans font-extrabold text-emerald-400 drop-shadow-sm">
                تغییرات ذخیره‌نشده
              </AlertTitle>
              <AlertDescription className="!col-start-auto text-[12px] text-emerald-300/90">
                تغییرات داشبورد هنوز در حافظه ابری کلودفلر ذخیره نشده است.
              </AlertDescription>
            </div>
          </div>
          <AlertAction className="max-sm:w-full">
            <motion.button
              type="button"
              onClick={triggerCloudflarePush}
              disabled={!triggerCloudflarePush}
              whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
              className="px-5 py-2.5 bg-emerald-500 text-black md:hover:bg-emerald-400 font-sans font-extrabold transition-all text-xs cursor-pointer select-none rounded-xl shadow-md max-sm:w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              ذخیره‌سازی تغییرات
            </motion.button>
          </AlertAction>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
