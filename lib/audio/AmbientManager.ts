import { Track } from "./types";
import { audioContextManager } from "./context";
import { fetchArchivePlaylist, fetchTrackUrl } from "./playlist";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { debugLog } from "@/lib/debug";

const AUDIO_CACHE_NAME = "home-control-audio-v1";

export class AmbientManager {
  public ambientAudio: HTMLAudioElement | null = null;
  public isAmbientPlaying = false;
  public currentTrack: Track | null = null;
  private onTrackUpdateCallback: ((track: Track) => void) | null = null;
  public playlist: any[] = [];
  public currentTrackIndex = -1;
  private activeObjectUrl: string | null = null;

  public setOnTrackUpdate(cb: (track: Track) => void) {
    this.onTrackUpdateCallback = cb;
    if (this.currentTrack) cb(this.currentTrack);
  }

  public async fetchPlaylistIfNeeded() {
    if (this.playlist.length > 0) return true;

    const docs = await fetchArchivePlaylist();
    if (docs.length === 0) {
      debugLog.warn("Audio", "Online playlist request returned no tracks.");
      return false;
    }

    this.playlist = docs;
    this.currentTrackIndex = Math.floor(Math.random() * this.playlist.length);
    return true;
  }

  public async loadAmbientTrack(direction?: "next" | "prev") {
    if (typeof window === "undefined") return;

    const source = localStorage.getItem("music_source") || "local";
    if (source === "local") {
      const url = new URL("06 Dele Divaneh.mp3", document.baseURI).toString();
      this.currentTrack = { title: "Dele Divaneh", creator: "Home-Control", url, isLocal: true };
    } else {
      const hasPlaylist = await this.fetchPlaylistIfNeeded();
      if (!hasPlaylist) {
        const url = new URL("06 Dele Divaneh.mp3", document.baseURI).toString();
        this.currentTrack = { title: "Dele Divaneh", creator: "Fallback", url, isLocal: true };
      } else {
        if (direction === "next") {
          this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        } else if (direction === "prev") {
          this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        }

        let found = false;
        for (let attempts = 0; attempts < Math.min(5, this.playlist.length); attempts++) {
          try {
            const track = this.playlist[this.currentTrackIndex];
            const url = await fetchTrackUrl(track.identifier);
            if (url) {
              this.currentTrack = {
                title: track.title || "Unknown track",
                creator: track.creator || "Unknown artist",
                url,
                isLocal: false,
              };
              found = true;
              break;
            }
          } catch (error) {
            debugLog.warn("Audio", "Could not resolve an online track.", {
              attempt: attempts + 1,
              error,
            });
          }
          this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        }

        if (!found) {
          const url = new URL("06 Dele Divaneh.mp3", document.baseURI).toString();
          this.currentTrack = { title: "Dele Divaneh", creator: "Fallback", url, isLocal: true };
          debugLog.warn("Audio", "Online tracks unavailable; selected bundled fallback track.");
        }
      }
    }

    if (this.isAmbientPlaying) await this.playCurrentTrack();
    if (this.currentTrack) this.onTrackUpdateCallback?.(this.currentTrack);
  }

  private async getPlayableUrl(url: string): Promise<string> {
    if (typeof window === "undefined") return url;

    const requestUrl = new URL(url, window.location.href).toString();
    if (!FEATURE_FLAGS.audioLocalCache || !("caches" in window)) return requestUrl;

    try {
      const cache = await window.caches.open(AUDIO_CACHE_NAME);
      let response = await cache.match(requestUrl);

      if (response) {
        debugLog.info("Audio", "Using locally cached audio.", { url: requestUrl });
      } else {
        debugLog.info("Audio", "Downloading audio after explicit user playback request.", { url: requestUrl });
        response = await fetch(requestUrl);
        if (!response.ok) {
          throw new Error(`Audio request failed: ${response.status} ${response.statusText}`);
        }

        try {
          await cache.put(requestUrl, response.clone());
          debugLog.info("Audio", "Audio cached locally for subsequent playback.", { url: requestUrl });
        } catch (error) {
          debugLog.warn("Audio", "Audio playback can continue, but local caching failed.", error);
        }
      }

      const blob = await response.blob();
      if (this.activeObjectUrl) URL.revokeObjectURL(this.activeObjectUrl);
      this.activeObjectUrl = URL.createObjectURL(blob);
      return this.activeObjectUrl;
    } catch (error) {
      debugLog.error("Audio", "Local audio cache failed; falling back to direct playback URL.", error);
      return requestUrl;
    }
  }

  private async playCurrentTrack() {
    if (!this.currentTrack || typeof window === "undefined") return;
    if (!this.ambientAudio) {
      this.ambientAudio = new Audio();
      this.ambientAudio.preload = "none";
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.3;
    }

    try {
      const playableUrl = await this.getPlayableUrl(this.currentTrack.url);
      this.ambientAudio.src = playableUrl;
      await this.ambientAudio.play();
      this.isAmbientPlaying = true;
      window.dispatchEvent(new Event("ambientMusicStarted"));
    } catch (error) {
      this.isAmbientPlaying = false;
      debugLog.error("Audio", "Audio playback failed.", {
        track: this.currentTrack.title,
        source: this.currentTrack.url,
        error,
      });
      window.dispatchEvent(new CustomEvent("ambientMusicError", {
        detail: { message: "پخش آهنگ ناموفق بود. اتصال و منبع فایل را بررسی کن.", error },
      }));
    }

    audioContextManager.getContext();
  }

  public async start(enabled: boolean) {
    if (!enabled || typeof window === "undefined") return;
    if (this.isAmbientPlaying) return;

    try {
      if (!this.currentTrack) await this.loadAmbientTrack();
      await this.playCurrentTrack();
    } catch (error) {
      this.isAmbientPlaying = false;
      debugLog.error("Audio", "Could not start ambient playback.", error);
    }
  }

  public stop() {
    if (!this.ambientAudio || !this.isAmbientPlaying) return;
    this.ambientAudio.pause();
    this.ambientAudio.currentTime = 0;
    this.isAmbientPlaying = false;
  }
}
