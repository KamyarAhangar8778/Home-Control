import { SoundManager } from "./SoundManager";
import { debugLog } from "@/lib/debug";

export const soundManager = new SoundManager();

// UI sounds may react to clicks, but ambient music is never auto-started.
// Only AudioSection's explicit playback control can call toggleAmbient/startAmbient.
if (typeof window !== "undefined") {
  window.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const interactive = target.closest("button, [role='button'], a");
      if (!interactive) return;

      const isToggle = interactive.classList.contains("switch-toggle") ||
        interactive.closest(".switch-toggle");
      if (!isToggle) soundManager.playClick();
    },
    { capture: true },
  );

  window.addEventListener("unhandledrejection", (event) => {
    debugLog.error("Runtime", "Unhandled promise rejection.", event.reason);
  });

  window.addEventListener("error", (event) => {
    debugLog.error("Runtime", "Uncaught browser error.", {
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
      error: event.error,
    });
  });
}
