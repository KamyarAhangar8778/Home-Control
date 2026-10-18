import { useEffect, useRef } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { CuneiformBackgroundProps } from "../core/types";

interface UseCanvasRenderParams extends Omit<CuneiformBackgroundProps, "accent3"> {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  targetPointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

export function useCanvasRender({
  canvasRef, targetPointerRef, isDark, matrixDensity, matrixSize, 
  matrixHoverSize, matrixOpacity, matrixColor, matrixMoving, matrixMouseEffect,
  matrixTwinkleEffect, matrixTwinkleSpeed, animationsEnabled = true, animationsFps = 60
}: UseCanvasRenderParams) {
  const isPageVisible = useIoTStore((state) => state.isPageVisible);
  const workerRef = useRef<Worker | null>(null);
  
  // Initialize worker
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const worker = new Worker(new URL('../core/cuneiform.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    
    const checkIsMobile = () => window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    try {
      const offscreen = canvas.transferControlToOffscreen();
      worker.postMessage({
        type: 'INIT',
        payload: {
          canvas: offscreen,
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio || 1,
          config: {
            isPageVisible,
            matrixDensity,
            matrixSize,
            matrixHoverSize,
            matrixOpacity,
            matrixColor,
            matrixMoving,
            matrixMouseEffect,
            matrixTwinkleEffect,
            matrixTwinkleSpeed,
            isDark,
            animationsEnabled,
            animationsFps,
            isMobile: checkIsMobile()
          }
        }
      }, [offscreen]);
    } catch (e) {
      console.warn("OffscreenCanvas transfer failed, possibly already transferred.", e);
    }

    const setCanvasSize = () => {
      if (workerRef.current) {
        workerRef.current.postMessage({
          type: 'RESIZE',
          payload: {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1,
            isMobile: checkIsMobile()
          }
        });
      }
    };

    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      worker.postMessage({ type: 'CLEANUP' });
      worker.terminate();
      workerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update pointer
  useEffect(() => {
    if (!matrixMouseEffect) return;

    // Send pointer updates to the worker periodically instead of every frame to reduce message passing overhead
    const interval = setInterval(() => {
      if (workerRef.current) {
        workerRef.current.postMessage({
          type: 'POINTER_UPDATE',
          payload: { x: targetPointerRef.current.x, y: targetPointerRef.current.y }
        });
      }
    }, 16);

    return () => clearInterval(interval);
  }, [targetPointerRef, matrixMouseEffect]);

  // Update config
  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'CONFIG_UPDATE',
        payload: {
          isPageVisible,
          matrixDensity,
          matrixSize,
          matrixHoverSize,
          matrixOpacity,
          matrixColor,
          matrixMoving,
          matrixMouseEffect,
          matrixTwinkleEffect,
          matrixTwinkleSpeed,
          isDark,
          animationsEnabled,
          animationsFps
        }
      });
    }
  }, [
    isPageVisible, isDark, matrixDensity, matrixSize, 
    matrixHoverSize, matrixOpacity, matrixColor, matrixMoving, matrixMouseEffect,
    matrixTwinkleEffect, matrixTwinkleSpeed, animationsEnabled, animationsFps
  ]);
}
