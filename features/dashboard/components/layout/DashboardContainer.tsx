"use client";

import React from "react";
import { MotionConfig } from "motion/react";
import DashboardStyles from "@/features/iot/components/DashboardStyles";
import CuneiformBackground from "@/features/iot/components/cuneiform-background";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import DashboardHeader from "./DashboardHeader";
import DashboardMain from "./DashboardMain";
import DashboardDrawers from "./DashboardDrawers";
import ToastNotification from "@/features/iot/components/notifications/ToastNotification";
import ScrollToTopButton from "../widgets/ScrollToTopButton";
import { useDashboardLayout } from "../../hooks/useDashboardLayout";
import { usePageVisibility } from "@/features/iot/hooks/usePageVisibility";

export default function DashboardContainer() {
  usePageVisibility();

  const accent3 = useIoTStore(s => s.accent3);
  const accent4 = useIoTStore(s => s.accent4);
  const isDark = useIoTStore(s => s.isDark);
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const animationsFps = useIoTStore(s => s.animationsFps);
  const matrixDensity = useIoTStore(s => s.matrixDensity);
  const matrixSize = useIoTStore(s => s.matrixSize);
  const matrixHoverSize = useIoTStore(s => s.matrixHoverSize);
  const matrixOpacity = useIoTStore(s => s.matrixOpacity);
  const matrixColor = useIoTStore(s => s.matrixColor);
  const matrixMoving = useIoTStore(s => s.matrixMoving);
  const matrixMouseEffect = useIoTStore(s => s.matrixMouseEffect);
  const matrixTwinkleEffect = useIoTStore(s => s.matrixTwinkleEffect);
  const matrixTwinkleSpeed = useIoTStore(s => s.matrixTwinkleSpeed);
  const dashboardWidth = useIoTStore(s => s.dashboardWidth);

  const { leftHeaderContentWidth } = useDashboardLayout(dashboardWidth);

  return (
    <MotionConfig reducedMotion={animationsEnabled ? "user" : "always"}>
      <div className="theme-bg-main theme-text-secondary min-h-screen relative font-sans leading-relaxed selection:bg-[var(--accent3-transparent)] selection:text-[var(--accent3)] transition-colors duration-500 overflow-x-clip">
        <div className="animate-fade-in">
          <DashboardStyles
            accent3={accent3}
            accent4={accent4}
            isDark={isDark}
            animationsEnabled={animationsEnabled}
          />

          <CuneiformBackground
            isDark={isDark}
            matrixDensity={matrixDensity}
            matrixSize={matrixSize}
            matrixHoverSize={matrixHoverSize}
            matrixOpacity={matrixOpacity}
            matrixColor={matrixColor}
            matrixMoving={matrixMoving}
            matrixMouseEffect={matrixMouseEffect}
            matrixTwinkleEffect={matrixTwinkleEffect}
            matrixTwinkleSpeed={matrixTwinkleSpeed}
            accent3={accent3}
            animationsEnabled={animationsEnabled}
            animationsFps={animationsFps}
          />

          <div className="relative z-10 flex flex-row items-stretch w-full min-h-screen transition-all duration-500">
            <DashboardHeader />
            <div className={`flex-1 min-w-0 flex flex-col justify-between gap-8 p-3 md:p-6 md:pt-1 md:pb-8 md:px-8 ${leftHeaderContentWidth} w-full mx-auto`}>
              <DashboardMain />
            </div>
          </div>

          <DashboardDrawers />
          <ToastNotification />
          <ScrollToTopButton />
        </div>
      </div>
    </MotionConfig>
  );
}
