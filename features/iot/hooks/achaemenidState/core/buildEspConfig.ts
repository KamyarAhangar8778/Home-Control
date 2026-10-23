import { EspConfig } from "@/features/iot/services/esp32Config";
import { getCloudflareWorkerUrl } from "@/features/iot/services/cloudflareService";

export function buildEspConfig(params: any): EspConfig {
  return {
    version: "1.2.0-Achaemenid",
    device: {
      name: "سامانه مرزی پاسارگاد",
      chip: "ESP32-S3-WROOM-1",
      firmware: "v3.4.1-Achaemenid-OS",
      reboot_count: 0,
      last_boot: new Date().toISOString(),
    },
    preferences: {
      theme_mode: params.isDark ? "dark" : "light",
      accent_color_3: params.accent3,
      accent_color_4: params.accent4,
      font_family: params.selectedFont,
      animations_enabled: params.animationsEnabled,
      animations_fps: params.animationsFps,
      header_animation: params.headerAnimationType,
      header_title: params.headerTitle,
      header_position: params.headerPosition,
      dashboard_bg_color: params.dashboardBgColor,
      dashboard_bg_opacity: params.dashboardBgOpacity,
      manual_save_mode: params.manualSaveMode,
    },
    layout: {
      groups_order: params.groupsOrder,
      groups_cols: params.groupsCols,
      group_configs: params.groupConfigs,
    },
    segments: params.segments,
    automations: params.automations,
    macros: params.macros,
    voiceCommands: params.voiceCommands,
    wifi: {
      networks: params.wifiNetworks,
    },
    mqtt: params.mqttConfig || undefined,
    worker_url: getCloudflareWorkerUrl(),
  };
}
