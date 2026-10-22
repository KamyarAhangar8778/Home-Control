import React, { useState, useEffect } from "react";
import { soundManager } from "@/lib/audio";
import { AudioToggleButton } from "./AudioToggleButton";
import { AudioSourceSelector } from "./AudioSourceSelector";
import { AudioTrackInfo } from "./AudioTrackInfo";
import { debugLog } from "@/lib/debug";

export default function AudioSection() {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [musicSource, setMusicSource] = useState<"local" | "api">("local");
  const [trackInfo, setTrackInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => {
    setIsMusicOn(soundManager.isAmbientPlaying);
    setMusicSource((localStorage.getItem("music_source") as "local" | "api") || "local");
    setTrackInfo(soundManager.currentTrack);

    const handleMusicStart = () => {
      setIsMusicOn(soundManager.isAmbientPlaying);
      setPlaybackError(null);
    };
    const handleMusicError = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      setIsMusicOn(false);
      setIsLoading(false);
      setPlaybackError(detail?.message || "پخش آهنگ ناموفق بود.");
    };

    window.addEventListener("ambientMusicStarted", handleMusicStart);
    window.addEventListener("ambientMusicError", handleMusicError);
    soundManager.setOnTrackUpdate((track) => {
      setTrackInfo(track);
      setIsLoading(false);
    });

    return () => {
      window.removeEventListener("ambientMusicStarted", handleMusicStart);
      window.removeEventListener("ambientMusicError", handleMusicError);
      soundManager.setOnTrackUpdate(() => {});
    };
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);
    setPlaybackError(null);
    try {
      const newState = await soundManager.toggleAmbient();
      setIsMusicOn(newState);
      if (newState) soundManager.playToggleOn();
      else soundManager.playToggleOff();
    } catch (error) {
      debugLog.error("AudioUI", "Playback button action failed.", error);
      setPlaybackError("پخش آهنگ ناموفق بود. کنسول مرورگر را برای جزئیات بررسی کن.");
      setIsMusicOn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceChange = async (source: "local" | "api") => {
    if (source === musicSource) return;
    setMusicSource(source);
    localStorage.setItem("music_source", source);
    soundManager.playClick();
    setPlaybackError(null);

    if (isMusicOn) {
      setIsLoading(true);
      try {
        soundManager.stopAmbient();
        await soundManager.loadAmbientTrack();
        await soundManager.startAmbient();
      } catch (error) {
        debugLog.error("AudioUI", "Changing audio source failed.", error);
        setPlaybackError("بارگذاری منبع آهنگ ناموفق بود.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    setPlaybackError(null);
    soundManager.playClick();
    try {
      await soundManager.nextTrack();
    } catch (error) {
      debugLog.error("AudioUI", "Could not play next track.", error);
      setPlaybackError("آهنگ بعدی در دسترس نیست.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = async () => {
    setIsLoading(true);
    setPlaybackError(null);
    soundManager.playClick();
    try {
      await soundManager.prevTrack();
    } catch (error) {
      debugLog.error("AudioUI", "Could not play previous track.", error);
      setPlaybackError("آهنگ قبلی در دسترس نیست.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AudioToggleButton isMusicOn={isMusicOn} isLoading={isLoading} onToggle={handleToggle} />
      {playbackError && (
        <p role="alert" className="text-xs text-red-400 text-right" aria-live="polite">
          {playbackError}
        </p>
      )}
      <AudioSourceSelector musicSource={musicSource} onSourceChange={handleSourceChange} />
      {isMusicOn && trackInfo && (
        <AudioTrackInfo trackInfo={trackInfo} isLoading={isLoading} onNext={handleNext} onPrev={handlePrev} />
      )}
    </div>
  );
}
