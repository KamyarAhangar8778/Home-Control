export interface HeritagePreset {
  id: string;
  name: string;
  accent3: string; // Dynamic Color 3
  accent4: string; // Dynamic Color 4
  desc: string;
}

export const heritagePresets: HeritagePreset[] = [
  {
    id: "taj-kiani",
    name: "تاج کانی (طلایی شاهی و لاجوردی)",
    accent3: "#D4AF37", // Imperial Gold
    accent4: "#0F52BA", // Persian Lapis Blue
    desc: "برگرفته از تاج شاهان و کتیبه‌های طلایی کاخ داریوش",
  },
  {
    id: "elam-bronze",
    name: "تمدن عیلام (برنز کهن و سورمه‌ای تیره)",
    accent3: "#CD7F32", // Bronze Accent
    accent4: "#1E3A8A", // Deep Cobalt
    desc: "روایتگر ابزارهای کهن مفرغی و ستو‌ن‌های گلی پاسارگاد",
  },
  {
    id: "agate-warrior",
    name: "سپاه جاویدان (عقیق یاقوتی و پلاتین)",
    accent3: "#DC143C", // Red Agate
    accent4: "#94A3B8", // Platinum Slate
    desc: "ردای سرخ‌گون سربازان گارد شاهی هخامنشی",
  },
  {
    id: "apadana-garden",
    name: "باغ شاهنشاهی (سفال سرخ و سبز یشمی)",
    accent3: "#E2725B", // Terracotta Clay
    accent4: "#10B981", // Emerald Jasper
    desc: "نقش مایه گل‌های نیلوفر و دروازه ملل شوش",
  },
  {
    id: "persian-star",
    name: "مرجان کویر (گلبهی و فیروزه خلیف)",
    accent3: "#F97316", // Persimmon Orange
    accent4: "#06B6D4", // Turquoise Sky
    desc: "طرح ستاره درخشان بر پهنه فیروزه‌ای چرم کاویانی",
  },
];

// Premium Chiseled Achaemenid Style Cut Presets (No rounded border-radius!)
export const BOX_CLIP =
  "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)";
export const BUTTON_CLIP =
  "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)";
export const ACCORDION_CLIP =
  "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)";
export const THEME_ISLAND_CLIP =
  "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)";

// Asymmetric location-specific Chiseled Clips for visual rhythm
// 1. Diagonal Primary - Only cuts Top-Left and Bottom-Right (Majestic stone orientation A)
export const CLIP_DIAGONAL_TL_BR =
  "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

// 2. Diagonal Secondary - Only cuts Top-Right and Bottom-Left (Majestic stone orientation B)
export const CLIP_DIAGONAL_TR_BL =
  "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))";

// 3. Apadana Royal Gate Arch - Chiseled top corners, flat solid bottom (for top row headers/cards)
export const CLIP_GATE_ARCH = "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)";

// 4. Persepolis Foundation Pedestal - Chiseled bottom corners, flat robust top (for bottom row cards)
export const CLIP_PEDESTAL =
  "polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px))";

// 5. Single Corner Sentry - Only bevels the critical upper execution slot (for highlight/special actions)
export const CLIP_SENTRY_TR = "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)";
export const CLIP_SENTRY_BL = "polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))";
