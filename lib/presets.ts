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

export const BUTTON_CLIP =
  "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)";
export const ACCORDION_CLIP =
  "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)";
