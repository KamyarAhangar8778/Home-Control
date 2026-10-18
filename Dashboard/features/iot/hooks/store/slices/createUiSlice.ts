import { StateCreator } from "zustand";
import { IoTStoreState, UiSlice } from "../types";

export const createUiSlice: StateCreator<IoTStoreState, [], [], UiSlice> = (set) => ({
  lowDataMode: false,
  toast: null,
  selectedGroupFilter: null,
  isPageVisible: true,
  isListening: false,
  voiceTranscript: "",
  activeSegmentId: null,
  activeGroupId: null,
  isLocal: false,
  localIp: null,

  setLowDataMode: (enabled) => {
    set({ lowDataMode: enabled });
  },

  showToast: (message, type) => {
    set({ toast: { message, type } });
  },

  clearToast: () => {
    set({ toast: null });
  },

  setSelectedGroupFilter: (group) => {
    set({ selectedGroupFilter: group });
  },

  setIsPageVisible: (visible) => {
    set({ isPageVisible: visible });
  },

  setIsListening: (b) => set({ isListening: b }),

  setVoiceTranscript: (t) => set({ voiceTranscript: t }),
  
  setActiveSegmentId: (id) => set({ activeSegmentId: id }),
  setActiveGroupId: (id) => set({ activeGroupId: id }),
  setIsLocal: (local) => set({ isLocal: local }),
  setLocalIp: (ip) => set({ localIp: ip }),
});
