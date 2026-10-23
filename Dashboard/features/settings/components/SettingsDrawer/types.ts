import { Activity, LayoutGrid, Music, Radio, Mic, Wifi, Settings2 } from "lucide-react";

export interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  accent3: string;
  accent4: string;
  animationsEnabled: boolean;
  setAnimationsEnabled: (val: boolean) => void;
  animationsFps: number;
  setAnimationsFps: (val: number) => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  isDark: boolean;
}

export const SETTINGS_TABS = [
  {
    id: "layout",
    title: "تنظیمات نمای داشبورد",
    compactTitle: "نمای داشبورد",
    Icon: LayoutGrid,
  },
  {
    id: "wifi",
    title: "تنظیمات شبکه وای‌فای (Wi-Fi)",
    compactTitle: "اتصال به شبکه",
    Icon: Wifi,
  },
  {
    id: "conditions",
    title: "مدیریت شرط‌ها و قوانین (Rules)",
    compactTitle: "قوانین و شرط‌ها",
    Icon: Settings2,
  },
  {
    id: "animations",
    title: "کنترل پایداری و بهینه‌سازی",
    compactTitle: "فریم‌ریت و مصرف سرویس",
    Icon: Activity,
  },
  {
    id: "voice-commands",
    title: "مدیریت دستیار صوتی هوشمند",
    compactTitle: "دستورات صوتی و ویس",
    Icon: Mic,
  },
  {
    id: "audio",
    title: "تنظیمات صدا و موسیقی",
    compactTitle: "پخش موزیک پس‌زمینه",
    Icon: Music,
  },
  {
    id: "mqtt",
    title: "ارتباطات و پروتکل MQTT",
    compactTitle: "تنظیمات اتصال و QoS",
    Icon: Radio,
  },
];
