export interface Segment {
  id: string;
  type: string;
  pin: string;
  title: string;
  group?: string;
  icon?: string;
  mode?: "switch" | "push";
  auto_off?: number;
}

export interface ModulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSegment: (
    type: string,
    pin: string,
    title?: string,
    group?: string,
    mode?: "switch" | "push",
    auto_off?: number,
    icon?: string,
    groupIcon?: string
  ) => void;
  segments: Segment[];
  onRemoveSegment: (id: string) => void;
  isDark: boolean;
  accent3: string;
  accent4: string;
  animationsEnabled?: boolean;
}
