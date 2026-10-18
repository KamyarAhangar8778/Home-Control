import React, { useState, useEffect } from "react";
import { soundManager } from "@/lib/audio";
import { AudioToggleButton } from "./AudioToggleButton";
import { AudioSourceSelector } from "./AudioSourceSelector";
import { AudioTrackInfo } from "./AudioTrackInfo";

export default function AudioSection() {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [musicSource, setMusicSource] = useState<'local' | 'api'>('local');
  const [trackInfo, setTrackInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMusicOn(soundManager.isAmbientPlaying);
    setMusicSource((localStorage.getItem('music_source') as 'local' | 'api') || 'local');
    setTrackInfo(soundManager.currentTrack);

    const handleMusicStart = () => setIsMusicOn(soundManager.isAmbientPlaying);
    window.addEventListener('ambientMusicStarted', handleMusicStart);
    soundManager.setOnTrackUpdate((track) => {
      setTrackInfo(track);
      setIsLoading(false);
    });

    return () => {
      window.removeEventListener('ambientMusicStarted', handleMusicStart);
      soundManager.setOnTrackUpdate(() => {});
    };
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);
    const newState = await soundManager.toggleAmbient();
    setIsMusicOn(newState);
    setIsLoading(false);
    newState ? soundManager.playToggleOn() : soundManager.playToggleOff();
  };
  
  const handleSourceChange = async (source: 'local' | 'api') => {
    if (source === musicSource) return;
    setMusicSource(source);
    localStorage.setItem('music_source', source);
    soundManager.playClick();
    
    if (isMusicOn) {
      setIsLoading(true);
      soundManager.stopAmbient();
      await soundManager.loadAmbientTrack();
      await soundManager.startAmbient();
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    setIsLoading(true); soundManager.playClick(); await soundManager.nextTrack(); setIsLoading(false);
  };

  const handlePrev = async () => {
    setIsLoading(true); soundManager.playClick(); await soundManager.prevTrack(); setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <AudioToggleButton isMusicOn={isMusicOn} isLoading={isLoading} onToggle={handleToggle} />
      <AudioSourceSelector musicSource={musicSource} onSourceChange={handleSourceChange} />
      {isMusicOn && trackInfo && (
        <AudioTrackInfo trackInfo={trackInfo} isLoading={isLoading} onNext={handleNext} onPrev={handlePrev} />
      )}
    </div>
  );
}
