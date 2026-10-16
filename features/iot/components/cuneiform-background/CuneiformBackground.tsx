"use client";

import React, { useRef } from "react";
import { CuneiformBackgroundProps } from "./core/types";
import { usePointerTracking } from "./hooks/usePointerTracking";
import { useCanvasRender } from "./hooks/useCanvasRender";

export default function CuneiformBackground(props: CuneiformBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { pointerRef, targetPointerRef } = usePointerTracking(props.matrixMouseEffect);

  useCanvasRender({
    canvasRef,
    pointerRef,
    targetPointerRef,
    ...props
  });

  return (
    <>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)] opacity-95 z-0 pointer-events-none transition-colors duration-500" />
      
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.8 }}
      />

      <div
        className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent3)] to-transparent z-0 transition-colors duration-500"
        style={{ backgroundColor: props.accent3, opacity: 0.15 }}
      />
    </>
  );
}
