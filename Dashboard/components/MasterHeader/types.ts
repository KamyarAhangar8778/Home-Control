export interface MasterHeaderProps {
  setIsModulesMenuOpen: (val: boolean) => void;
  setIsMenuOpen: (val: boolean) => void;
  headerTitle: string;
  animationsEnabled?: boolean;
  isSidebarCollapsed?: boolean;
  setIsSidebarCollapsed?: (val: boolean) => void;
}
