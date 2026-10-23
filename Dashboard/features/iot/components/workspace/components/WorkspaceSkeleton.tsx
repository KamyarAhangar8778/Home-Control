interface WorkspaceSkeletonProps {
  groupsCols: number;
}

export default function WorkspaceSkeleton({ groupsCols }: WorkspaceSkeletonProps) {
  const dummyGroups = [1, 2, 3];
  const flexBasis = groupsCols === 1 ? "100%" : groupsCols === 2 ? "calc(50% - 1rem - 0.1px)" : "calc(33.3333% - 1.3333rem - 0.1px)";

  return (
    <div className="flex flex-wrap gap-8 w-full items-start">
      {dummyGroups.map((groupId) => (
        <div key={groupId} className="space-y-3 flex-grow flex-shrink-0 min-w-0 max-w-full max-[767px]:basis-full" style={{ flexBasis }}>
          <div className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-3 shadow-md flex flex-col items-center gap-3 relative transition-all duration-300">
            <div className="w-full flex items-center justify-between p-1">
              <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-md bg-[var(--text-muted)] opacity-20 animate-pulse" /><div className="w-24 h-4 rounded bg-[var(--text-muted)] opacity-20 animate-pulse" /></div>
              <div className="flex items-center gap-2 bg-[var(--bg-main)] p-1 rounded-xl"><div className="w-6 h-6 rounded-md bg-[var(--text-muted)] opacity-20 animate-pulse" /><div className="w-6 h-6 rounded-md bg-[var(--text-muted)] opacity-20 animate-pulse" /></div>
            </div>
            <div className="w-full border-t border-[var(--border-color)] pt-4 mt-1 px-1 min-h-[140px] flex gap-3">
              {[1, 2].map((segId) => <div key={segId} className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm flex flex-col justify-between items-center h-[120px]"><div className="w-full flex justify-between items-center mb-2"><div className="w-10 h-5 rounded-full bg-[var(--text-muted)] opacity-20 animate-pulse" /><div className="w-6 h-6 rounded-md bg-[var(--text-muted)] opacity-20 animate-pulse" /></div><div className="w-full h-8 rounded-xl bg-[var(--text-muted)] opacity-10 mt-auto animate-pulse" /></div>)}
            </div>
            <div className="w-16 h-4 rounded-full bg-[var(--text-muted)] opacity-10 animate-pulse mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
