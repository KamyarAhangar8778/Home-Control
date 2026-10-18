import React from "react";

interface UseSegmentButtonPropsParams {
  mode: "switch" | "push";
  pin: string;
  onTogglePin: (pin: string) => void;
  onSetPinState?: (pin: string, state: boolean) => void;
}

export default function useSegmentButtonProps({
  mode,
  pin,
  onTogglePin,
  onSetPinState,
}: UseSegmentButtonPropsParams) {
  if (mode === "push") {
    return {
      onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onSetPinState?.(pin, true);
      },
      onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onSetPinState?.(pin, false);
      },
      onPointerLeave: (e: React.PointerEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onSetPinState?.(pin, false);
      },
      onPointerCancel: (e: React.PointerEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onSetPinState?.(pin, false);
      },
      onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onSetPinState?.(pin, true);
      },
      onTouchEnd: (e: React.TouchEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onSetPinState?.(pin, false);
      },
    };
  }

  return {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onTogglePin(pin);
    },
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      e.stopPropagation();
    },
  };
}
