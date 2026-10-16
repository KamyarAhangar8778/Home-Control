import { EspConfig } from "./types";

export function validateEspConfig(config: any): config is EspConfig {
  if (!config) return false;
  if (typeof config !== "object") return false;
  if (!config.version || typeof config.version !== "string") return false;
  if (!config.preferences || typeof config.preferences !== "object") return false;
  if (!config.layout || typeof config.layout !== "object") return false;
  if (!Array.isArray(config.segments)) return false;

  const prefs = config.preferences;
  if (typeof prefs.theme_mode !== "string") return false;
  if (typeof prefs.accent_color_3 !== "string") return false;
  if (typeof prefs.accent_color_4 !== "string") return false;
  if (typeof prefs.font_family !== "string") return false;

  return true;
}
