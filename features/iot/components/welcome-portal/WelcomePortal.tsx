"use client";

import React from "react";
import { motion } from "motion/react";
import { Compass } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconStack } from "@/components/reui/icon-stack";
import SettingsPortalButton from "./components/SettingsPortalButton";
import ModulesPortalButton from "./components/ModulesPortalButton";

export interface WelcomePortalProps {
  setIsMenuOpen: (val: boolean) => void;
  setIsModulesMenuOpen: (val: boolean) => void;
  accent3?: string;
  accent4?: string;
  animationsEnabled?: boolean;
  isDark?: boolean;
}

export default function WelcomePortal({ setIsMenuOpen, setIsModulesMenuOpen, animationsEnabled = true }: WelcomePortalProps) {
  const welcomeTextGradientStyle: React.CSSProperties = {
    background: "linear-gradient(120deg, var(--accent3), var(--accent4), var(--accent3))",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline-block",
  };

  return (
    <motion.div
      key="welcome-prompt"
      initial={animationsEnabled ? { opacity: 0, scale: 0.98 } : false}
      animate={{ opacity: 1, scale: 1 }}
      exit={animationsEnabled ? { opacity: 0, scale: 0.98 } : undefined}
      transition={{ duration: animationsEnabled ? 0.3 : 0 }}
      className="w-full flex flex-col items-stretch py-4"
    >
      <Card className="w-full max-w-4xl overflow-hidden text-right">
        <CardHeader className="items-start text-right px-5 py-6 sm:px-7 md:px-10 md:py-8 gap-4">
          <div className="inline-flex max-w-full flex-row-reverse items-center gap-2 rounded-full border border-[var(--accent3-medium)] bg-[var(--accent3-transparent)] px-3 py-1.5 text-right text-[10px] font-sans font-bold text-[var(--accent3)] shadow-sm md:text-xs">
            <Compass aria-hidden="true" className="w-3.5 h-3.5 text-[var(--accent3)]" />
            <span>پلتفرم لبه و مانیتورینگ اینترنت اشیاء | Edge IoT Platform</span>
          </div>
          <CardTitle className="w-full max-w-3xl text-right text-xl font-sans font-extrabold theme-text-primary tracking-tight leading-relaxed md:text-3xl">
            <h3>
              درود بر شما،
              <br />
              به{" "}
              <span style={welcomeTextGradientStyle} className="font-extrabold font-sans">
                سامانه یکپارچه مانیتورینگ اینترنت اشیا
              </span>{" "}
              خوش آمدید
            </h3>
          </CardTitle>
          <CardDescription className="w-full max-w-2xl text-right text-xs leading-7 theme-text-tertiary font-sans md:text-sm">
            این سامانه ابزار کاملی برای مدیریت، تست و پیکربندی دستگاه‌ها و ماژول‌های متصل ارائه می‌دهد.
            با بهره‌گیری از معماری پایا و رابط کاربری بهینه‌سازی‌شده، مانیتورینگ بلادرنگ وضعیت پایه‌ها
            هم‌اکنون در دسترس است.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-5 px-5 pb-6 sm:px-7 md:px-10 md:pb-8">
          <IconStack className="text-[var(--accent3)]" aria-hidden="true">
            <Compass className="size-5" />
          </IconStack>
          <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            <SettingsPortalButton onClick={() => setIsMenuOpen(true)} />
            <ModulesPortalButton onClick={() => setIsModulesMenuOpen(true)} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
