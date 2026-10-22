export interface MasterHeaderProps {
  setIsModulesMenuOpen: (val: boolean) => void;
  setIsMenuOpen: (val: boolean) => void;
  headerAnimationType: "fade" | "chase";
  headerTitle: string;
  groupsCols: number;
  setGroupsCols: (val: number) => void;
  animationsEnabled?: boolean;
  isSidebarCollapsed?: boolean;
  setIsSidebarCollapsed?: (val: boolean) => void;
  groupsOrder: string[];
  selectedGroupFilter: string | null;
  setSelectedGroupFilter: (group: string | null) => void;
}
