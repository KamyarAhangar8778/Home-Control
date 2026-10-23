interface AudioTrack {
  title: string;
  creator: string;
  isLocal: boolean;
  url: string;
}
interface Props {
  trackInfo: AudioTrack | null;
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function AudioTrackInfo({ trackInfo, isLoading, onNext, onPrev }: Props) {
  if (!trackInfo) return null;
  return (
    <div className="p-4 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-3 max-w-[70%]">
        <div className="w-8 h-8 shrink-0 rounded-full bg-[var(--accent3-transparent)] flex items-center justify-center"><Music aria-hidden="true" className="w-4 h-4 text-[var(--accent3)]" /></div>
        <div className="text-right overflow-hidden"><span className="block text-xs font-bold text-[var(--text-primary)] truncate" title={trackInfo.title}>{trackInfo.title}</span><span className="block text-[10px] text-[var(--text-muted)] mt-0.5 truncate" title={trackInfo.creator}>{trackInfo.creator}</span></div>
      </div>
      <div className="flex items-center gap-3">
        {!trackInfo.isLocal && <div className="flex items-center gap-1 ml-2 rtl:mr-2 rtl:ml-0">
          <button type="button" aria-label="آهنگ قبلی" onClick={onPrev} disabled={isLoading} className="p-1.5 rounded bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"><SkipBack aria-hidden="true" className="w-3.5 h-3.5" /></button>
          <button type="button" aria-label="آهنگ بعدی" onClick={onNext} disabled={isLoading} className="p-1.5 rounded bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"><SkipForward aria-hidden="true" className="w-3.5 h-3.5" /></button>
        </div>}
        {!trackInfo.isLocal && <a href={trackInfo.url} target="_blank" rel="noreferrer" title="دانلود موزیک" aria-label="دانلود موزیک" className="p-1.5 rounded bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--accent3)] transition-colors"><Download aria-hidden="true" className="w-3.5 h-3.5" /></a>}
        <div className="flex gap-1" aria-hidden="true">{[1, 2, 3, 4].map((bar) => <div key={bar} className="w-1 h-3 bg-[var(--accent3)] rounded-full animate-pulse opacity-60" style={{ animationDelay: `${bar * 0.1}s` }} />)}</div>
      </div>
    </div>
  );
}
