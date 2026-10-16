import { StateCreator } from "zustand";
import { IoTStoreState, MenuSlice } from "../types";

export const createMenuSlice: StateCreator<IoTStoreState, [], [], MenuSlice> = (set) => ({
  isMenuOpen: false,
  isModulesMenuOpen: false,
  isEspDrawerOpen: false,
  isAutomationsMenuOpen: false,
  activeSettingsTab: "colors",

  setIsMenuOpen: (o) => set({ isMenuOpen: o }),
  setIsModulesMenuOpen: (o) => set({ isModulesMenuOpen: o }),
  setIsEspDrawerOpen: (o) => set({ isEspDrawerOpen: o }),
  setIsAutomationsMenuOpen: (o) => set({ isAutomationsMenuOpen: o }),
  setActiveSettingsTab: (t) => set({ activeSettingsTab: t }),
});
