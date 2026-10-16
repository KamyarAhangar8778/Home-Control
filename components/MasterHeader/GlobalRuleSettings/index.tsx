"use client";

import React, { useState } from "react";
import { Settings2, X, Info } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { GlobalRuleSettingsProps, SegmentRule } from "./types";
import TriggerButton from "./TriggerButton";
import SegmentRuleCard from "./SegmentRuleCard";

export default function GlobalRuleSettings({ variant = "horizontal", isSidebarCollapsed }: GlobalRuleSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const segments = useIoTStore((state) => state.segments);
  const isDark = useIoTStore(s => s.isDark);
  const accent3 = useIoTStore(s => s.accent3);
  const accent4 = useIoTStore(s => s.accent4);
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const [localRules, setLocalRules] = useState<Record<string, SegmentRule>>({});

  const inputSegments = segments.filter((s) => s.type === "input");

  const backdropBackground = isDark
    ? `radial-gradient(circle at center, ${accent3}15 0%, ${accent4}08 50%, rgba(5,6,9,0.65) 100%)`
    : `radial-gradient(circle at center, ${accent3}0a 0%, ${accent4}05 50%, rgba(244,245,247,0.7) 100%)`;

  const backdropStyle: React.CSSProperties = {
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    background: backdropBackground,
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <>
      <TriggerButton 
        variant={variant} 
        isSidebarCollapsed={isSidebarCollapsed} 
        animationsEnabled={animationsEnabled}
        onClick={() => setIsOpen(true)}
      />

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={backdropStyle}
              className="fixed inset-0 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full max-w-sm bg-gradient-to-b from-[var(--drawer-gradient-from)] to-[var(--drawer-gradient-to)] border-r border-accent3-medium rounded-r-[2.5rem] shadow-2xl z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] px-6 py-8 text-right flex flex-col transition-colors duration-500"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-accent3-medium pb-4 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 theme-card-bg-solid border border-accent3-medium text-accent3 rounded-xl">
                    <Settings2
                      className={`w-4 h-4 ${animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`}
                    />
                  </div>
                  <div>
                    <h4
                      className="font-sans font-black text-sm text-accent3"
                      style={{ color: "var(--accent3)" }}
                    >
                      مدیریت شرط‌ها
                    </h4>
                    <p className="text-[9px] theme-text-muted font-sans tracking-wide uppercase">
                      Rules Configuration
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={animationsEnabled ? { scale: 1.15, rotate: 90 } : undefined}
                  whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
                  className="p-1.5 rounded-full theme-card-bg-solid border theme-border theme-text-tertiary hover:text-accent3 hover:border-accent3 transition-colors cursor-pointer focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="py-6 flex-1 space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 p-3 rounded-lg text-xs flex gap-2 items-start">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>
                    در این بخش می‌توانید برای زمان‌های مختلف نگه‌داشتن کلید (مثلاً 0، 3، 5 یا 10 ثانیه) عملیات متفاوتی تعریف کنید. 
                    شما می‌توانید برای هر وضعیت چندین عملیات بسازید تا هرکدام روی یک پایه‌ی مجزا تاثیر بگذارند.
                  </p>
                </div>

                {inputSegments.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-8">هیچ ورودی (سنسور/کلید) در داشبورد وجود ندارد.</p>
                ) : (
                  inputSegments.map(segment => {
                    const originalRule = segment.rule || { highActions: [], lowActions: [] };
                    const rule = localRules[segment.id] || { 
                      highActions: originalRule.highActions || [], 
                      lowActions: originalRule.lowActions || [] 
                    };
                    return <SegmentRuleCard key={segment.id} segment={segment} rule={rule} setLocalRules={setLocalRules} />;
                  })
                )}
              </div>
            </motion.div>
          </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
