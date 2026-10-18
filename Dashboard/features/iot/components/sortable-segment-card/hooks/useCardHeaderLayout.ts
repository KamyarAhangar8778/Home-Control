import { useState, useLayoutEffect, useEffect, useRef } from "react";

export function useCardHeaderLayout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAutoOffMenu, setShowAutoOffMenu] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const autoOffButtonRef = useRef<HTMLButtonElement>(null);
  const autoOffMenuRef = useRef<HTMLDivElement>(null);

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
      if (
        autoOffMenuRef.current &&
        !autoOffMenuRef.current.contains(event.target as Node) &&
        autoOffButtonRef.current &&
        !autoOffButtonRef.current.contains(event.target as Node)
      ) {
        setShowAutoOffMenu(false);
      }
    };

    if (isSettingsOpen || showAutoOffMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen, showAutoOffMenu]);

  useLayoutEffect(() => {
    if (isSettingsOpen && menuRef.current && buttonRef.current) {
      const menu = menuRef.current;
      const button = buttonRef.current;

      const groupContainer = button.closest(".group\\/group-card") as HTMLElement;

      if (groupContainer && menu.parentElement) {
        const groupRect = groupContainer.getBoundingClientRect();
        const menuParentRect = menu.parentElement.getBoundingClientRect();

        const parentCenter = menuParentRect.left + menuParentRect.width / 2;
        const groupCenter = groupRect.left + groupRect.width / 2;

        const offset = groupCenter - parentCenter;

        menu.style.left = `calc(50% + ${offset}px)`;
      }
    }
  }, [isSettingsOpen]);

  return {
    isSettingsOpen,
    setIsSettingsOpen,
    showAutoOffMenu,
    setShowAutoOffMenu,
    buttonRef,
    menuRef,
    autoOffButtonRef,
    autoOffMenuRef,
  };
}
