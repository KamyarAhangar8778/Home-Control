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

    if (config.preferences.matrix_density !== undefined) store.setMatrixDensity(config.preferences.matrix_density);
    if (config.preferences.matrix_size !== undefined) store.setMatrixSize(config.preferences.matrix_size);
    if (config.preferences.matrix_hover_size !== undefined) store.setMatrixHoverSize(config.preferences.matrix_hover_size);
    if (config.preferences.matrix_color !== undefined) store.setMatrixColor(config.preferences.matrix_color);
    if (config.preferences.matrix_moving !== undefined) store.setMatrixMoving(config.preferences.matrix_moving);
    if (config.preferences.matrix_mouse_effect !== undefined) store.setMatrixMouseEffect(config.preferences.matrix_mouse_effect);
    if (config.preferences.matrix_twinkle_effect !== undefined) store.setMatrixTwinkleEffect(config.preferences.matrix_twinkle_effect);
    if (config.preferences.matrix_twinkle_speed !== undefined) store.setMatrixTwinkleSpeed(config.preferences.matrix_twinkle_speed);

    if (config.preferences.dashboard_width) {
      store.setDashboardWidth(config.preferences.dashboard_width);
    }
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
