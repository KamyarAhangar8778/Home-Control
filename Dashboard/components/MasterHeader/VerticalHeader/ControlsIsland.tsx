import React, { useState } from "react";
import { Settings2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LayoutColumnsSwitcher from "../LayoutColumnsSwitcher";
import QuickAccessControls from "../QuickAccessControls";
import ClockWidget from "../ClockWidget";

export default function ControlsIsland({ props }: { props: any }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { isSidebarCollapsed } = props;

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between gap-5 overflow-hidden py-1">
      <div className="custom-scrollbar flex flex-col gap-5 overflow-y-auto">
        <QuickAccessControls
          setIsModulesMenuOpen={props.setIsModulesMenuOpen}
          setIsMenuOpen={props.setIsMenuOpen}
          animationsEnabled={props.animationsEnabled}
          variant="vertical"
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <div className="hidden space-y-3 border-t border-[var(--border-color)] pt-4 md:block">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-hover-bg)] hover:text-[var(--text-primary)] ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="قابلیت‌های بیشتر"
            aria-expanded={showAdvanced}
          >
            <span className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span className="text-xs font-semibold">قابلیت‌های بیشتر</span>}
            </span>
            {!isSidebarCollapsed && <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`} />}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 py-2">
                  <LayoutColumnsSwitcher
                    groupsCols={props.groupsCols}
                    setGroupsCols={props.setGroupsCols}
                    variant="vertical"
                    isSidebarCollapsed={isSidebarCollapsed}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden shrink-0 border-t border-[var(--border-color)] pt-4 md:block">
        <ClockWidget variant="vertical" isSidebarCollapsed={isSidebarCollapsed} />
      </div>
    </div>
  );
}
