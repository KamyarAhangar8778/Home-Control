import React from "react";
import ColorsSection from "../ColorsSection";
import TypographySection from "../TypographySection";
import StabilitySection from "../StabilitySection";
import MatrixSection from "../matrix-section/MatrixSection";
import HeaderSettingsSection from "../HeaderSettingsSection";
import AudioSection from "../audio-section/AudioSection";
import MqttSection from "../mqtt-section/MqttSection";
import MacrosSection from "../macros-section/MacrosSection";
import VoiceCommandsSection from "../voice-commands-section/VoiceCommandsSection";
import WifiSection from "../wifi-section/WifiSection";
import ConditionsSection from "../conditions-section/ConditionsSection";
import LayoutSection from "../layout-section/LayoutSection";

import { SettingsDrawerProps } from "./types";

interface SettingsTabContentProps extends SettingsDrawerProps {
  activeTab: string;
}

export function SettingsTabContent({
  activeTab,
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
  isDark,
  headerPosition,
  setHeaderPosition,
  dashboardWidth,
  setDashboardWidth,
  dashboardBgColor,
  setDashboardBgColor,
  dashboardBgOpacity,
  setDashboardBgOpacity,
  isGroupsCompactLayout,
  setIsGroupsCompactLayout,
  isSegmentsCompactLayout,
  setIsSegmentsCompactLayout,
}: SettingsTabContentProps) {
  switch (activeTab) {
    case "colors":
      return (
        <ColorsSection
          accent3={accent3}
          setAccent3={setAccent3}
          accent4={accent4}
          setAccent4={setAccent4}
          isDark={isDark}
          hideHeader={true}
        />
      );
    case "fonts":
      return (
        <TypographySection
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          hideHeader={true}
        />
      );
    case "animations":
      return (
        <StabilitySection
          animationsEnabled={animationsEnabled}
          setAnimationsEnabled={setAnimationsEnabled}
          animationsFps={animationsFps}
          setAnimationsFps={setAnimationsFps}
          hideHeader={true}
          isDark={isDark}
        />
      );
    case "macros":
      return <MacrosSection />;
    case "voice-commands":
      return <VoiceCommandsSection />;
    case "layout":
      return (
        <LayoutSection
          headerPosition={headerPosition}
          setHeaderPosition={setHeaderPosition}
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
          dashboardWidth={dashboardWidth}
          setDashboardWidth={setDashboardWidth}
          isGroupsCompactLayout={isGroupsCompactLayout}
          setIsGroupsCompactLayout={setIsGroupsCompactLayout}
          isSegmentsCompactLayout={isSegmentsCompactLayout}
          setIsSegmentsCompactLayout={setIsSegmentsCompactLayout}
        />
      );
    case "matrix":
      return (
        <MatrixSection
          matrixDensity={matrixDensity}
          setMatrixDensity={setMatrixDensity}
          matrixSize={matrixSize}
          setMatrixSize={setMatrixSize}
          matrixHoverSize={matrixHoverSize}
          setMatrixHoverSize={setMatrixHoverSize}
          matrixOpacity={matrixOpacity}
          setMatrixOpacity={setMatrixOpacity}
          matrixColor={matrixColor}
          setMatrixColor={setMatrixColor}
          matrixMoving={matrixMoving}
          setMatrixMoving={setMatrixMoving}
          matrixMouseEffect={matrixMouseEffect}
          setMatrixMouseEffect={setMatrixMouseEffect}
          matrixTwinkleEffect={matrixTwinkleEffect}
          setMatrixTwinkleEffect={setMatrixTwinkleEffect}
          matrixTwinkleSpeed={matrixTwinkleSpeed}
          setMatrixTwinkleSpeed={setMatrixTwinkleSpeed}
          hideHeader={true}
          accent3={accent3}
          accent4={accent4}
          isDark={isDark}
          dashboardBgColor={dashboardBgColor}
          setDashboardBgColor={setDashboardBgColor}
          dashboardBgOpacity={dashboardBgOpacity}
          setDashboardBgOpacity={setDashboardBgOpacity}
        />
      );
    case "audio":
      return <AudioSection />;
    case "mqtt":
      return <MqttSection />;
    case "wifi":
      return <WifiSection />;
    case "conditions":
      return <ConditionsSection />;
    default:
      return null;
  }
}
