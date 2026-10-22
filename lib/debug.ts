import { FEATURE_FLAGS } from "./featureFlags";

type LogDetails = Record<string, unknown> | unknown;

function write(
  level: "debug" | "info" | "warn" | "error",
  scope: string,
  message: string,
  details?: LogDetails,
) {
  if (level === "debug" && !FEATURE_FLAGS.debugLogging) return;

  const prefix = `[HomeControl:${scope}]`;
  const logger = console[level] as (...args: unknown[]) => void;
  if (details === undefined) {
    logger(prefix, message);
  } else {
    logger(prefix, message, details);
  }
}

export const debugLog = {
  debug: (scope: string, message: string, details?: LogDetails) =>
    write("debug", scope, message, details),
  info: (scope: string, message: string, details?: LogDetails) =>
    write("info", scope, message, details),
  warn: (scope: string, message: string, details?: LogDetails) =>
    write("warn", scope, message, details),
  error: (scope: string, message: string, details?: LogDetails) =>
    write("error", scope, message, details),
};
