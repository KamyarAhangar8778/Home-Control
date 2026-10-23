import React from "react";
import { Check, X } from "lucide-react";
import { ICON_MAP } from "@/features/iot/utils/icons";
import { MacroIconSelector } from "./MacroIconSelector";
import { MacroActionsEditor } from "./MacroActionsEditor";

interface Props {
  macro: unknown;
  newMacroTitle: string;
  setNewMacroTitle: (val: string) => void;
  newMacroIcon: string;
  setNewMacroIcon: (val: string) => void;
  iconMode: "emoji" | "lucide";
  setIconMode: (val: "emoji" | "lucide") => void;
  tempActions: Array<{ targetPin: string; actionOn: boolean }>;
  setTempActions: (val: Array<{ targetPin: string; actionOn: boolean }>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function MacroEditor({
  newMacroTitle, setNewMacroTitle, newMacroIcon, setNewMacroIcon,
  iconMode, setIconMode, tempActions, setTempActions, onSave, onCancel,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {iconMode === "emoji" || !ICON_MAP[newMacroIcon] ? (
          <input aria-label="نماد ماکرو" type="text" value={newMacroIcon} onChange={(e) => setNewMacroIcon(e.target.value)} placeholder="نماد (مثلا 🚀)" maxLength={2} className="w-16 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl px-2 py-2 text-sm text-center outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all" />
        ) : (
          <div className="w-16 h-[38px] flex items-center justify-center bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl text-sm" aria-label="نماد انتخاب‌شده"><>{React.createElement(ICON_MAP[newMacroIcon], { className: "w-5 h-5" })}</></div>
        )}
        <input aria-label="نام ماکرو" type="text" value={newMacroTitle} onChange={(e) => setNewMacroTitle(e.target.value)} placeholder="نام ماکرو..." className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all" />
        <button type="button" onClick={onSave} className="p-2.5 bg-[var(--accent3)] text-white rounded-xl hover:bg-[var(--accent3-dark)] transition-colors shadow-md shadow-[var(--accent3-transparent)]" title="ذخیره" aria-label="ذخیره ماکرو"><Check aria-hidden="true" className="w-4 h-4" /></button>
        <button type="button" onClick={onCancel} className="p-2.5 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl hover:border-[var(--accent4)] hover:text-[var(--accent4)] transition-colors bg-[var(--card-bg-solid)]" title="انصراف" aria-label="انصراف"><X aria-hidden="true" className="w-4 h-4" /></button>
      </div>
      <MacroIconSelector iconMode={iconMode} setIconMode={setIconMode} newMacroIcon={newMacroIcon} setNewMacroIcon={setNewMacroIcon} />
      <MacroActionsEditor tempActions={tempActions} setTempActions={setTempActions} />
    </div>
  );
}
