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
            variant={toast.type === "success" ? "success" : "destructive"}
            className="w-full text-right shadow-lg"
          >
            {toast.type === "success" ? (
              <CheckCircle aria-hidden="true" />
            ) : (
              <XCircle aria-hidden="true" />
            )}
            <AlertTitle>
              {toast.type === "success" ? "عملیات موفق" : "خطا در انجام عملیات"}
            </AlertTitle>
            <AlertDescription className="break-words">
              {toast.message}
            </AlertDescription>
            <AlertAction>
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
