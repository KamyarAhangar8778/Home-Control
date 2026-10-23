"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowUpLeft, Compass, House, Layers3, Settings2, Wifi } from "lucide-react";
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

export default function WelcomePortal({
  setIsMenuOpen,
  setIsModulesMenuOpen,
  animationsEnabled = true,
}: WelcomePortalProps) {
  return (
    <motion.section
      key="welcome-prompt"
      initial={animationsEnabled ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={animationsEnabled ? { opacity: 0, y: 8 } : undefined}
      transition={{ duration: animationsEnabled ? 0.24 : 0 }}
      className="mx-auto w-full max-w-5xl px-3 py-5 text-right sm:px-5 sm:py-8"
      dir="rtl"
      aria-labelledby="welcome-title"
    >
      <Card className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
        <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_minmax(250px,0.72fr)]">
          <CardHeader className="min-w-0 gap-5 px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex min-h-7 items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--card-hover-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                <Compass className="h-3.5 w-3.5 text-[var(--accent3)]" aria-hidden="true" />
                داشبورد خانه هوشمند
              </span>
              <span className="inline-flex min-h-7 items-center gap-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                آماده راه‌اندازی
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-[var(--text-secondary)]">درود، خوش آمدید</p>
              <CardTitle
                id="welcome-title"
                className="max-w-2xl text-balance text-right text-2xl font-bold leading-[1.65] tracking-tight text-[var(--text-primary)] sm:text-3xl sm:leading-[1.55] lg:text-4xl"
              >
                کنترل خانه،{" "}
                <span className="text-[var(--accent3)]">یکپارچه و ساده</span>
              </CardTitle>
              <CardDescription className="max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
                چراغ‌ها، ماژول‌ها و اتوماسیون‌های خانه را از یک فضای کاری مدیریت کنید. برای شروع، تنظیمات ارتباط را بررسی کنید یا ماژول‌های خود را اضافه کنید.
              </CardDescription>
            </div>

            <CardContent className="flex flex-col gap-3 p-0 pt-1 sm:flex-row sm:flex-wrap">
              <SettingsPortalButton onClick={() => setIsMenuOpen(true)} />
              <ModulesPortalButton onClick={() => setIsModulesMenuOpen(true)} />
            </CardContent>
          </CardHeader>

          <aside className="relative flex min-h-52 flex-col justify-between overflow-hidden border-t border-[var(--border-color)] bg-[var(--bg-main)] p-5 sm:p-7 lg:border-r lg:border-t-0 lg:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
              <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full border border-[var(--border-color)]" />
              <div className="absolute -left-5 -top-5 h-28 w-28 rounded-full border border-[var(--border-color)]" />
              <div className="absolute bottom-0 left-0 h-px w-full bg-[var(--border-color)]" />
            </div>

            <div className="relative flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-[var(--text-secondary)]">نمای کلی سامانه</span>
              <span className="rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 font-mono text-[10px] text-[var(--text-secondary)]" dir="ltr">
                EDGE / IOT
              </span>
            </div>

            <div className="relative my-7 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm sm:h-28 sm:w-28">
                <House className="h-11 w-11 text-[var(--accent3)] sm:h-12 sm:w-12" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div className="absolute right-[calc(50%+3.5rem)] top-1/2 h-px w-7 bg-[var(--border-color)] sm:right-[calc(50%+4rem)]" />
              <div className="absolute left-[calc(50%+3.5rem)] top-1/2 h-px w-7 bg-[var(--border-color)] sm:left-[calc(50%+4rem)]" />
              <div className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--accent4)] sm:h-11 sm:w-11">
                <Wifi className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="absolute left-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--accent3)] sm:h-11 sm:w-11">
                <Layers3 className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-3">
              <div className="min-w-0 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-3">
                <div className="mb-2 flex items-center gap-2 text-[var(--text-secondary)]">
                  <Wifi className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs">ارتباط دستگاه</span>
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">MQTT / WebSocket</p>
              </div>
              <div className="min-w-0 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-3">
                <div className="mb-2 flex items-center gap-2 text-[var(--text-secondary)]">
                  <Settings2 className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs">شروع کار</span>
                </div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
                  راه‌اندازی سامانه
                  <ArrowUpLeft className="h-3.5 w-3.5 shrink-0 text-[var(--accent3)]" aria-hidden="true" />
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Card>
    </motion.section>
  );
}
