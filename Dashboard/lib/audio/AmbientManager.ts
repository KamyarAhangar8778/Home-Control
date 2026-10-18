import { Track } from './types';
import { audioContextManager } from './context';
import { fetchArchivePlaylist, fetchTrackUrl } from './playlist';

export class AmbientManager {
  public ambientAudio: HTMLAudioElement | null = null;
  public isAmbientPlaying: boolean = false;
  public currentTrack: Track | null = null;
  private onTrackUpdateCallback: ((track: any) => void) | null = null;
  public playlist: any[] = [];
  public currentTrackIndex: number = -1;

  public setOnTrackUpdate(cb: (track: any) => void) {
    this.onTrackUpdateCallback = cb;
    if (this.currentTrack) cb(this.currentTrack);
  }

  public async fetchPlaylistIfNeeded() {
    if (this.playlist.length > 0) return true;
    const docs = await fetchArchivePlaylist();
    if (docs.length > 0) {
      this.playlist = docs;
      this.currentTrackIndex = Math.floor(Math.random() * this.playlist.length);
      return true;
    }
    return false;
  }

  public async loadAmbientTrack(direction?: 'next' | 'prev') {
    if (typeof window === 'undefined') return;
    const source = localStorage.getItem('music_source') || 'local';
    
    if (source === 'local') {
      this.currentTrack = { title: 'Dele Divaneh', creator: 'Track 06', url: '/06 Dele Divaneh.mp3', isLocal: true };
    } else {
      const hasPlaylist = await this.fetchPlaylistIfNeeded();
      if (hasPlaylist) {
        if (direction === 'next') {
          this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        } else if (direction === 'prev') {
          this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        }
        
        let found = false, attempts = 0;
        while (!found && attempts < 5) {
          try {
            const track = this.playlist[this.currentTrackIndex];
            const url = await fetchTrackUrl(track.identifier);
            if (url) {
              this.currentTrack = { title: track.title || "Unknown", creator: track.creator || "Unknown", url, isLocal: false };
              found = true;
            } else {
              this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
              attempts++;
            }
          } catch(err) {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
            attempts++;
          }
        }
        if (!found) this.currentTrack = { title: 'Dele Divaneh', creator: 'Fallback', url: '/06 Dele Divaneh.mp3', isLocal: true };
      } else {
        this.currentTrack = { title: 'Dele Divaneh', creator: 'Fallback', url: '/06 Dele Divaneh.mp3', isLocal: true };
      }
    }

    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.src = this.currentTrack!.url;
      if (this.isAmbientPlaying) this.ambientAudio.play().catch(e => console.error(e));
    } else {
      this.ambientAudio = new Audio(this.currentTrack!.url);
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.3;
      if (this.isAmbientPlaying) this.ambientAudio.play().catch(e => console.error(e));
    }
    
    if (this.onTrackUpdateCallback) this.onTrackUpdateCallback(this.currentTrack);
  }

  public async start(enabled: boolean) {
    if (!enabled) return;
    audioContextManager.getContext();
    if (!this.ambientAudio || !this.currentTrack) await this.loadAmbientTrack();
    if (!this.ambientAudio) return;
    if (this.isAmbientPlaying) return;
    this.isAmbientPlaying = true;
    this.ambientAudio.play().catch(e => {
      console.error("Audio playback failed", e);
      this.isAmbientPlaying = false;
    });
  }

  public stop() {
    if (!this.ambientAudio || !this.isAmbientPlaying) return;
    this.ambientAudio.pause();
    this.ambientAudio.currentTime = 0;
    this.isAmbientPlaying = false;
  }
}
