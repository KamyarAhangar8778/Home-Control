import { SoundManager } from './SoundManager';

export const soundManager = new SoundManager();

// Setup global click listener for generic button clicks
let interacted = false;

if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    // Attempt auto-start of ambient music on first interaction
    if (!interacted) {
      interacted = true;
      const musicDisabled = localStorage.getItem('music_disabled');
      if (musicDisabled !== 'true') {
        soundManager.startAmbient();
        window.dispatchEvent(new Event('ambientMusicStarted'));
      }
    }

    const target = (e.target as Element).closest('button, [role="button"], a');
    
    if (target) {
       const isToggle = target.classList.contains('switch-toggle') || target.closest('.switch-toggle');
       if (!isToggle) {
         soundManager.playClick();
       }
    }
  }, { capture: true });
}

export { SoundManager };
