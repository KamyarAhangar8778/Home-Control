import { useState } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { validateEsp32Pin } from "@/features/iot/utils/pinValidation";
import { Segment } from "../core/types";

export function useAddSegmentForm(segments: Segment[], onAddSegment: any, onClose: () => void) {
  const { showToast, groupsOrder } = useIoTStore();
  const [selectedType, setSelectedType] = useState("gpio_toggle");
  const [targetPin, setTargetPin] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [groupName, setGroupName] = useState(groupsOrder.length > 0 ? groupsOrder[0] : "Test");
  const [segmentIcon, setSegmentIcon] = useState("");
  const [groupIcon, setGroupIcon] = useState("");
  const [errorText, setErrorText] = useState("");
  const [buttonMode, setButtonMode] = useState<"switch" | "push">("switch");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    const finalPin = targetPin.trim();
    if (!finalPin) {
      setErrorText("لطفاً شماره پایه را مشخص کنید.");
      return;
    }

    const validation = validateEsp32Pin(finalPin, selectedType);
    if (!validation.isValid) {
      showToast(validation.message, "error");
      return;
    }

    if (validation.isWarning) {
      showToast(validation.message, "success");
    }

    if (segments.some((s) => s.type === selectedType && s.pin === finalPin)) {
      setErrorText(`ماژولی برای پایه GPIO ${finalPin} قبلاً اضافه شده است.`);
      return;
    }

    onAddSegment(selectedType, finalPin, customTitle.trim() || `کنترل پایه دیجیتال (GPIO ${finalPin})`, groupName.trim() || "Test", buttonMode, undefined, segmentIcon || undefined, groupIcon || undefined);
    
    setCustomTitle("");
    setGroupName(groupsOrder.length > 0 ? groupsOrder[0] : "Test");
    setTargetPin("");
    setSegmentIcon("");
    setGroupIcon("");
    setButtonMode("switch");
    setErrorText("");
    onClose();
  };

  return {
    selectedType, setSelectedType,
    targetPin, setTargetPin,
    customTitle, setCustomTitle,
    groupName, setGroupName,
    segmentIcon, setSegmentIcon,
    groupIcon, setGroupIcon,
    errorText,
    buttonMode, setButtonMode,
    showAdvanced, setShowAdvanced,
    groupsOrder,
    handleSubmit
  };
}
