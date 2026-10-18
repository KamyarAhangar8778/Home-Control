import { StateCreator } from "zustand";
import { IoTStoreState, SyncSlice } from "../types";

export const createSyncSlice: StateCreator<IoTStoreState, [], [], SyncSlice> = (set) => ({
  isInitialSyncLoading: false,
  syncProgress: 0,
  syncMessage: "در حال جستجوی تراشه ESP32 در شبکه محلی پادشاهی...",
  manualSaveMode: false,
  unsavedChangesCount: 0,

  setSyncStatus: (isInitialSyncLoading, syncProgress, syncMessage) => {
    set({ isInitialSyncLoading, syncProgress, syncMessage });
  },

  setManualSaveMode: (enabled) => {
    set({ manualSaveMode: enabled });
  },

  incrementUnsavedChanges: () => {
    set((state) => ({ unsavedChangesCount: state.unsavedChangesCount + 1 }));
  },

  resetUnsavedChanges: () => {
    set({ unsavedChangesCount: 0 });
  },
});
