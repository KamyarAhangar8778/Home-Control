import React from "react";
import Image from "next/image";
import GroupFilterSelector from "../GroupFilterSelector";
import { useIoTStore } from '@/features/iot/hooks/useIoTStore';
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import MobileDropdownMenu from "./MobileDropdownMenu";
import { BrandBoxProps } from "./types";

export default function HorizontalBrandBox(props: Omit<BrandBoxProps, "variant">) {
  const { headerTitle, animationsEnabled, groupsOrder, selectedGroupFilter, setSelectedGroupFilter } = props;
  const { isFullyReady } = useDashboard();

  return (
    <div className="md:w-1/3 xl:w-1/4 relative group rounded-2xl transition-all duration-350 md:hover:-translate-y-1.5 md:hover:shadow-xl z-50">
      {animationsEnabled && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-60" xmlns="http://www.w3.org/2000/svg">
          <rect 
            x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" 
            rx="14" ry="14" 
            fill="none" 
            stroke="var(--accent3)" 
            strokeWidth="1.5" 
            pathLength="100"
            strokeDasharray="15 85"
            className="animate-[svg-border-spin_10s_linear_infinite]"
          />
        </svg>
      )}
      <div className={`relative z-10 h-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-3.5 rounded-2xl flex items-center justify-between md:justify-start gap-4 transition-colors duration-300`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm md:hover:border-[var(--accent4)] transition-all">
            <Image
              src="/logo.png"
              alt="Logo"
              width={26}
              height={26}
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <h1 className="font-sans font-extrabold text-[13.5px] md:text-sm tracking-tight leading-tight select-none transition-all duration-300 md:hover:scale-[1.02] title-animated">
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

        {/* Mobile-only Theme Toggle & Menu located in title island for quick reach */}
        <MobileDropdownMenu {...props} />
      </div>
    </div>
  );
}
