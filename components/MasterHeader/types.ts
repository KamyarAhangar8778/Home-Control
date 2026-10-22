export interface MasterHeaderProps {
  setIsModulesMenuOpen: (val: boolean) => void;
  setIsMenuOpen: (val: boolean) => void;
  headerTitle: string;
  groupsCols: number;
  setGroupsCols: (val: number) => void;
  animationsEnabled?: boolean;
  isSidebarCollapsed?: boolean;
  setIsSidebarCollapsed?: (val: boolean) => void;
}
