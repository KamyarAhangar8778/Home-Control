"use client";

import { useCallback, useEffect, useRef } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { isCloudflareEnabled, saveConfigToCloudflare } from "@/features/iot/services/cloudflareService";
import { buildEspConfig } from "./core/buildEspConfig";

export function useCloudflarePush(isFullyReady: boolean) {
  const store = useIoTStore();
  const isFirstRender = useRef(true);

  const triggerCloudflarePush = useCallback(async () => {
    if (!isCloudflareEnabled() || !isFullyReady) return;

    const currentConfig = buildEspConfig(store);

    const result = await saveConfigToCloudflare(currentConfig);
    if (result.success) {
      store.showToast(result.message, "success");
      store.resetUnsavedChanges();
    } else {
      store.showToast(result.message, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isFullyReady,
    store.isDark,
    store.accent3,
    store.accent4,
    store.selectedFont,
    store.animationsEnabled,
    store.animationsFps,
    store.headerAnimationType,
    store.headerTitle,
    store.matrixDensity,
    store.matrixSize,
    store.matrixHoverSize,
    store.matrixColor,
    store.matrixMoving,
    store.matrixMouseEffect,
    store.matrixTwinkleEffect,
    store.matrixTwinkleSpeed,
    store.headerPosition,
    store.dashboardWidth,
    store.dashboardBgColor,
    store.dashboardBgOpacity,
    store.isGroupsCompactLayout,
    store.isSegmentsCompactLayout,
    store.manualSaveMode,
    store.segments,
    store.groupsOrder,
    store.groupConfigs,
    store.groupsCols,
    store.showToast,
    store.resetUnsavedChanges,
    store.automations,
    store.macros,
    store.voiceCommands,
    store.wifiNetworks,
    store.mqttConfig,
  ]);

  useEffect(() => {
    if (!isFullyReady) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (store.manualSaveMode) {
        store.incrementUnsavedChanges();
      } else {
        triggerCloudflarePush();
      }
    }, 1200);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isFullyReady,
    store.isDark,
    store.accent3,
    store.accent4,
    store.selectedFont,
    store.animationsEnabled,
    store.animationsFps,
    store.headerAnimationType,
    store.headerTitle,
    store.matrixDensity,
    store.matrixSize,
    store.matrixHoverSize,
    store.matrixColor,
    store.matrixMoving,
    store.matrixMouseEffect,
    store.matrixTwinkleEffect,
    store.matrixTwinkleSpeed,
    store.headerPosition,
    store.dashboardWidth,
    store.dashboardBgColor,
    store.dashboardBgOpacity,
    store.isGroupsCompactLayout,
    store.isSegmentsCompactLayout,
    store.segments,
    store.groupsOrder,
    store.groupConfigs,
    store.groupsCols,
    store.automations,
    store.macros,
    store.voiceCommands,
    store.wifiNetworks,
    store.mqttConfig,
  ]);

  return { triggerCloudflarePush };
}
