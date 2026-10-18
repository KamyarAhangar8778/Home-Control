"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { MatrixSliders } from "./MatrixSliders";
import { MatrixColorPicker } from "./MatrixColorPicker";
import { MatrixBgColorPicker } from "./MatrixBgColorPicker";
import { MatrixToggles } from "./MatrixToggles";

interface MatrixSectionProps {
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
  hideHeader?: boolean;
  accent3?: string;
  accent4?: string;
  isDark?: boolean;
  dashboardBgColor?: string;
  setDashboardBgColor?: (val: string) => void;
  dashboardBgOpacity?: number;
  setDashboardBgOpacity?: (val: number) => void;
}

export default function MatrixSection({
  matrixDensity, setMatrixDensity,
  matrixSize, setMatrixSize,
  matrixHoverSize, setMatrixHoverSize,
  matrixOpacity, setMatrixOpacity,
  matrixColor, setMatrixColor,
  matrixMoving, setMatrixMoving,
  matrixMouseEffect, setMatrixMouseEffect,
  matrixTwinkleEffect, setMatrixTwinkleEffect,
  matrixTwinkleSpeed, setMatrixTwinkleSpeed,
  hideHeader = false,
  accent3 = "#10b981",
  accent4 = "#3b82f6",
  isDark = true,
  dashboardBgColor = "default",
  setDashboardBgColor,
  dashboardBgOpacity = 10,
  setDashboardBgOpacity,
}: MatrixSectionProps) {
  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {!hideHeader && (
        <div className="flex items-center gap-3 text-[var(--accent3)] mb-6">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-xl font-bold">تنظیمات انیمیشن پس‌زمینه ماتریکس</h2>
        </div>
      )}

      <div className="space-y-6">
        <MatrixSliders 
          matrixDensity={matrixDensity} setMatrixDensity={setMatrixDensity}
          matrixSize={matrixSize} setMatrixSize={setMatrixSize}
          matrixHoverSize={matrixHoverSize} setMatrixHoverSize={setMatrixHoverSize}
          matrixOpacity={matrixOpacity} setMatrixOpacity={setMatrixOpacity}
        />

        <MatrixColorPicker 
          matrixColor={matrixColor} setMatrixColor={setMatrixColor}
          accent3={accent3} accent4={accent4}
        />

        {setDashboardBgColor && setDashboardBgOpacity && (
          <MatrixBgColorPicker 
            dashboardBgColor={dashboardBgColor} setDashboardBgColor={setDashboardBgColor}
            dashboardBgOpacity={dashboardBgOpacity} setDashboardBgOpacity={setDashboardBgOpacity}
            accent3={accent3} accent4={accent4} isDark={isDark}
          />
        )}

        <MatrixToggles 
          matrixMoving={matrixMoving} setMatrixMoving={setMatrixMoving}
          matrixMouseEffect={matrixMouseEffect} setMatrixMouseEffect={setMatrixMouseEffect}
          matrixTwinkleEffect={matrixTwinkleEffect} setMatrixTwinkleEffect={setMatrixTwinkleEffect}
          matrixTwinkleSpeed={matrixTwinkleSpeed} setMatrixTwinkleSpeed={setMatrixTwinkleSpeed}
        />
      </div>
    </div>
  );
}
