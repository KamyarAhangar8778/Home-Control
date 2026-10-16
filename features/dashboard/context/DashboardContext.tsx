"use client";

import { createContext, useContext } from "react";
import { useAchaemenidState } from "@/features/iot/hooks/useAchaemenidState";

type DashboardState = ReturnType<typeof useAchaemenidState>;

export const DashboardContext = createContext<DashboardState | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
