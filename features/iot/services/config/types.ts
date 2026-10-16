export interface EspConfig {
  version: string;
  device: {
    name: string;
    chip: string;
    firmware: string;
    reboot_count: number;
    last_boot: string;
  };
  preferences: {
    theme_mode: "dark" | "light";
    accent_color_3: string;
    accent_color_4: string;
    font_family: string;
    animations_enabled: boolean;
    animations_fps?: number;
    header_animation: "fade" | "chase";
    header_title: string;
    matrix_density: number;
    matrix_size: number;
    matrix_hover_size: number;
    matrix_color: string;
    matrix_moving: boolean;
    matrix_mouse_effect: boolean;
    matrix_twinkle_effect?: boolean;
    matrix_twinkle_speed?: number;
    cuneiform_opacity?: number;
    cuneiform_color?: "accent3" | "accent4" | "white" | "muted";
    header_position?: "top" | "left";
    manual_save_mode?: boolean;
    dashboard_width?: 1 | 2 | 3 | 4 | 5;
    dashboard_bg_color?: string;
    dashboard_bg_opacity?: number;
    groups_compact_layout?: boolean;
    segments_compact_layout?: boolean;
  };
  layout: {
    groups_order: string[];
    groups_cols: number;
    group_configs: Record<string, { maxCols: number }>;
  };
  segments: Array<{
    id: string;
    type: string;
    pin: string;
    title: string;
    group: string;
    icon?: string;
    state?: boolean;
    mode?: "switch" | "push";
    auto_off?: number;
    rule?: {
      highActions?: Array<{
        reqHold: number;
        targetPin: string;
        actionOn: boolean;
        actionType?: number;
        delay?: number;
      }>;
      lowActions?: Array<{
        reqHold: number;
        targetPin: string;
        actionOn: boolean;
        actionType?: number;
        delay?: number;
      }>;
      targetPinHigh?: string;
      actionOnHigh?: boolean;
      actionTypeHigh?: number;
      delayHigh?: number;
      reqHoldHigh?: number;
      targetPinLow?: string;
      actionOnLow?: boolean;
      actionTypeLow?: number;
      delayLow?: number;
      reqHoldLow?: number;
      targetPin?: string;
      triggerState?: boolean;
      actionState?: boolean;
    };
  }>;
  automations?: Array<{
    id: string;
    title: string;
    time: string;
    days: number[];
    enabled: boolean;
    repeatCount?: number;
    intervalMinutes?: number;
    conditionType?: 'time' | 'weather';
    city?: string;
    temperatureThreshold?: number;
    temperatureCondition?: 'greater' | 'less';
    actions: Array<{
      targetPin?: string;
      targetMacro?: string;
      actionOn?: boolean;
    }>;
  }>;
  macros?: Array<{
    id: string;
    title: string;
    icon?: string;
    actions: Array<{
      targetPin: string;
      actionOn: boolean;
    }>;
  }>;
  voiceCommands?: Array<{
    id: string;
    phrase: string;
    actions: Array<{
      targetPin?: string;
      targetMacro?: string;
      actionOn?: boolean;
    }>;
  }>;
  mqtt?: {
    broker_ws_url: string;
    broker_host: string;
    broker_port: number;
    base_topic: string;
    qos: 0 | 1 | 2;
  };
  wifi?: {
    networks: Array<{
      id: string;
      ssid: string;
      password?: string;
    }>;
  };
  worker_url?: string;
}
