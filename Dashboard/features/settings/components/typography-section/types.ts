export interface TypographySectionProps {
  selectedFont: string;
  setSelectedFont: (val: string) => void;
  expandedSection?: string | null;
  toggleSection?: (section: string) => void;
  hideHeader?: boolean;
}
