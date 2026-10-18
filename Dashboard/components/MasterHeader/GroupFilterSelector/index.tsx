import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useIoTStore } from '@/features/iot/hooks/useIoTStore';
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { GroupFilterSelectorProps } from "./types";
import SkeletonLoader from "./SkeletonLoader";
import FilterButton from "./FilterButton";

export default function GroupFilterSelector({
  groupsOrder,
  selectedGroupFilter,
  setSelectedGroupFilter,
  animationsEnabled = true,
  isCompact = false,
}: GroupFilterSelectorProps) {
  const [direction, setDirection] = useState(1);
  const [offset, setOffset] = useState(0);
  const { isFullyReady } = useDashboard();
  
  if (!isFullyReady) {
    return <SkeletonLoader isCompact={isCompact} />;
  }

  if (groupsOrder.length === 0) return null;

  const allGroups = [null, ...groupsOrder];
  
  const currIndex = allGroups.findIndex((g) => g === selectedGroupFilter);
  const safeCurrIndex = currIndex === -1 ? 0 : currIndex;
  
  const goNext = () => {
    setDirection(-1);
    setOffset(prev => prev + 1);
    const nextIndex = (safeCurrIndex + 1) % allGroups.length;
    setSelectedGroupFilter(allGroups[nextIndex]);
  };

  const goPrev = () => {
    setDirection(1);
    setOffset(prev => prev - 1);
    const prevIndex = (safeCurrIndex - 1 + allGroups.length) % allGroups.length;
    setSelectedGroupFilter(allGroups[prevIndex]);
  };

  return (
    <div className={`flex items-center justify-center pointer-events-auto max-w-full overflow-hidden ${!isCompact ? 'mb-2' : ''}`} dir="rtl">
      <div className={`flex flex-row items-center justify-center ${isCompact ? 'gap-1' : 'gap-2'} max-w-full`}>
        
        <button onClick={goPrev} className={`hidden md:block rounded-full text-[var(--text-secondary)] md:hover:bg-[var(--accent3)] md:hover:text-white transition-colors shrink-0 ${isCompact ? 'p-0.5' : 'p-1'}`} title="قبلی">
          <ChevronRight className={isCompact ? "w-3.5 h-3.5" : "w-5 h-5"} />
        </button>
        
        <div className={`flex flex-row items-center justify-center relative overflow-hidden ${isCompact ? 'gap-1 p-0.5 max-w-[300px]' : 'gap-2 p-1 max-w-[460px]'}`}>
          <AnimatePresence mode="popLayout" custom={direction}>
            {[
              { group: allGroups[(safeCurrIndex - 1 + allGroups.length) % allGroups.length], key: offset - 1 },
              { group: allGroups[safeCurrIndex], key: offset },
              { group: allGroups[(safeCurrIndex + 1) % allGroups.length], key: offset + 1 }
            ].map(({ group, key }, index) => {
              const isCenter = index === 1;
              const onClick = index === 0 ? goPrev : index === 2 ? goNext : () => setSelectedGroupFilter(group);
              return (
                <FilterButton
                  key={String(key)}
                  uniqueKey={String(key)}
                  group={group}
                  isCenter={isCenter}
                  onClick={onClick}
                  animationsEnabled={animationsEnabled}
                  direction={direction}
                  isCompact={isCompact}
                />
              );
            })}
          </AnimatePresence>
        </div>

        <button onClick={goNext} className={`hidden md:block rounded-full text-[var(--text-secondary)] md:hover:bg-[var(--accent3)] md:hover:text-white transition-colors shrink-0 ${isCompact ? 'p-0.5' : 'p-1'}`} title="بعدی">
          <ChevronLeft className={isCompact ? "w-3.5 h-3.5" : "w-5 h-5"} />
        </button>
      </div>
    </div>
  );
}
