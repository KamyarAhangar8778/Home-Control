import { StateCreator } from "zustand";
import { IoTStoreState, SystemSlice } from "../types";

export const createSystemSlice: StateCreator<IoTStoreState, [], [], SystemSlice> = (set) => ({
  automations: [],
  macros: [],
  voiceCommands: [],
  wifiNetworks: [],
  mqttConfig: null,

  setAutomations: (automations) => {
    set((state) => {
      const next = typeof automations === "function" ? automations(state.automations) : automations;
      return { automations: next };
    });
  },

  setMacros: (macros) => {
    set((state) => {
      const next = typeof macros === "function" ? macros(state.macros) : macros;
      return { macros: next };
    });
  },

  setVoiceCommands: (voiceCommands) => {
    set((state) => {
      const next = typeof voiceCommands === "function" ? voiceCommands(state.voiceCommands) : voiceCommands;
      return { voiceCommands: next };
    });
  },

  setWifiNetworks: (networks) => {
    set((state) => {
      const next = typeof networks === "function" ? networks(state.wifiNetworks) : networks;
      return { wifiNetworks: next };
    });
  },

  setMqttConfig: (config) => set({ mqttConfig: config }),
});
