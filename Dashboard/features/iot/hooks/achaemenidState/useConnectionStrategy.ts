"use client";

import { useEffect, useRef } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { getLocalWs, setLocalWs, dispatchLocalState } from "@/features/iot/services/localWs/client";

export function useConnectionStrategy() {
  const localIp = useIoTStore((state) => state.localIp);
  const setIsLocal = useIoTStore((state) => state.setIsLocal);
  const setPinsState = useIoTStore((state) => state.setPinsState);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!localIp) return;

    let ws: WebSocket | null = null;
    let isMounted = true;

    const connect = () => {
      // فقط در محیط Capacitor (موبایل) اجازه اتصال WebSocket محلی می‌دهیم
      // در مرورگر وب به دلیل خطای Mixed Content فقط از MQTT استفاده می‌شود
      // @ts-ignore
      const isNative = typeof window !== "undefined" && window.Capacitor?.isNative;
      if (!isNative) {
        console.log("[LocalWS] Skipped: Not running in Native Capacitor App.");
        return;
      }

      if (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) return;

      
      console.log(`[LocalWS] Attempting connection to ws://${localIp}:81`);
      ws = new WebSocket(`ws://${localIp}:81`);
      setLocalWs(ws);

      ws.onopen = () => {
        if (!isMounted) return;
        console.log("[LocalWS] Connected successfully to ESP32.");
        setIsLocal(true);
        // Request initial state from RAM
        ws?.send(JSON.stringify({ command: "get_state" }));
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "state_sync" && data.states) {
            // Bulk sync on connect
            setPinsState(data.states);
            console.log("[LocalWS] Received full state sync:", data.states);
          } else if (data.pin !== undefined && data.state !== undefined) {
            // Individual pin update
            dispatchLocalState(data.pin.toString(), data.state === 1 || data.state === true);
          }
        } catch (e) {
          console.error("[LocalWS] Message parsing error:", e);
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;
        console.warn("[LocalWS] Disconnected. Falling back to Global (MQTT).");
        setIsLocal(false);
        setLocalWs(null);
        
        // Try reconnecting after 5 seconds if still on the same IP
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      };

      ws.onerror = (err) => {
        // Will trigger onclose automatically
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (ws) {
        ws.close();
        setLocalWs(null);
      }
      setIsLocal(false);
    };
  }, [localIp, setIsLocal, setPinsState]);
}
