import { useState, useLayoutEffect, useEffect, useRef } from "react";

export function useGroupHeaderLayout() {
  const [isCompact, setIsCompact] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = titleContainerRef.current;
    const text = titleTextRef.current;
    if (!container || !text) return;

    const checkSpace = () => {
      const textWidth = text.scrollWidth;
      const textClientWidth = text.clientWidth;

      if (!isCompact) {
        if (textWidth > textClientWidth) {
          setIsCompact(true);
        }
      } else {
        const layoutSelectorWidth = 100;
        if (textClientWidth - layoutSelectorWidth >= textWidth) {
          setIsCompact(false);
          setIsSettingsOpen(false);
        }
      }
    };

    const observer = new ResizeObserver(checkSpace);
    observer.observe(container);
    return () => observer.disconnect();
  }, [isCompact]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  return {
    isCompact,
    isSettingsOpen,
    setIsSettingsOpen,
    titleContainerRef,
    titleTextRef,
    buttonRef,
    menuRef,
  };
}
