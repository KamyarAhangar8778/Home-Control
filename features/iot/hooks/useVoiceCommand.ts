import { useState, useCallback, useRef, useEffect } from 'react';
import { useIoTStore } from './useIoTStore';

export const useVoiceCommand = () => {
  const { isListening, setIsListening, voiceTranscript: transcript, setVoiceTranscript: setTranscript, showToast } = useIoTStore();
  const transcriptRef = useRef("");
  const recognitionRef = useRef<any>(null);
  const onCommandCompleteRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'fa-IR'; // Support Persian

        recognitionRef.current.onresult = (event: any) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            fullTranscript += event.results[i][0].transcript;
          }
          if (fullTranscript) {
            setTranscript(fullTranscript);
            transcriptRef.current = fullTranscript;
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (transcriptRef.current && onCommandCompleteRef.current) {
            onCommandCompleteRef.current(transcriptRef.current);
          }
          transcriptRef.current = "";
          setTranscript("");
        };
      } else {
        console.warn("Speech recognition is not supported in this browser.");
      }
    }
  }, []);

  const startListening = useCallback((onComplete?: (text: string) => void) => {
    setTranscript("");
    transcriptRef.current = "";
    if (onComplete) {
      onCommandCompleteRef.current = onComplete;
    } else {
      onCommandCompleteRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      showToast("مرورگر شما از قابلیت تشخیص صدا پشتیبانی نمی‌کند.", "error");
    }
  }, [showToast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    }
    // We don't set isListening to false here, we wait for the onend event 
    // to guarantee we receive the final result before showing the notification
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening
  };
};
