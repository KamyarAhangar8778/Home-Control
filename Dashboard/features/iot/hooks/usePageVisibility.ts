"use client";

import { useEffect } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { publishPresence } from "@/features/iot/services/mqttService";

export function usePageVisibility() {
  const setIsPageVisible = useIoTStore((state) => state.setIsPageVisible);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsPageVisible(isVisible);
      publishPresence(isVisible);
    };

    // Set initial value
    setIsPageVisible(!document.hidden);
    // Don't publish initial presence here because initMqtt does it automatically, 
    // or we might publish before connected. We rely on the event listener for subsequent changes.

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setIsPageVisible]);
}
