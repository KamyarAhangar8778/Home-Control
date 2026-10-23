import { useCallback } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { EspConfig } from "@/features/iot/services/esp32Config";

export function useApplyEspConfig() {
  const handleApplyEspConfig = useCallback((config: EspConfig) => {
    if (!config) return;

    // Read the store imperatively so this callback stays stable across state updates.
    const store = useIoTStore.getState();

    store.setAnimationsEnabled(config.preferences.animations_enabled);

    if (config.preferences.animations_fps !== undefined) store.setAnimationsFps(config.preferences.animations_fps);
    store.setHeaderTitle(config.preferences.header_title);


    if (config.preferences.manual_save_mode !== undefined) {
      store.setManualSaveMode(config.preferences.manual_save_mode);
    }
    if (config.preferences.groups_compact_layout !== undefined) {
      store.setIsGroupsCompactLayout(config.preferences.groups_compact_layout);
    }
    if (config.preferences.segments_compact_layout !== undefined) {
      store.setIsSegmentsCompactLayout(config.preferences.segments_compact_layout);
    }

    store.applyEspConfig(config);
  }, []);

  return { handleApplyEspConfig };
}
