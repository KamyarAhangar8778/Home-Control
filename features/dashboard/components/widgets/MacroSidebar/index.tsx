"use client";

import React, { useState } from "react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { AnimatePresence } from "motion/react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import MacroSidebarButton from "./MacroSidebarButton";

interface MacroSidebarProps {
  className?: string;
}

export default function MacroSidebar({ className = "" }: MacroSidebarProps) {
  const { handleBatchPinState } = useDashboard();
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const macros = useIoTStore(s => s.macros);
  const visibleMacros = macros.filter((macro) =>
    macro.title.replace(/[\u200c\u200f\u202a-\u202e]/g, "").replace(/\s+/g, " ").trim() !== "تمام سگمنت ها روشن"
  );
  const selectedGroupFilter = useIoTStore(s => s.selectedGroupFilter);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [offset, setOffset] = useState(0);

  React.useEffect(() => {
    if (visibleMacros.length > 0 && activeIndex >= visibleMacros.length) {
      setActiveIndex(Math.max(0, visibleMacros.length - 1));
    }
  }, [visibleMacros.length, activeIndex]);

  if (selectedGroupFilter || visibleMacros.length === 0) {
    return null;
  }

  const handleExecuteMacro = (macroId: string) => {
    const macro = visibleMacros.find((m) => m.id === macroId);
    if (!macro) return;
    
    handleBatchPinState(macro.actions);
  };

  const isHorizontal = true;

  const goNext = () => {
    setDirection(-1);
    setOffset(prev => prev + 1);
    setActiveIndex((prev) => (prev + 1) % visibleMacros.length);
  };
  const goPrev = () => {
    setDirection(1);
    setOffset(prev => prev - 1);
    setActiveIndex((prev) => (prev - 1 + visibleMacros.length) % visibleMacros.length);
  };

  return (
    <div className={`${className} w-full max-w-full ${isHorizontal ? "flex flex-row justify-center items-center gap-2 pt-4 pb-2" : "hidden lg:flex flex-col gap-3 shrink-0 pt-4 sticky top-6 z-10 w-[72px] items-center"}`} dir={isHorizontal ? "rtl" : undefined}>
      {visibleMacros.length >= 3 ? (
        <>
          <button type="button" onClick={goPrev} className="p-1 rounded-full text-[var(--text-secondary)] md:hover:bg-[var(--accent3)] md:hover:text-white transition-colors shrink-0" title="قبلی">
            {isHorizontal ? <ChevronRight className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
          
          <div 
            className={`flex ${isHorizontal ? "flex-row items-center gap-1 max-w-[320px]" : "flex-col items-center gap-2"} relative overflow-hidden p-1`}
            style={isHorizontal ? { WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" } : undefined}
          >
            <AnimatePresence mode="popLayout" custom={direction}>
              {[
                { macro: visibleMacros[(activeIndex - 1 + visibleMacros.length) % visibleMacros.length], key: offset - 1 },
                { macro: visibleMacros[activeIndex], key: offset },
                { macro: visibleMacros[(activeIndex + 1) % visibleMacros.length], key: offset + 1 }
              ].map(({ macro, key }, index) => {
                const isCenter = index === 1;
                const onClick = index === 0 ? goPrev : index === 2 ? goNext : () => handleExecuteMacro(macro.id);
                return (
                  <MacroSidebarButton
                    key={String(key)}
                    macro={macro}
                    isCenter={isCenter}
                    onClick={onClick}
                    isHorizontal={isHorizontal}
                    animationsEnabled={animationsEnabled}
                    direction={direction}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          <button type="button" onClick={goNext} className="p-1 rounded-full text-[var(--text-secondary)] md:hover:bg-[var(--accent3)] md:hover:text-white transition-colors shrink-0" title="بعدی">
            {isHorizontal ? <ChevronLeft className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </>
      ) : (
        <AnimatePresence>
          {visibleMacros.map((macro, index) => (
            <MacroSidebarButton
              key={macro.id}
              macro={macro}
              onClick={() => handleExecuteMacro(macro.id)}
              isHorizontal={isHorizontal}
              animationsEnabled={animationsEnabled}
              isSimpleList={true}
              index={index}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
