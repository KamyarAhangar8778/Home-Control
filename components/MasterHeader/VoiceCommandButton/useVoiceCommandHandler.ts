import { useVoiceCommand } from '@/features/iot/hooks/useVoiceCommand';
import { useDashboard } from '@/features/dashboard/context/DashboardContext';
import { useIoTStore } from '@/features/iot/hooks/useIoTStore';
import { normalizePhonetics, getSimilarity } from './utils';

export function useVoiceCommandHandler() {
  const { isListening, transcript, startListening, stopListening } = useVoiceCommand();
  const { handleSetPinState, handleBatchPinState } = useDashboard();
  const setIsMenuOpen = useIoTStore(s => s.setIsMenuOpen);
  const setActiveSettingsTab = useIoTStore(s => s.setActiveSettingsTab);
  const showToast = useIoTStore(s => s.showToast);
  const segments = useIoTStore(s => s.segments);
  const macros = useIoTStore(s => s.macros);
  const voiceCommands = useIoTStore(s => s.voiceCommands);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setIsMenuOpen(true);
    setActiveSettingsTab("voice-commands");
    startListening();
  };

  const executeCommand = (finalTranscript: string) => {
    const cleanTranscript = finalTranscript.trim().replace(/[.،!؟]+$/, '').trim();
    const normalizedTranscript = normalizePhonetics(cleanTranscript);
    
    if (!cleanTranscript) return;

    let bestMatchCmd = null;
    let highestSim = 0;
    
    for (const c of (voiceCommands || [])) {
      const sim = getSimilarity(normalizePhonetics(c.phrase), normalizedTranscript);
      if (sim > highestSim && sim >= 0.8) {
        highestSim = sim;
        bestMatchCmd = c;
      }
    }

    if (bestMatchCmd && bestMatchCmd.actions && bestMatchCmd.actions.length > 0) {
      const batchActions: Array<{ targetPin: string; actionOn: boolean }> = [];
      
      bestMatchCmd.actions.forEach((act) => {
        if (act.targetPin) {
          batchActions.push({ targetPin: act.targetPin, actionOn: act.actionOn ?? true });
        } else if (act.targetMacro) {
          const m = macros.find((m) => m.id === act.targetMacro);
          if (m) {
            batchActions.push(...m.actions);
          }
        }
      });

      if (batchActions.length > 0) {
        handleBatchPinState(batchActions);
        showToast(`فرمان صوتی اجرا شد: ${cleanTranscript}`, "success");
        return;
      }
    }

    let targetSegment = null;
    let targetState: boolean | null = null;
    let actionFound = false;
    let segmentName = "";

    if (cleanTranscript.endsWith(" روشن")) {
      targetState = true;
      actionFound = true;
      segmentName = cleanTranscript.slice(0, -" روشن".length).trim();
    } else if (cleanTranscript.endsWith(" خاموش")) {
      targetState = false;
      actionFound = true;
      segmentName = cleanTranscript.slice(0, -" خاموش".length).trim();
    }

    if (actionFound) {
      const normalizedSegName = normalizePhonetics(segmentName);
      let bestSeg = null;
      let highestSegSim = 0;
      
      for (const s of segments) {
        const sim = getSimilarity(normalizePhonetics(s.title), normalizedSegName);
        if (sim > highestSegSim && sim >= 0.8) {
          highestSegSim = sim;
          bestSeg = s;
        }
      }

      if (bestSeg && targetState !== null) {
        handleSetPinState(bestSeg.pin, targetState);
        showToast(`فرمان صوتی اجرا شد: ${cleanTranscript}`, "success");
      } else {
        showToast(`سگمنتی با نام مشابه «${segmentName}» یافت نشد.`, "error");
      }
    } else {
      showToast(`فرمان نامعتبر: ${cleanTranscript}`, "error");
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
    stopListening();
    executeCommand(transcript);
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
    stopListening();
  };

  return {
    isListening,
    transcript,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel
  };
}
