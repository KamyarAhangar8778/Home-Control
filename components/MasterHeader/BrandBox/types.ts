export interface BrandBoxProps {
  headerTitle: string;
  variant: "vertical" | "horizontal";
  isDark?: boolean;
  setIsDark?: (val: boolean) => void;
  animationsEnabled?: boolean;
  setIsModulesMenuOpen?: (val: boolean) => void;
  setIsMenuOpen?: (val: boolean) => void;
  groupsCols?: number;
  setGroupsCols?: (val: number) => void;
  groupsOrder?: string[];
  selectedGroupFilter?: string | null;
  setSelectedGroupFilter?: (group: string | null) => void;
}
