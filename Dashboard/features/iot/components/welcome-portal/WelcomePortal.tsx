"use client";

import React from "react";
import { motion } from "motion/react";
import { Compass } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    display: "inline",
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
        <CardHeader className="items-start gap-4 px-5 py-6 text-right sm:px-7 md:px-10 md:py-9">
          <div className="inline-flex max-w-full flex-row-reverse items-center gap-2 rounded-full border border-[var(--accent3-medium)] bg-[var(--accent3-transparent)] px-3 py-1.5 text-right text-[10px] font-sans font-bold text-[var(--accent3)] md:text-xs">
            <Compass aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span>پلتفرم اینترنت اشیاء و اتوماسیون خانه</span>
            <span aria-hidden="true" className="mx-0.5 h-1 w-1 rounded-full bg-[var(--accent3)]" />
            <span dir="ltr" className="whitespace-nowrap">Edge IoT</span>
          </div>

          <div className="w-full space-y-3">
            <p className="text-sm font-medium text-[var(--text-secondary)]">درود بر شما، خوش آمدید</p>
            <CardTitle className="w-full max-w-3xl text-right text-2xl font-sans font-extrabold leading-[1.8] tracking-tight theme-text-primary md:text-4xl md:leading-[1.7]">
              سامانه یکپارچه{" "}
              <span style={welcomeTextGradientStyle} className="font-extrabold font-sans">
                کنترل و مانیتورینگ خانه هوشمند
              </span>
            </CardTitle>
          </div>

          <CardDescription className="w-full max-w-2xl text-right text-xs leading-7 theme-text-tertiary font-sans md:text-sm md:leading-8">
            دستگاه‌های متصل را مدیریت کنید، ماژول‌ها را پیکربندی کنید و وضعیت خانه را در لحظه زیر نظر بگیرید؛
            همه‌چیز از یک داشبورد یکپارچه و ساده در دسترس شماست.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-stretch gap-4 px-5 pb-6 sm:px-7 md:px-10 md:pb-9">
          <div className="h-px w-full bg-[var(--sidebar-border)]" />
          <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            <SettingsPortalButton onClick={() => setIsMenuOpen(true)} />
            <ModulesPortalButton onClick={() => setIsModulesMenuOpen(true)} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
