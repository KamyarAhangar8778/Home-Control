interface TitleInputProps {
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
}

export default function TitleInput({ headerTitle, setHeaderTitle }: TitleInputProps) {
  const handleResetTitle = () => setHeaderTitle("سامانه هوشمند پادشاهی بومی");

  return (
    <div className="border-t border-[var(--border-color)] pt-3 space-y-2">
      <div className="flex items-center justify-between">
        <button type="button" onClick={handleResetTitle} className="text-[9.5px] theme-text-tertiary hover:text-[var(--accent4)] transition-colors underline decoration-dotted cursor-pointer">بازنشانی عنوان</button>
        <label htmlFor="dashboard-header-title" className="font-bold text-[10px] theme-text-secondary tracking-wide">عنوان هدر هوشمند</label>
      </div>
      <input id="dashboard-header-title" type="text" value={headerTitle} onChange={(e) => setHeaderTitle(e.target.value)} maxLength={50} className="w-full px-3 py-2.5 text-[11px] text-right bg-black/20 border border-[var(--border-color)] theme-text-primary rounded-xl focus:outline-none focus:border-[var(--accent4)] transition-colors" placeholder="مثال: داشبورد هوشمند کاربری" />
    </div>
  );
}
