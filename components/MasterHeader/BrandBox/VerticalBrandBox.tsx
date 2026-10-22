import React from "react";
import { HousePlug } from "lucide-react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { BrandBoxProps } from "./types";

export default function VerticalBrandBox({
  headerTitle,
}: Omit<BrandBoxProps, "variant">) {
  const { isFullyReady } = useDashboard();

  return (
    <div className="relative">
      <div className="relative h-full bg-transparent md:bg-[var(--card-bg-solid)] border border-transparent md:border-[var(--border-color)] px-2 md:px-3 py-2 md:py-3 rounded-xl flex items-center justify-center md:justify-start gap-2 md:gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--card-hover-bg)] border border-[var(--border-color)] rounded-xl shrink-0 flex items-center justify-center overflow-hidden">
            <HousePlug aria-label="Home Control" className="w-6 h-6 text-[var(--accent3)]" strokeWidth={1.8} />
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <h1 className="font-sans font-semibold text-[13.5px] tracking-tight leading-tight select-none text-[var(--text-primary)]">
              {isFullyReady ? headerTitle : <div className="w-32 h-4 bg-[var(--text-muted)] opacity-20 rounded animate-pulse" />}
            </h1>

          </div>
        </div>
      </div>
    </div>
  );
}
