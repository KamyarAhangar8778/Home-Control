"use client";

import { CheckCircle, XCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { soundManager } from "@/lib/audio";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/reui/alert";

/**
 * Displays ESP32 acknowledgement feedback using the shared ReUI Alert styling.
 * Toasts remain transient and can also be dismissed manually.
 */
export default function ToastNotification() {
  const { toast, clearToast } = useIoTStore();

  useEffect(() => {
    if (!toast) return;

    if (toast.type === "success") {
      soundManager.playSuccess();
    } else {
      soundManager.playError();
    }

    const timer = setTimeout(clearToast, 3500);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="pointer-events-auto fixed bottom-6 left-6 z-[200] w-[calc(100vw-3rem)] max-w-sm"
        >
          <Alert
            dir="rtl"
            variant={toast.type === "success" ? "success" : "destructive"}
            className="!grid !grid-cols-[auto_minmax(0,1fr)_auto] !items-start !gap-x-3 !gap-y-1 !px-4 !py-3.5 text-right shadow-lg"
          >
            <div className="!col-start-2 !row-start-1 min-w-0 text-right">
              <AlertTitle className="!col-start-1 !row-start-1 !m-0 !min-h-0 !line-clamp-none break-words text-right text-sm font-semibold leading-5">
                {toast.type === "success" ? "عملیات موفق" : "خطا در انجام عملیات"}
              </AlertTitle>
            </div>
            <div className="!col-start-2 !row-start-2 min-w-0 text-right">
              <AlertDescription className="!col-start-1 !row-start-2 !m-0 min-w-0 break-words whitespace-normal text-right text-xs leading-6">
                {toast.message}
              </AlertDescription>
            </div>
            {toast.type === "success" ? (
              <CheckCircle aria-hidden="true" className="!col-start-1 !row-start-1 !mt-0.5 !size-5" />
            ) : (
              <XCircle aria-hidden="true" className="!col-start-1 !row-start-1 !mt-0.5 !size-5" />
            )}
            <AlertAction className="!col-start-3 !row-start-1 !mt-0 !self-start">
              <button
                type="button"
                onClick={clearToast}
                aria-label="بستن اعلان"
                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </AlertAction>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
