import { useEffect, useRef } from "react";

export function usePointerTracking(matrixMouseEffect: boolean) {
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const targetPointerRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const isMobile = window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const effectiveMouseEffect = matrixMouseEffect && !isMobile;

    if (!effectiveMouseEffect) return;

    const handlePointerMove = (e: PointerEvent) => {
      targetPointerRef.current.x = e.clientX;
      targetPointerRef.current.y = e.clientY;
    };
    
    const handlePointerLeave = () => {
      targetPointerRef.current.x = -1000;
      targetPointerRef.current.y = -1000;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [matrixMouseEffect]);

  return { pointerRef, targetPointerRef };
}
