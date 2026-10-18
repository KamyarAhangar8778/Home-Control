import React from "react";
import { Palette, Type, Activity, LayoutGrid, Sparkles, Music, Radio, Command, Mic, Wifi, Settings2 } from "lucide-react";

export interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  accent3: string;
  setAccent3: (val: string) => void;
  accent4: string;
  setAccent4: (val: string) => void;
  selectedFont: string;
  setSelectedFont: (val: string) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (val: boolean) => void;
  animationsFps: number;
  setAnimationsFps: (val: number) => void;
  headerAnimationType: "fade" | "chase";
  setHeaderAnimationType: (val: "fade" | "chase") => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  matrixDensity: number;
  setMatrixDensity: (val: number) => void;
  matrixSize: number;
  setMatrixSize: (val: number) => void;
  matrixHoverSize: number;
  setMatrixHoverSize: (val: number) => void;
  matrixOpacity: number;
  setMatrixOpacity: (val: number) => void;
  matrixColor: string;
  setMatrixColor: (val: string) => void;
  matrixMoving: boolean;
  setMatrixMoving: (val: boolean) => void;
  matrixMouseEffect: boolean;
  setMatrixMouseEffect: (val: boolean) => void;
  matrixTwinkleEffect: boolean;
  setMatrixTwinkleEffect: (val: boolean) => void;
  matrixTwinkleSpeed: number;
  setMatrixTwinkleSpeed: (val: number) => void;
  dashboardBgColor: string;
  setDashboardBgColor: (val: string) => void;
  dashboardBgOpacity: number;
  setDashboardBgOpacity: (val: number) => void;
  isDark: boolean;
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
  dashboardWidth: 1 | 2 | 3 | 4 | 5;
  setDashboardWidth: (val: 1 | 2 | 3 | 4 | 5) => void;
  isGroupsCompactLayout: boolean;
  setIsGroupsCompactLayout: (val: boolean) => void;
  isSegmentsCompactLayout: boolean;
  setIsSegmentsCompactLayout: (val: boolean) => void;
}

export const SETTINGS_TABS = [
  {
    id: "layout",
    title: "تنظیمات عرض و نمای داشبورد",
    compactTitle: "چیدمان و عرض",
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
    id: "colors",
    title: "تنظیم تنوع رنگ و تضاد",
    compactTitle: "رنگ ۳ و رنگ ۴ بورد",
    Icon: Palette,
  },
  {
    id: "fonts",
    title: "مدیریت قلم و تایپوگرافی",
    compactTitle: "قلم و فونت‌های سلطنتی",
    Icon: Type,
  },
  {
    id: "animations",
    title: "کنترل پایداری و بهینه‌سازی",
    compactTitle: "فریم‌ریت و مصرف سرویس",
    Icon: Activity,
  },
  {
    id: "macros",
    title: "مدیریت دکمه‌های سفارشی (ماکروها)",
    compactTitle: "تعریف ماکرو و سناریو",
    Icon: Command,
  },
  {
    id: "voice-commands",
    title: "مدیریت دستیار صوتی هوشمند",
    compactTitle: "دستورات صوتی و ویس",
    Icon: Mic,
  },
  {
    id: "header-settings",
    title: "موقعیت و تنظیمات هدر",
    compactTitle: "طرح قرارگیری هدر بورد",
    Icon: LayoutGrid,
  },
  {
    id: "matrix",
    title: "تنظیمات انیمیشن پس‌زمینه ماتریکس",
    compactTitle: "انیمیشن پس‌زمینه",
    Icon: Sparkles,
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
