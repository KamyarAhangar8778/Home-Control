export interface StabilitySectionProps {
  animationsEnabled: boolean;
  setAnimationsEnabled: (val: boolean) => void;
  animationsFps?: number;
  setAnimationsFps?: (val: number) => void;
  expandedSection?: string | null;
  toggleSection?: (section: string) => void;
  hideHeader?: boolean;
  isDark?: boolean;
}
