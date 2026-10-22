import React from "react";
import StabilitySection from "../StabilitySection";
import MatrixSection from "../matrix-section/MatrixSection";
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
  accent4,
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
  dashboardWidth,
  setDashboardWidth,
  isGroupsCompactLayout,
  setIsGroupsCompactLayout,
  isSegmentsCompactLayout,
  setIsSegmentsCompactLayout,
}: SettingsTabContentProps) {
  switch (activeTab) {
    case "animations":
      return (
        <StabilitySection
          animationsEnabled={animationsEnabled}
          setAnimationsEnabled={setAnimationsEnabled}
          animationsFps={animationsFps}
          setAnimationsFps={setAnimationsFps}
          hideHeader={true}
        />
      );
    case "macros":
      return <MacrosSection />;
    case "voice-commands":
      return <VoiceCommandsSection />;
    case "layout":
      return (
        <LayoutSection
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
