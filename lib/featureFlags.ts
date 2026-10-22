/**
 * Runtime switches for optional browser-side behavior.
 * Keep configuration caching disabled during development so Cloudflare remains authoritative.
 */
export const FEATURE_FLAGS = {
  configLocalCache: false,
  audioLocalCache: true,
  debugLogging: true,
} as const;
