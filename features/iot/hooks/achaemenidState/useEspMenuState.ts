"use client";

import { useState } from "react";

export function useEspMenuState() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModulesMenuOpen, setIsModulesMenuOpen] = useState(false);
  const [isEspDrawerOpen, setIsEspDrawerOpen] = useState(false);
  const [isAutomationsMenuOpen, setIsAutomationsMenuOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("colors");

  return {
    isMenuOpen,
    setIsMenuOpen,
    isModulesMenuOpen,
    setIsModulesMenuOpen,
    isEspDrawerOpen,
    setIsEspDrawerOpen,
    isAutomationsMenuOpen,
    setIsAutomationsMenuOpen,
    activeSettingsTab,
    setActiveSettingsTab,
  };
}
