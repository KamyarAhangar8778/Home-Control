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
    <div className={`flex-1 bg-transparent md:bg-[var(--card-bg-solid)] border-0 md:border md:border-[var(--border-color)] ${isSidebarCollapsed ? "px-1 md:px-2" : "px-1 md:px-5"} py-2 md:py-5 rounded-none md:rounded-xl shadow-none flex flex-col justify-between gap-4 overflow-hidden`}>
      <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 -mr-1">
        <div className="space-y-4">
          <QuickAccessControls
            setIsModulesMenuOpen={props.setIsModulesMenuOpen}
            setIsMenuOpen={props.setIsMenuOpen}
            animationsEnabled={props.animationsEnabled}
            variant="vertical"
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>

        <div className="hidden md:block space-y-3 pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-colors"
            title="قابلیت‌های بیشتر"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              {!isSidebarCollapsed && <span className="text-xs font-bold">قابلیت‌های بیشتر</span>}
            </div>
            {!isSidebarCollapsed && (
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`} />
            )}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 pt-2 pb-2">

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

      <div className="hidden md:block space-y-4 pt-4 border-t border-[var(--border-color)] shrink-0">
        <div className="hidden md:block"><ClockWidget variant="vertical" isSidebarCollapsed={isSidebarCollapsed} /></div>


      </div>
    </div>
  );
}
