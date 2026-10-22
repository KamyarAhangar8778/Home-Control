"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SETTINGS_TABS, SettingsDrawerProps } from "./types";
import { useSettingsAdjuster } from "./useSettingsAdjuster";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsTabsSlider } from "./SettingsTabsSlider";
import { SettingsFooter } from "./SettingsFooter";
import { SettingsTabContent } from "./SettingsTabContent";

export default function SettingsDrawer(props: SettingsDrawerProps) {
  const { isOpen, onClose, accent3, accent4, isDark, animationsEnabled, activeTab: propActiveTab, setActiveTab: propSetActiveTab } = props;
  const [localActiveTab, setLocalActiveTab] = useState<string>("layout");

  const requestedActiveTab = propActiveTab !== undefined ? propActiveTab : localActiveTab;
  const activeTab = SETTINGS_TABS.some(tab => tab.id === requestedActiveTab)
    ? requestedActiveTab
    : "layout";
  const setActiveTab = propSetActiveTab !== undefined ? propSetActiveTab : setLocalActiveTab;

  const settingsSignature = `${accent3}-${accent4}-${animationsEnabled}-${props.animationsFps}-${props.headerTitle}-${props.matrixDensity}-${props.matrixSize}-${props.matrixHoverSize}-${props.matrixOpacity}-${props.matrixColor}-${props.matrixMoving}-${props.matrixMouseEffect}-${props.matrixTwinkleEffect}-${props.matrixTwinkleSpeed}-${isDark}`;
  const { isAdjusting } = useSettingsAdjuster(isOpen, settingsSignature);

  const backdropBackground = isAdjusting
    ? "rgba(9, 9, 11, 0.08)"
    : isDark
      ? "rgba(9, 9, 11, 0.68)"
      : "rgba(24, 24, 27, 0.18)";

  const backdropStyle: React.CSSProperties = {
    backdropFilter: isAdjusting ? "blur(1px)" : "blur(16px)",
    WebkitBackdropFilter: isAdjusting ? "blur(1px)" : "blur(16px)",
    background: backdropBackground,
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="settings-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={backdropStyle}
          className="fixed inset-0 z-50 cursor-pointer"
        />
      )}
      {isOpen && (
        <motion.div
          key="settings-panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--background)] border-l border-[var(--border)] rounded-l-xl shadow-2xl z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] px-6 py-8 text-right flex flex-col justify-between transition-colors duration-500"
          >
            <div className="space-y-6">
              <SettingsHeader onClose={onClose} animationsEnabled={animationsEnabled} />

              <SettingsTabsSlider
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                animationsEnabled={animationsEnabled}
                isDark={isDark}
                accent3={accent3}
              />

              <div className="space-y-4 pt-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SettingsTabContent {...props} activeTab={activeTab} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <SettingsFooter />
          </motion.div>
      )}
    </AnimatePresence>
  );
}
