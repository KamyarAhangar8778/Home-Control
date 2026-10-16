import { StateCreator } from "zustand";
import { IoTStoreState, GroupsSlice } from "../types";

export const createGroupsSlice: StateCreator<IoTStoreState, [], [], GroupsSlice> = (set) => ({
  groupsOrder: [],
  groupConfigs: {},
  groupsCols: 1,

  setGroupsOrder: (groupsOrder) => {
    set((state) => {
      const next = typeof groupsOrder === "function" ? groupsOrder(state.groupsOrder) : groupsOrder;
      return { groupsOrder: next };
    });
  },

  setGroupConfigs: (groupConfigs) => {
    set((state) => {
      const next = typeof groupConfigs === "function" ? groupConfigs(state.groupConfigs) : groupConfigs;
      return { groupConfigs: next };
    });
  },

  setGroupsCols: (groupsCols) => {
    set({ groupsCols });
  },
});
