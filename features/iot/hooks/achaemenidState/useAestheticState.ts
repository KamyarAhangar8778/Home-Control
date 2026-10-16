"use client";

import { useState } from "react";

export function useAestheticState() {
  const [isDark, setIsDark] = useState(false);
  const [accent3, setAccent3] = useState("#D4AF37");
  const [accent4, setAccent4] = useState("#10B981");
  const [selectedFont, setSelectedFont] = useState("changa");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [animationsFps, setAnimationsFps] = useState(60);
  const [headerAnimationType, setHeaderAnimationType] = useState<"fade" | "chase">("fade");
  const [headerTitle, setHeaderTitle] = useState("سامانه هوشمند پادشاهی هخامنش");
  const [matrixDensity, setMatrixDensity] = useState(40);
  const [matrixSize, setMatrixSize] = useState(4);
  const [matrixHoverSize, setMatrixHoverSize] = useState(3);
  const [matrixOpacity, setMatrixOpacity] = useState(15);
  const [matrixColor, setMatrixColor] = useState("#D4AF37");
  const [matrixMoving, setMatrixMoving] = useState(true);
  const [matrixMouseEffect, setMatrixMouseEffect] = useState(true);
  const [matrixTwinkleEffect, setMatrixTwinkleEffect] = useState(false);
  const [matrixTwinkleSpeed, setMatrixTwinkleSpeed] = useState(50);
  const [headerPosition, setHeaderPosition] = useState<"top" | "left">("top");
  const [dashboardBgColor, setDashboardBgColor] = useState("default");
  const [dashboardBgOpacity, setDashboardBgOpacity] = useState(10);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dashboardWidth, setDashboardWidth] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isGroupsCompactLayout, setIsGroupsCompactLayout] = useState(false);
  const [isSegmentsCompactLayout, setIsSegmentsCompactLayout] = useState(false);

  return {
    isDark,
    setIsDark,
    accent3,
    setAccent3,
    accent4,
    setAccent4,
    selectedFont,
    setSelectedFont,
    animationsEnabled,
    setAnimationsEnabled,
    animationsFps,
    setAnimationsFps,
    headerAnimationType,
    setHeaderAnimationType,
    headerTitle,
    setHeaderTitle,
    matrixDensity,
    setMatrixDensity,
    matrixSize,
    setMatrixSize,
    matrixHoverSize,
    setMatrixHoverSize,
    matrixOpacity,
    setMatrixOpacity,
    matrixColor,
    setMatrixColor,
    matrixMoving,
    setMatrixMoving,
    matrixMouseEffect,
    setMatrixMouseEffect,
    matrixTwinkleEffect,
    setMatrixTwinkleEffect,
    matrixTwinkleSpeed,
    setMatrixTwinkleSpeed,
    headerPosition,
    setHeaderPosition,
    dashboardBgColor,
    setDashboardBgColor,
    dashboardBgOpacity,
    setDashboardBgOpacity,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    dashboardWidth,
    setDashboardWidth,
    isGroupsCompactLayout,
    setIsGroupsCompactLayout,
    isSegmentsCompactLayout,
    setIsSegmentsCompactLayout,
  };
}
