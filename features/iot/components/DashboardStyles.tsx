"use client";

import { getBaseStyles, getThemeStyles, getUtilityStyles, getAnimationStyles } from "./styles";

interface DashboardStylesProps {
  accent3: string;
  accent4: string;
  isDark: boolean;
  animationsEnabled: boolean;
}

export default function DashboardStyles({ accent3, accent4, isDark, animationsEnabled }: DashboardStylesProps) {
  const css = `${getBaseStyles(isDark)}${getThemeStyles({ accent3, accent4, isDark })}${getUtilityStyles({ isDark, animationsEnabled })}${getAnimationStyles({ isDark })}`;
  return <style>{css}</style>;
}
