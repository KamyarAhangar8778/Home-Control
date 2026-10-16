"use client";

import { useState, useCallback } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import {
  publishAddSegmentCommand,
  publishDeleteSegmentCommand,
} from "@/features/iot/services/mqttService";

interface UseSegmentManagementProps {
  setIsModulesMenuOpen: (open: boolean) => void;
  updatePinOnServer: (pin: string, state: boolean) => Promise<void>;
}

export function useSegmentManagement({
  setIsModulesMenuOpen,
  updatePinOnServer,
}: UseSegmentManagementProps) {
  const setSegments = useIoTStore((state) => state.setSegments);
  const setGroupsOrder = useIoTStore((state) => state.setGroupsOrder);
  const setGroupConfigs = useIoTStore((state) => state.setGroupConfigs);
  const [targetPlaceholderId, setTargetPlaceholderId] = useState<string | null>(null);

  const handleAddSegment = useCallback((
    type: string,
    pin: string,
    title?: string,
    group?: string,
    mode?: "switch" | "push",
    auto_off?: number,
    icon?: string,
    groupIcon?: string,
  ) => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const finalGroup = group || "Test";
    const newSeg = {
      id: randomId,
      type,
      pin,
      title: title || `کنترل پایه دیجیتال (GPIO ${pin})`,
      group: finalGroup,
      mode: mode || "switch",
      auto_off: auto_off || 0,
      icon,
    };

    setGroupConfigs((prev) => {
      const current = prev[finalGroup] || { maxCols: 3 };
      if (groupIcon && !('icon' in current && current.icon)) {
        return { ...prev, [finalGroup]: { ...current, icon: groupIcon } };
      }
      if (!prev[finalGroup]) {
        return { ...prev, [finalGroup]: current };
      }
      return prev;
    });

    setGroupsOrder((prev) => (prev.includes(finalGroup) ? prev : [...prev, finalGroup]));

    const segments = useIoTStore.getState().segments;
    let updated = [...segments];
    if (targetPlaceholderId) {
      const index = updated.findIndex((s) => s.id === targetPlaceholderId);
      if (index !== -1) {
        newSeg.group = updated[index].group || "Test";
        updated[index] = newSeg;
      } else {
        updated.push(newSeg);
      }
      setTargetPlaceholderId(null);
    } else {
      updated.push(newSeg);
    }
    setSegments(updated);

    const pinsState = useIoTStore.getState().pinsState;
    if (pinsState[pin] === undefined) {
      updatePinOnServer(pin, false);
    }

    publishAddSegmentCommand(newSeg.id, newSeg.type, parseInt(newSeg.pin), false);
  }, [targetPlaceholderId, setGroupConfigs, setGroupsOrder, setSegments, updatePinOnServer]);

  const handleAddPlaceholder = useCallback((groupId: string) => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const segments = useIoTStore.getState().segments;
    setSegments([
      ...segments,
      {
        id: randomId,
        type: "placeholder",
        pin: "",
        title: "جایگاه خالی",
        group: groupId,
      },
    ]);
  }, [setSegments]);

  const handleSetupPlaceholder = useCallback((id: string) => {
    setTargetPlaceholderId(id);
    setIsModulesMenuOpen(true);
  }, [setIsModulesMenuOpen]);

  const handleGroupColsChange = useCallback((group: string, maxCols: number) => {
    setGroupConfigs((prev) => ({ ...prev, [group]: { ...prev[group], maxCols } }));
  }, [setGroupConfigs]);

  const handleRemoveSegment = useCallback((id: string) => {
    const segments = useIoTStore.getState().segments;
    setSegments(segments.filter((s) => s.id !== id));
    publishDeleteSegmentCommand(id);
  }, [setSegments]);

  const handleRemoveGroup = useCallback((groupId: string) => {
    setGroupsOrder((prev) => prev.filter((g) => g !== groupId));
    setSegments((prev) => prev.filter((s) => (s.group || "Test") !== groupId));
  }, [setGroupsOrder, setSegments]);

  return {
    targetPlaceholderId,
    handleAddSegment,
    handleAddPlaceholder,
    handleSetupPlaceholder,
    handleGroupColsChange,
    handleRemoveSegment,
    handleRemoveGroup,
  };
}
