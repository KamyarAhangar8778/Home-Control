"use client";

import React from "react";
import { getBaseStyles, getThemeStyles, getUtilityStyles, getAnimationStyles } from "./styles";

interface DashboardStylesProps {
  accent3: string;
  accent4: string;
  isDark: boolean;
  selectedFont: string;
  animationsEnabled: boolean;
  dashboardBgColor?: string;
  dashboardBgOpacity?: number;
}

export default function DashboardStyles({
  accent3,
  accent4,
  isDark,
  selectedFont,
  animationsEnabled,
  dashboardBgColor = "default",
  dashboardBgOpacity = 10,
}: DashboardStylesProps) {
  const baseCss = getBaseStyles(isDark);
  const themeCss = getThemeStyles({ accent3, accent4, isDark, selectedFont, dashboardBgColor, dashboardBgOpacity });
  const utilityCss = getUtilityStyles({ isDark, animationsEnabled });
  const animationCss = getAnimationStyles({ isDark });

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `${baseCss}${themeCss}${utilityCss}${animationCss}`,
      }}
    />
  );
}
