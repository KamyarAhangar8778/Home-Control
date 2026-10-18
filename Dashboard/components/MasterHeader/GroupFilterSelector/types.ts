export interface GroupFilterSelectorProps {
  groupsOrder: string[];
  selectedGroupFilter: string | null;
  setSelectedGroupFilter: (group: string | null) => void;
  animationsEnabled?: boolean;
  isCompact?: boolean;
}
