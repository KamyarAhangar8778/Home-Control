import { AmbientManager } from './AmbientManager';
import { 
  playClickSynth, 
  playToggleOnSynth, 
  playToggleOffSynth, 
  playSuccessSynth, 
  playErrorSynth 
} from './effects';

export class SoundManager {
  private enabled: boolean = true;
  private ambientManager = new AmbientManager();

  // Expose AmbientManager properties for backward compatibility
  get isAmbientPlaying() { return this.ambientManager.isAmbientPlaying; }
  get currentTrack() { return this.ambientManager.currentTrack; }
  get playlist() { return this.ambientManager.playlist; }
  get currentTrackIndex() { return this.ambientManager.currentTrackIndex; }

  public setOnTrackUpdate(cb: (track: any) => void) {
    this.ambientManager.setOnTrackUpdate(cb);
  }

  public async loadAmbientTrack() {
    await this.ambientManager.loadAmbientTrack();
  }

  public async nextTrack() {
    await this.ambientManager.loadAmbientTrack('next');
  }

  public async prevTrack() {
    await this.ambientManager.loadAmbientTrack('prev');
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val && this.isAmbientPlaying) {
      this.ambientManager.stop();
    }
  }

  public async toggleAmbient() {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      if (typeof window !== 'undefined') localStorage.setItem('music_disabled', 'true');
    } else {
      await this.startAmbient();
      if (typeof window !== 'undefined') localStorage.setItem('music_disabled', 'false');
    }
    return this.isAmbientPlaying;
  }

  public async startAmbient() {
    await this.ambientManager.start(this.enabled);
  }

  public stopAmbient() {
    this.ambientManager.stop();
  }

  public playClick() {
    if (this.enabled) playClickSynth();
  }

  public playToggleOn() {
    if (this.enabled) playToggleOnSynth();
  }

  public playToggleOff() {
    if (this.enabled) playToggleOffSynth();
  }

  public playSuccess() {
    if (this.enabled) playSuccessSynth();
  }

  public playError() {
    if (this.enabled) playErrorSynth();
  }
}
