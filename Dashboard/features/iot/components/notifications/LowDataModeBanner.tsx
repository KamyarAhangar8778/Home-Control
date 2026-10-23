"use client";

import { motion } from "motion/react";
import { CloudUpload, WifiOff } from "lucide-react";
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

  const alertLayout =
    "!grid !grid-cols-[1.25rem_minmax(0,1fr)_auto] !items-start !gap-x-3 !gap-y-1 !px-4 !py-3.5 text-right";

  const actionButtonClass =
    "inline-flex min-h-9 items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 max-sm:w-full";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 max-md:mt-6 md:mt-0">
      {lowDataMode && (
        <motion.div
          initial={animationsEnabled ? { opacity: 0, y: -8 } : {}}
          animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
          className="w-full"
        >
          <Alert dir="rtl" variant="warning" className={alertLayout}>
            <WifiOff aria-hidden="true" className="!col-start-1 !row-start-1 !mt-0.5 !size-5" />
            <AlertTitle className="!col-start-2 !row-start-1 !min-h-0 !line-clamp-none min-w-0 break-words text-sm font-semibold leading-5">
              حالت صرفه‌جویی در مصرف اینترنت فعال است
            </AlertTitle>
            <AlertDescription className="!col-start-2 !row-start-2 min-w-0 break-words whitespace-normal text-xs leading-6">
              دریافت خودکار داده‌ها متوقف شده است.
            </AlertDescription>
            <AlertAction className="max-sm:w-full">
              <motion.button
                type="button"
                onClick={refetchIot}
                whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
                className={actionButtonClass}
              >
                به‌روزرسانی کنونی
              </motion.button>
            </AlertAction>
          </Alert>
        </motion.div>
      )}

      {manualSaveMode && unsavedChangesCount > 0 && (
        <motion.div
          initial={animationsEnabled ? { opacity: 0, y: -8 } : {}}
          animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
          className="w-full"
        >
          <Alert dir="rtl" variant="warning" className={alertLayout}>
            <CloudUpload aria-hidden="true" className="!col-start-1 !row-start-1 !mt-0.5 !size-5" />
            <AlertTitle className="!col-start-2 !row-start-1 !min-h-0 !line-clamp-none min-w-0 break-words text-sm font-semibold leading-5">
              تغییرات ذخیره‌نشده
            </AlertTitle>
            <AlertDescription className="!col-start-2 !row-start-2 min-w-0 break-words whitespace-normal text-xs leading-6">
              {unsavedChangesCount} تغییر هنوز در حافظه ابری کلودفلر ذخیره نشده است.
            </AlertDescription>
            <AlertAction className="max-sm:w-full">
              <motion.button
                type="button"
                onClick={triggerCloudflarePush}
                disabled={!triggerCloudflarePush}
                whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
                className={actionButtonClass}
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
