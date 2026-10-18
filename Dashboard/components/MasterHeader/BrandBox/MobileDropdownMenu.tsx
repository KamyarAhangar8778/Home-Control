import React, { useState, useRef, useEffect } from "react";
import { Moon, Sun, Settings, Bot, Columns, MoreVertical, Layers } from "lucide-react";
import LayoutColumnsSwitcher from "../LayoutColumnsSwitcher";
import { useIoTStore } from '@/features/iot/hooks/useIoTStore';
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { AnimatePresence, motion } from "motion/react";
import { BrandBoxProps } from "./types";

interface MobileMenuProps extends Omit<BrandBoxProps, "headerTitle" | "variant" | "groupsOrder" | "selectedGroupFilter" | "setSelectedGroupFilter"> {}

export default function MobileDropdownMenu({
  isDark,
  setIsDark,
  animationsEnabled,
  setIsModulesMenuOpen,
  setIsMenuOpen,
  groupsCols,
  setGroupsCols,
}: MobileMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const setIsAutomationsMenuOpen = useIoTStore(s => s.setIsAutomationsMenuOpen);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="md:hidden flex items-center gap-1 bg-[var(--bg-main)] p-1 border border-[var(--border-color)] rounded-lg relative" ref={dropdownRef}>
      {setIsDark && (
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-1.5 text-[var(--text-secondary)] md:hover:text-[var(--accent4)] rounded transition-all"
          title="تغییر تم پوسته"
          type="button"
        >
          {isDark ? (
            <Moon
              className={`w-4 h-4 text-indigo-400 ${animationsEnabled ? "animate-[bounce_3s_infinite]" : ""}`}
            />
          ) : (
            <Sun
              className={`w-4 h-4 text-orange-400 ${animationsEnabled ? "animate-[spin_20s_linear_infinite]" : ""}`}
            />
          )}
        </button>
      )}
      
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`p-1.5 rounded transition-all ${isDropdownOpen ? "bg-[var(--accent3-transparent)] text-[var(--accent3)]" : "text-[var(--text-secondary)] md:hover:text-[var(--accent3)]"}`}
        title="منوی دسترسی سریع"
        type="button"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={animationsEnabled ? { opacity: 0, scale: 0.95, originX: 0, originY: 0 } : false}
            animate={animationsEnabled ? { opacity: 1, scale: 1 } : false}
            exit={animationsEnabled ? { opacity: 0, scale: 0.95 } : undefined}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shadow-xl p-3 z-50 flex flex-col gap-3 origin-top-left"
          >
            {/* Grid for Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsAutomationsMenuOpen(true);
                  setIsDropdownOpen(false);
                }}
                type="button"
                className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] md:hover:border-[var(--accent3)] md:hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
              >
                <div className="p-1.5 rounded-lg bg-[var(--accent3-transparent)] text-[var(--accent3)]">
                  <Bot className={`w-4 h-4 ${animationsEnabled ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`} />
                </div>
                <span className="text-[10px] font-bold text-[var(--text-primary)]">اتوماسیون‌ها</span>
              </button>

              {setIsMenuOpen && (
                <button
                  onClick={() => {
                    setIsMenuOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] md:hover:border-indigo-500/50 md:hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
                >
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                    <Settings className={`w-4 h-4 ${animationsEnabled ? "md:group-hover:rotate-90 transition-transform duration-500" : ""}`} />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-primary)]">تنظیمات</span>
                </button>
              )}

              {setIsModulesMenuOpen && (
                <button
                  onClick={() => {
                    setIsModulesMenuOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  type="button"
                  className="col-span-2 flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] md:hover:border-[var(--accent4)] md:hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
                >
                  <div className="p-1.5 rounded-lg bg-[var(--accent4-transparent)] text-[var(--accent4)]">
                    <Layers className={`w-4 h-4 ${animationsEnabled ? "md:group-hover:scale-110 transition-transform duration-300" : ""}`} />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-primary)]">ماژول‌ها</span>
                </button>
              )}
            </div>

            {setGroupsCols && groupsCols !== undefined && (
              <div className="border-t border-[var(--border-color)] mt-1 pt-3 pb-1">
                <div className="px-1 mb-2 text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                  <span>تعداد ستون‌ها</span>
                  <Columns className="w-3 h-3" />
                </div>
                <div className="flex justify-center" onClick={(e) => {
                  // Only close if a button was actually clicked
                  if ((e.target as HTMLElement).closest('button')) {
                    setIsDropdownOpen(false);
                  }
                }}>
                  <LayoutColumnsSwitcher
                    groupsCols={groupsCols}
                    setGroupsCols={setGroupsCols}
                    variant="horizontal"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
