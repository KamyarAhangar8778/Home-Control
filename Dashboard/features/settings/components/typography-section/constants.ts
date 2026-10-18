export interface FontItem {
  id: string;
  name: string;
  family: string;
  desc: string;
}

export const FONTS_LIST: FontItem[] = [
  { id: "vazir", name: "وزیرمتن", family: "'Vazirmatn'", desc: "پایه مدرن" },
  { id: "lalezar", name: "لاله‌زار", family: "'Lalezar'", desc: "حماسی برجسته" },
  { id: "cairo", name: "کایرو", family: "'Cairo'", desc: "هندسی متعادل" },
  { id: "amiri", name: "امیری", family: "'Amiri'", desc: "کتابت سنتی" },
  { id: "changa", name: "چنگا", family: "'Changa'", desc: "تکنو خشن" },
  { id: "reem", name: "ریم کوفی", family: "'Reem Kufi'", desc: "کوفی باستانی" },
  { id: "tajawal", name: "تجول", family: "'Tajawal'", desc: "اداری قرآنی" },
  { id: "playfair", name: "پلی‌فیر", family: "'Playfair Display'", desc: "لاتین کلاسیک" },
  { id: "space", name: "اسپیس", family: "'Space Grotesk'", desc: "آینده‌نگار" },
  { id: "mono", name: "جت‌برینز", family: "'JetBrains Mono'", desc: "فنی هکری" },
];
