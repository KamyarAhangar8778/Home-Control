import { useState, useEffect, useRef } from "react";

export function useSettingsAdjuster(isOpen: boolean, settingsSignature: string) {
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialOpenRef = useRef<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      isInitialOpenRef.current = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    if (isInitialOpenRef.current) {
      isInitialOpenRef.current = false;
      return;
    }

    // A change inside settings has been initiated
    setIsAdjusting(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsAdjusting(false);
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [settingsSignature, isOpen]);

  return { isAdjusting, setIsAdjusting };
}
