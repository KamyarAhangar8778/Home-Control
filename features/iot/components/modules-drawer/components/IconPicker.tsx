import React, { useState } from "react";
import { ICON_MAP, AVAILABLE_ICONS, SUGGESTED_EMOJIS } from "@/features/iot/utils/icons";
import { ChevronDown, ChevronUp } from "lucide-react";

interface IconPickerProps {
  label: string;
  isOptional?: boolean;
  selectedIcon: string;
  onSelectIcon: (val: string) => void;
}

export default function IconPicker({ label, isOptional = true, selectedIcon, onSelectIcon }: IconPickerProps) {
  const [showIcons, setShowIcons] = useState(false);
  const [iconMode, setIconMode] = useState<"emoji" | "lucide">("lucide");

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        {isOptional && <span className="text-[9px] theme-text-muted">(اختیاری)</span>}
        <label className="text-[10px] theme-text-tertiary font-bold block">{label}</label>
      </div>
      <button
        type="button"
        onClick={() => setShowIcons(!showIcons)}
        className="w-full h-10 px-4 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl flex items-center justify-between hover:border-[var(--accent3)] transition-all font-sans shadow-sm"
      >
        {showIcons ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
        <div className="flex items-center gap-2">
          <span>{selectedIcon ? "آیکون انتخاب شد" : "انتخاب آیکون"}</span>
          {selectedIcon && (
            ICON_MAP[selectedIcon] ? 
            React.createElement(ICON_MAP[selectedIcon], { className: "w-4 h-4 text-[var(--accent3)]" }) :
            <span className="text-lg leading-none">{selectedIcon}</span>
          )}
        </div>
      </button>
      
      {showIcons && (
        <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl space-y-3 shadow-sm">
          <div className="flex gap-2 p-1 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)]">
            <button 
              type="button"
              onClick={() => setIconMode("emoji")} 
              className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-colors ${iconMode === "emoji" ? "bg-[var(--accent3)] text-white shadow-sm" : "bg-[var(--bg-primary)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
            >
              ایموجی
            </button>
            <button 
              type="button"
              onClick={() => setIconMode("lucide")} 
              className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-colors ${iconMode === "lucide" ? "bg-[var(--accent3)] text-white shadow-sm" : "bg-[var(--bg-primary)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
            >
              آیکون ساده
            </button>
          </div>
          
          <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
            <button
              type="button"
              onClick={() => { onSelectIcon(""); setShowIcons(false); }}
              className={`p-2 rounded-lg flex items-center justify-center transition-all text-[9px] col-span-2 ${!selectedIcon ? "bg-[var(--accent3)] text-black" : "hover:bg-white/10 text-[var(--text-secondary)]"}`}
            >
              بدون آیکون
            </button>
            {iconMode === "emoji" ? (
              SUGGESTED_EMOJIS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => { onSelectIcon(icon); setShowIcons(false); }}
                  className={`p-2 rounded-lg flex items-center justify-center text-lg leading-none transition-all ${selectedIcon === icon ? "bg-[var(--accent3)] text-black" : "hover:bg-white/10 text-[var(--text-secondary)]"}`}
                >
                  {icon}
                </button>
              ))
            ) : (
              AVAILABLE_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => { onSelectIcon(iconName); setShowIcons(false); }}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all ${selectedIcon === iconName ? "bg-[var(--accent3)] text-black" : "hover:bg-white/10 text-[var(--text-secondary)]"}`}
                  title={iconName}
                >
                  {React.createElement(ICON_MAP[iconName], { className: "w-4 h-4" })}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
