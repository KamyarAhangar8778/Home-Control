"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ModulesDrawerProps } from "./core/types";
import ModulesDrawerInner from "./components/ModulesDrawerInner";

export default function ModulesDrawer({
  isOpen,
  onClose,
  onAddSegment,
  segments,
  onRemoveSegment,
  isDark,
  accent3,
  accent4,
  animationsEnabled = true,
}: ModulesDrawerProps) {
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modules-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={backdropStyle}
          className="fixed inset-0 z-50 cursor-pointer"
        />
      )}
      {isOpen && (
        <ModulesDrawerInner
          key="modules-panel"
          onClose={onClose}
          onAddSegment={onAddSegment}
          segments={segments}
          onRemoveSegment={onRemoveSegment}
          animationsEnabled={animationsEnabled}
          accent3={accent3}
          accent4={accent4}
        />
      )}
    </AnimatePresence>
  );
}
