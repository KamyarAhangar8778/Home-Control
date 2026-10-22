"use client";

import React from "react";
import { getBaseStyles, getThemeStyles, getUtilityStyles, getAnimationStyles } from "./styles";

interface DashboardStylesProps {
  accent3: string;
  accent4: string;
  isDark: boolean;
  animationsEnabled: boolean;
}

export default function DashboardStyles({
  accent3,
  accent4,
  isDark,
  animationsEnabled,
}: DashboardStylesProps) {
  const baseCss = getBaseStyles(isDark);
  const themeCss = getThemeStyles({ accent3, accent4, isDark });
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
