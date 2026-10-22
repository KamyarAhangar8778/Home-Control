import { HousePlug } from "lucide-react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import type { BrandBoxProps } from "./types";

export default function VerticalBrandBox({
  headerTitle,
}: Omit<BrandBoxProps, "variant">) {
  const { isFullyReady } = useDashboard();

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--sidebar-hover)] text-[var(--sidebar-text)]">
        <HousePlug aria-label="Home Control" className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <h1 className="min-w-0 truncate text-right text-sm font-semibold tracking-tight text-[var(--sidebar-text)]">
        {isFullyReady ? headerTitle : <div className="h-4 w-28 animate-pulse rounded bg-[var(--text-muted)] opacity-20" />}
      </h1>
    </div>
  );
}
