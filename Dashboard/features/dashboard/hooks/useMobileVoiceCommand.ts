import React from 'react';
import { useVoiceCommand } from '@/features/iot/hooks/useVoiceCommand';
import { useDashboard } from '@/features/dashboard/context/DashboardContext';
import { useIoTStore } from '@/features/iot/hooks/useIoTStore';

function normalizePhonetics(text: string): string {
  if (!text) return "";
  return text
    .replace(/[غق]/g, 'ق')
    .replace(/[سصث]/g, 'س')
    .replace(/[زضظذ]/g, 'ز')
    .replace(/[هح]/g, 'ح')
    .replace(/[تط]/g, 'ت')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u200C\s]+/g, ' ')
    .trim();
}

function getSimilarity(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  const dist = matrix[b.length][a.length];
  const maxLen = Math.max(a.length, b.length);
  return (maxLen - dist) / maxLen;
}

export function useMobileVoiceCommand() {
  const { isListening, startListening, stopListening } = useVoiceCommand();
  const { handleSetPinState, handleBatchPinState } = useDashboard();
  
  const showToast = useIoTStore(s => s.showToast);
  const segments = useIoTStore(s => s.segments);
  const macros = useIoTStore(s => s.macros);
  const voiceCommands = useIoTStore(s => s.voiceCommands);

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

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    // We don't open the settings menu here for the mobile floating button
    startListening((finalTranscript) => {
      executeCommand(finalTranscript);
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
    stopListening();
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
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel
  };
}
