import React from "react";
import { ICON_MAP, AVAILABLE_ICONS, SUGGESTED_EMOJIS } from "@/features/iot/utils/icons";

interface Props {
  iconMode: "emoji" | "lucide";
  setIconMode: (mode: "emoji" | "lucide") => void;
  newMacroIcon: string;
  setNewMacroIcon: (icon: string) => void;
}

export function MacroIconSelector({ iconMode, setIconMode, newMacroIcon, setNewMacroIcon }: Props) {
  return (
    <div className="flex flex-col gap-2 bg-[var(--card-bg-solid)] p-2 rounded-xl border border-[var(--border-color)]">
      <div className="flex items-center gap-2 mb-1 px-1">
        <button 
          onClick={() => setIconMode("emoji")} 
          className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-colors ${iconMode === "emoji" ? "bg-[var(--accent3)] text-white shadow-sm" : "bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent3)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
        >
          ایموجی
        </button>
        <button 
          onClick={() => setIconMode("lucide")} 
          className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-colors ${iconMode === "lucide" ? "bg-[var(--accent3)] text-white shadow-sm" : "bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent3)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
        >
          آیکون بی‌رنگ
        </button>
      </div>

      {iconMode === "emoji" ? (
        <div className="flex flex-wrap gap-1.5 justify-center max-h-[140px] overflow-y-auto p-1 custom-scrollbar">
          {SUGGESTED_EMOJIS.map((icon) => (
            <button
              key={icon}
              onClick={() => setNewMacroIcon(icon)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-colors ${newMacroIcon === icon ? "bg-[var(--accent3)] text-white shadow-sm" : "hover:bg-[var(--card-bg-solid)] text-[var(--text-secondary)]"}`}
            >
              {icon}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5 justify-center max-h-[140px] overflow-y-auto p-1 custom-scrollbar">
          {AVAILABLE_ICONS.map((iconName) => (
            <button
              key={iconName}
              onClick={() => setNewMacroIcon(iconName)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${newMacroIcon === iconName ? "bg-[var(--accent3)] text-white shadow-sm" : "hover:bg-[var(--card-bg-solid)] text-[var(--text-secondary)]"}`}
              title={iconName}
            >
              {React.createElement(ICON_MAP[iconName], { className: "w-4 h-4" })}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
