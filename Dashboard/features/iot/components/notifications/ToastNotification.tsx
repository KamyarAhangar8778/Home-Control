"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { soundManager } from "@/lib/audio";

/**
 * کامپوننت نمایش اعلان‌های ACK به صورت toast
 * موقعیت: پایین-چپ صفحه
 * سبز برای موفقیت، قرمز برای خطا
 */
export default function ToastNotification() {
  const { toast, clearToast } = useIoTStore();

  // حذف خودکار بعد از 3.5 ثانیه
  useEffect(() => {
    if (!toast) return;

    if (toast.type === "success") {
      soundManager.playSuccess();
    } else {
      soundManager.playError();
    }

    const timer = setTimeout(() => {
      clearToast();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-[200] max-w-sm pointer-events-auto"
        >
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-lg border shadow-lg bg-[var(--card)] text-[var(--card-foreground)] text-right font-sans ${
              toast.type === "success"
                ? "border-[var(--success)]/40"
                : "border-[var(--destructive)]/40"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-[var(--success)] shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-[var(--destructive)] shrink-0" />
            )}
            <span className="text-xs font-bold leading-relaxed">{toast.message}</span>
            <button
              onClick={clearToast}
              className="mr-auto text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors text-[10px] font-bold cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
