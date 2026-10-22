import React from "react";
import { HousePlug } from "lucide-react";
import GroupFilterSelector from "../GroupFilterSelector";
import { useIoTStore } from '@/features/iot/hooks/useIoTStore';
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { BrandBoxProps } from "./types";

export default function VerticalBrandBox({
  headerTitle,
  animationsEnabled,
  groupsOrder,
  selectedGroupFilter,
  setSelectedGroupFilter,
}: Omit<BrandBoxProps, "variant">) {
  const { isFullyReady } = useDashboard();

  return (
    <div className="relative">
      <div className={`relative z-10 h-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-4 rounded-2xl md:rounded-bl-md md:rounded-tl-md md:rounded-tr-md flex items-center justify-between gap-4 transition-colors duration-300`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl shrink-0 flex items-center justify-center overflow-hidden">
            <HousePlug aria-label="Home Control" className="w-6 h-6 text-[var(--accent3)]" strokeWidth={1.8} />
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <h1 className="font-sans font-semibold text-[13.5px] tracking-tight leading-tight select-none text-[var(--text-primary)]">
              {isFullyReady ? headerTitle : <div className="w-32 h-4 bg-[var(--text-muted)] opacity-20 rounded animate-pulse" />}
            </h1>
            {groupsOrder && setSelectedGroupFilter ? (
              <div className="mt-1 block md:hidden">
                <GroupFilterSelector
                  groupsOrder={groupsOrder}
                  selectedGroupFilter={selectedGroupFilter || null}
                  setSelectedGroupFilter={setSelectedGroupFilter}
                  animationsEnabled={animationsEnabled}
                  isCompact={true}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
