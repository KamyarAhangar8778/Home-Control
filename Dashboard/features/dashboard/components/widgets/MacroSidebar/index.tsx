"use client";

import React, { useState } from "react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { AnimatePresence } from "motion/react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import MacroSidebarButton from "./MacroSidebarButton";

interface MacroSidebarProps {
  forceHorizontal?: boolean;
  className?: string;
}

export default function MacroSidebar({ forceHorizontal = false, className = "" }: MacroSidebarProps) {
  const { handleBatchPinState } = useDashboard();
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const headerPosition = useIoTStore(s => s.headerPosition);
  const macros = useIoTStore(s => s.macros);
  const selectedGroupFilter = useIoTStore(s => s.selectedGroupFilter);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [offset, setOffset] = useState(0);

  React.useEffect(() => {
    if (macros && activeIndex >= macros.length) {
      setActiveIndex(Math.max(0, macros.length - 1));
    }
  }, [macros, activeIndex]);

  if (selectedGroupFilter || !macros || macros.length === 0) {
    return null;
  }

  const handleExecuteMacro = (macroId: string) => {
    const macro = macros.find((m) => m.id === macroId);
    if (!macro) return;
    
    handleBatchPinState(macro.actions);
  };

  const isHorizontal = forceHorizontal || headerPosition === "left";

  const goNext = () => {
    setDirection(-1);
    setOffset(prev => prev + 1);
    setActiveIndex((prev) => (prev + 1) % macros.length);
  };
  const goPrev = () => {
    setDirection(1);
    setOffset(prev => prev - 1);
    setActiveIndex((prev) => (prev - 1 + macros.length) % macros.length);
  };

  return (
    <div className={`${className} w-full max-w-full ${isHorizontal ? "flex flex-row justify-center items-center gap-2 pt-4 pb-2" : "hidden lg:flex flex-col gap-3 shrink-0 pt-4 sticky top-6 z-10 w-[72px] items-center"}`} dir={isHorizontal ? "rtl" : undefined}>
      {macros.length >= 3 ? (
        <>
          <button onClick={goPrev} className="p-1 rounded-full text-[var(--text-secondary)] md:hover:bg-[var(--accent3)] md:hover:text-white transition-colors shrink-0" title="قبلی">
            {isHorizontal ? <ChevronRight className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
          
          <div 
            className={`flex ${isHorizontal ? "flex-row items-center gap-1 max-w-[320px]" : "flex-col items-center gap-2"} relative overflow-hidden p-1`}
            style={isHorizontal ? { WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" } : undefined}
          >
            <AnimatePresence mode="popLayout" custom={direction}>
              {[
                { macro: macros[(activeIndex - 1 + macros.length) % macros.length], key: offset - 1 },
                { macro: macros[activeIndex], key: offset },
                { macro: macros[(activeIndex + 1) % macros.length], key: offset + 1 }
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

          <button onClick={goNext} className="p-1 rounded-full text-[var(--text-secondary)] md:hover:bg-[var(--accent3)] md:hover:text-white transition-colors shrink-0" title="بعدی">
            {isHorizontal ? <ChevronLeft className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </>
      ) : (
        <AnimatePresence>
          {macros.map((macro, index) => (
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
