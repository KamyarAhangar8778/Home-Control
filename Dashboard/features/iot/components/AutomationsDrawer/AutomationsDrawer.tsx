"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, X, Info } from "lucide-react";
import { useAutomationForm } from "./hooks/useAutomationForm";
import AutomationForm from "./components/AutomationForm";
import AutomationList from "./components/AutomationList";

interface AutomationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  animationsEnabled?: boolean;
}

export default function AutomationsDrawer({ isOpen, onClose, isDark, animationsEnabled }: AutomationsDrawerProps) {
  const formHook = useAutomationForm();

  const backdropBackground = isDark ? "rgba(9, 9, 11, 0.68)" : "rgba(24, 24, 27, 0.18)";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="automations-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ backdropFilter: "blur(16px)", background: backdropBackground }}
          className="fixed inset-0 z-50 cursor-pointer"
        />
      )}
      {isOpen && (
        <motion.div
          key="automations-panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 24, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--background)] border-l border-[var(--border)] rounded-l-xl shadow-2xl z-50 flex flex-col transition-colors duration-500 overflow-hidden"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--card)] shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)]">
                <Clock className={`w-5 h-5 ${animationsEnabled ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`} />
              </div>
              <h2 className="font-bold text-lg text-[var(--foreground)]">مدیریت اتوماسیون‌ها</h2>
            </div>
            <button type="button" onClick={onClose} className="p-2 text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-[var(--accent)] rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] p-6 space-y-8">
            
            {/* Info Box */}
            <div className="bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] p-4 rounded-lg text-xs flex gap-3 items-start leading-relaxed shadow-sm">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                در این بخش می‌توانید عملیات‌های زمانی تعریف کنید. سرور ابری پادشاهی در زمان مشخص شده، چندین دستور را همزمان به دستگاه ارسال خواهد کرد.
              </p>
            </div>

            {/* Form Section */}
            <AutomationForm formHook={formHook} />

            {/* List Section */}
            <AutomationList 
              handleEdit={formHook.handleEdit} 
              handleDelete={formHook.handleDelete}
              handleToggle={formHook.handleToggle}
            />

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
