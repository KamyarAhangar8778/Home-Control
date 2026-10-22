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
