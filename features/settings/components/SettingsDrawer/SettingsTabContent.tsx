import React from "react";
import StabilitySection from "../StabilitySection";
import AudioSection from "../audio-section/AudioSection";
import MqttSection from "../mqtt-section/MqttSection";
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
  animationsEnabled,
  setAnimationsEnabled,
  animationsFps,
  setAnimationsFps,
  headerTitle,
  setHeaderTitle,
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
    case "voice-commands":
      return <VoiceCommandsSection />;
    case "layout":
      return (
        <LayoutSection
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
          isGroupsCompactLayout={isGroupsCompactLayout}
          setIsGroupsCompactLayout={setIsGroupsCompactLayout}
          isSegmentsCompactLayout={isSegmentsCompactLayout}
          setIsSegmentsCompactLayout={setIsSegmentsCompactLayout}
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
