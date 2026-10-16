export interface HeaderSettingsSectionProps {
  headerAnimationType: "fade" | "chase";
  setHeaderAnimationType: (val: "fade" | "chase") => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  expandedSection?: string | null;
  toggleSection?: (section: string) => void;
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
  hideHeader?: boolean;
}
