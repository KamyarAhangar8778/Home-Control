import { StateCreator } from "zustand";
import { IoTStoreState, AestheticSlice } from "../types";

export const createAestheticSlice: StateCreator<IoTStoreState, [], [], AestheticSlice> = (set) => ({
  isDark: true,
  accent3: "#E5E7EB",
  accent4: "#3B82F6",
  animationsEnabled: true,
  animationsFps: 60,
  headerTitle: "سامانه هوشمند پادشاهی هخامنش",
  isSidebarCollapsed: false,
  isGroupsCompactLayout: false,
  isSegmentsCompactLayout: false,

  setAnimationsEnabled: (e) => set({ animationsEnabled: e }),
  setAnimationsFps: (f) => set({ animationsFps: f }),
  setHeaderTitle: (t) => set({ headerTitle: t }),
  setIsSidebarCollapsed: (c) => set({ isSidebarCollapsed: c }),
  setIsGroupsCompactLayout: (c) => set({ isGroupsCompactLayout: c }),
  setIsSegmentsCompactLayout: (c) => set({ isSegmentsCompactLayout: c }),
});
