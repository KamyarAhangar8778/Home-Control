import { useState, useEffect } from "react";

interface UseAutoOffTimerProps {
  isPinOn: boolean;
  autoOff: number | undefined;
  mode: "switch" | "push";
  pin: string;
  onSetPinState?: (pin: string, state: boolean, force?: boolean) => void;
}

export function useAutoOffTimer({
  isPinOn,
  autoOff,
  mode,
  pin,
  onSetPinState,
}: UseAutoOffTimerProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (isPinOn && autoOff && autoOff > 0) {
      setCountdown(autoOff);
    } else {
      setCountdown(null);
    }
  }, [isPinOn, autoOff]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      if (mode === "switch" || mode === "push") {
        onSetPinState?.(pin, false, true);
      }
      setCountdown(null);
      return;
    }
    const timerId = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timerId);
  }, [countdown, pin, onSetPinState, mode]);

  return { countdown };
}
