export type CuneiformColor = "accent3" | "accent4" | "white" | "muted";

export interface CuneiformSectionProps {
  cuneiformOpacity: number;
  setCuneiformOpacity: (val: number) => void;
  cuneiformColor: CuneiformColor;
  setCuneiformColor: (val: CuneiformColor) => void;
  expandedSection?: string | null;
  toggleSection?: (section: string) => void;
  hideHeader?: boolean;
}
