import type { Metadata } from "next";
import { Vazirmatn, JetBrains_Mono } from "next/font/google";
import "./globals.css"; // Global styles
import QueryProvider from "@/components/QueryProvider";
import AudioInitializer from "@/components/AudioInitializer";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "سامانه اینترنت اشیاء هخامنشی | Achaemenid IoT Dashboard",
  description:
    "داشبورد هوشمند اینترنت اشیا مبتنی بر معماری میکروکنترلر ESP32 با الهام از معماری و نگاره‌های پاسارگاد و تخت جمشید",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${jetbrainsMono.variable}`}>
      <body
        suppressHydrationWarning
        className="bg-[#0b0c10] text-[#c5a880] min-h-screen selection:bg-amber-500/20 selection:text-amber-300 font-sans"
      >
        <QueryProvider>
          <AudioInitializer />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
