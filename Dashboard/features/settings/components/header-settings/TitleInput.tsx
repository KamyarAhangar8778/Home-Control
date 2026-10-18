import React from "react";

interface TitleInputProps {
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
}

export default function TitleInput({ headerTitle, setHeaderTitle }: TitleInputProps) {
  const handleTitleChange = (val: string) => {
    setHeaderTitle(val);
  };

  const handleResetTitle = () => {
    const defaultTitle = "سامانه هوشمند پادشاهی بومی";
    setHeaderTitle(defaultTitle);
  };

  return (
    <div className="border-t border-[var(--border-color)] pt-3 space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={handleResetTitle}
          className="text-[9.5px] theme-text-tertiary hover:text-[var(--accent4)] transition-colors underline decoration-dotted cursor-pointer"
        >
          بازنشانی عنوان
        </button>
        <span className="font-bold text-[10px] theme-text-secondary tracking-wide">
          عنوان هدر هوشمند
        </span>
      </div>

      <input
        type="text"
        value={headerTitle}
        onChange={(e) => handleTitleChange(e.target.value)}
        maxLength={50}
        className="w-full px-3 py-2.5 text-[11px] text-right bg-black/20 border border-[var(--border-color)] theme-text-primary rounded-xl focus:outline-none focus:border-[var(--accent4)] transition-colors"
        placeholder="مثال: داشبورد هوشمند کاربری"
      />
    </div>
  );
}
