import type { PointerEvent } from "react";
import { useVoiceCommand } from "@/features/iot/hooks/useVoiceCommand";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { normalizePhonetics, getSimilarity } from "./utils";

export function useVoiceCommandHandler() {
  const { isListening, transcript, startListening, stopListening } = useVoiceCommand();
  const { handleSetPinState, handleBatchPinState } = useDashboard();
  const setIsMenuOpen = useIoTStore(s => s.setIsMenuOpen);
  const setActiveSettingsTab = useIoTStore(s => s.setActiveSettingsTab);
  const showToast = useIoTStore(s => s.showToast);
  const segments = useIoTStore(s => s.segments);
  const macros = useIoTStore(s => s.macros);
  const voiceCommands = useIoTStore(s => s.voiceCommands);

  const handlePointerDown = (e: PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setIsMenuOpen(true);
    setActiveSettingsTab("voice-commands");
    startListening();
  };

  const executeCommand = (finalTranscript: string) => {
    const cleanTranscript = finalTranscript.trim().replace(/[.،!؟]+$/, "").trim();
    const normalizedTranscript = normalizePhonetics(cleanTranscript);

    if (!cleanTranscript) return;

    let bestMatchCmd: (typeof voiceCommands)[number] | null = null;
    let highestSim = 0;

    for (const command of voiceCommands ?? []) {
      const similarity = getSimilarity(normalizePhonetics(command.phrase), normalizedTranscript);
      if (similarity > highestSim && similarity >= 0.8) {
        highestSim = similarity;
        bestMatchCmd = command;
      }
    }

    if (bestMatchCmd?.actions?.length) {
      const batchActions: Array<{ targetPin: string; actionOn: boolean }> = [];

      bestMatchCmd.actions.forEach((action) => {
        if (action.targetPin) {
          batchActions.push({ targetPin: action.targetPin, actionOn: action.actionOn ?? true });
        } else if (action.targetMacro) {
          const macro = macros.find((item) => item.id === action.targetMacro);
          if (macro) batchActions.push(...macro.actions);
        }
      });

      if (batchActions.length > 0) {
        handleBatchPinState(batchActions);
        showToast(`فرمان صوتی اجرا شد: ${cleanTranscript}`, "success");
        return;
      }
    }

    let targetState: boolean | null = null;
    let segmentName = "";

    if (cleanTranscript.endsWith(" روشن")) {
      targetState = true;
      segmentName = cleanTranscript.slice(0, -" روشن".length).trim();
    } else if (cleanTranscript.endsWith(" خاموش")) {
      targetState = false;
      segmentName = cleanTranscript.slice(0, -" خاموش".length).trim();
    }

    if (targetState !== null) {
      const normalizedSegmentName = normalizePhonetics(segmentName);
      let bestSegment: (typeof segments)[number] | null = null;
      let highestSegmentSimilarity = 0;

      for (const segment of segments) {
        const similarity = getSimilarity(normalizePhonetics(segment.title), normalizedSegmentName);
        if (similarity > highestSegmentSimilarity && similarity >= 0.8) {
          highestSegmentSimilarity = similarity;
          bestSegment = segment;
        }
      }

      if (bestSegment) {
        handleSetPinState(bestSegment.pin, targetState);
        showToast(`فرمان صوتی اجرا شد: ${cleanTranscript}`, "success");
      } else {
        showToast(`سگمنتی با نام مشابه «${segmentName}» یافت نشد.`, "error");
      }
    } else {
      showToast(`فرمان نامعتبر: ${cleanTranscript}`, "error");
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    e.preventDefault();
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}
    stopListening();
    executeCommand(transcript);
  };

  const handlePointerCancel = (e: PointerEvent) => {
    e.preventDefault();
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}
    stopListening();
  };

  return {
    isListening,
    transcript,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  };
}
