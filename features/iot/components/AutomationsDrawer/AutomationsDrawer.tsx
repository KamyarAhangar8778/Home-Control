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

  const backdropBackground = isDark
    ? `radial-gradient(circle at center, rgba(16,185,129,0.15) 0%, rgba(5,6,9,0.8) 100%)`
    : `radial-gradient(circle at center, rgba(16,185,129,0.05) 0%, rgba(244,245,247,0.7) 100%)`;

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
          className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-[var(--drawer-gradient-from)] to-[var(--drawer-gradient-to)] border-l border-[var(--accent3-medium)] rounded-l-[2.5rem] shadow-2xl z-50 flex flex-col transition-colors duration-500 overflow-hidden"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--card-bg-solid)] shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--accent3-transparent)] text-[var(--accent3)]">
                <Clock className={`w-5 h-5 ${animationsEnabled ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`} />
              </div>
              <h2 className="font-bold text-lg text-[var(--text-primary)]">مدیریت اتوماسیون‌ها</h2>
            </div>
            <button onClick={onClose} className="p-2 text-[var(--text-muted)] md:hover:text-red-500 bg-[var(--card-hover-bg)] rounded-xl transition-all md:hover:rotate-90">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] p-6 space-y-8">
            
            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 p-4 rounded-2xl text-xs flex gap-3 items-start leading-relaxed shadow-sm">
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
