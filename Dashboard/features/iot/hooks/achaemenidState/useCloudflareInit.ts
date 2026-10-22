"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { EspConfig } from "@/features/iot/services/esp32Config";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { debugLog } from "@/lib/debug";
import {
  isCloudflareEnabled,
  fetchConfigFromCloudflare,
  getCloudflareWorkerUrl,
  setCloudflareWorkerUrl,
} from "@/features/iot/services/cloudflareService";

interface UseCloudflareInitProps {
  mounted: boolean;
  handleApplyEspConfig: (config: EspConfig) => void;
}

export function useCloudflareInit({ mounted: _mounted, handleApplyEspConfig }: UseCloudflareInitProps) {
  const setSegments = useIoTStore((state) => state.setSegments);
  const setGroupsOrder = useIoTStore((state) => state.setGroupsOrder);
  const setGroupConfigs = useIoTStore((state) => state.setGroupConfigs);
  const setSyncStatus = useIoTStore((state) => state.setSyncStatus);
  const [isFullyReady, setIsFullyReady] = useState(false);
  const [workerUrl, setWorkerUrlState] = useState(() => getCloudflareWorkerUrl());
  const bypassedRef = useRef(false);

  const handleWorkerUrlChange = useCallback((url: string) => {
    setWorkerUrlState(url);
    setCloudflareWorkerUrl(url);
  }, []);

  const handleBypassSync = useCallback(() => {
    bypassedRef.current = true;

    // Optional offline recovery is explicitly disabled during development.
    if (FEATURE_FLAGS.configLocalCache && typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("cached_esp_config");
        if (cached) {
          const cachedConfig = JSON.parse(cached) as EspConfig;
          if (cachedConfig && Array.isArray(cachedConfig.segments) && cachedConfig.layout) {
            handleApplyEspConfig(cachedConfig);
            setSyncStatus(false, 100, "اتصال به سرور برقرار نیست؛ تنظیمات کش‌شده بارگذاری شد.");
            setIsFullyReady(true);
            debugLog.warn("ConfigSync", "Recovered configuration from optional local cache.");
            return;
          }
        }
      } catch (error) {
        debugLog.error("ConfigSync", "Could not read optional configuration cache.", error);
      }
    }

    // Never resurrect stale configuration or seed demo/default segments when cloud sync fails.
    setSegments([]);
    setGroupsOrder([]);
    setGroupConfigs({});
    setSyncStatus(false, 0, "تنظیمات از سرور دریافت نشد؛ داشبورد با گروه‌ها و سگمنت‌های خالی آماده است.");
    setIsFullyReady(true);
    debugLog.warn("ConfigSync", "Cloud configuration unavailable; initialized empty groups and segments.");
  }, [setGroupConfigs, setGroupsOrder, setSegments, setSyncStatus]);

  const initCloudflareSync = useCallback(async () => {
    let attemptCount = 0;
    const maxAttempts = 5;

    if (typeof window !== "undefined" && !FEATURE_FLAGS.configLocalCache) {
      localStorage.removeItem("cached_esp_config");
    }

    if (!isCloudflareEnabled()) {
      debugLog.warn("ConfigSync", "Cloudflare is disabled; no default configuration will be applied.");
      handleBypassSync();
      return;
    }

    bypassedRef.current = false;
    while (!bypassedRef.current && attemptCount < maxAttempts) {
      attemptCount++;
      setSyncStatus(
        true,
        Math.min(10 + attemptCount * 15, 95),
        `در حال دریافت تنظیمات از سرور ابری (تلاش ${attemptCount} از ${maxAttempts})...`,
      );

      try {
        const cfConfig = await fetchConfigFromCloudflare();
        if (cfConfig && Array.isArray(cfConfig.segments)) {
          if (bypassedRef.current) return;
          if (cfConfig.worker_url) handleWorkerUrlChange(cfConfig.worker_url);

          if (FEATURE_FLAGS.configLocalCache && typeof window !== "undefined") {
            try {
              localStorage.setItem("cached_esp_config", JSON.stringify(cfConfig));
            } catch (error) {
              debugLog.error("ConfigSync", "Could not write optional configuration cache.", error);
            }
          }

          handleApplyEspConfig(cfConfig);
          setSyncStatus(false, 100, "همگام‌سازی تنظیمات انجام شد.");
          setIsFullyReady(true);
          debugLog.info("ConfigSync", "Cloud configuration applied.", {
            segments: cfConfig.segments.length,
            groups: cfConfig.layout?.groups_order?.length ?? 0,
          });
          return;
        }

        debugLog.warn("ConfigSync", "Cloudflare returned an invalid configuration payload.", {
          attempt: attemptCount,
        });
      } catch (error) {
        debugLog.error("ConfigSync", "Cloud configuration request failed.", {
          attempt: attemptCount,
          error,
        });
      }

      if (bypassedRef.current) return;
      if (attemptCount < maxAttempts) {
        setSyncStatus(true, Math.min(10 + attemptCount * 15, 95), "دریافت تنظیمات ناموفق بود؛ تلاش مجدد...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    if (!bypassedRef.current) handleBypassSync();
  }, [handleApplyEspConfig, handleBypassSync, handleWorkerUrlChange, setSyncStatus]);

  useEffect(() => {
    void initCloudflareSync();
  }, [initCloudflareSync]);

  return {
    isFullyReady,
    setIsFullyReady,
    handleBypassSync,
    workerUrl,
    setWorkerUrl: handleWorkerUrlChange,
    handleRetrySync: initCloudflareSync,
  };
}
