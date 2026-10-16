import React from "react";
import { Check, X } from "lucide-react";
import { VoiceCommandActionsEditor } from "./VoiceCommandActionsEditor";

interface Props {
  newCommandPhrase: string;
  setNewCommandPhrase: (val: string) => void;
  tempActions: Array<any>;
  setTempActions: (val: Array<any>) => void;
  onSave: () => void;
  onCancel: () => void;
  segments: any[];
  macros: any[];
}

export function VoiceCommandEditor({
  newCommandPhrase, setNewCommandPhrase,
  tempActions, setTempActions,
  onSave, onCancel,
  segments, macros
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newCommandPhrase}
          onChange={(e) => setNewCommandPhrase(e.target.value)}
          placeholder="عبارت صوتی (مثلاً: رقص نور)..."
          className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
        />
        <button
          onClick={onSave}
          className="p-2.5 bg-[var(--accent3)] text-white rounded-xl hover:bg-[var(--accent3-dark)] transition-colors shadow-md shadow-[var(--accent3-transparent)]"
          title="ذخیره"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={onCancel}
          className="p-2.5 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl hover:border-[var(--accent4)] hover:text-[var(--accent4)] transition-colors bg-[var(--card-bg-solid)]"
          title="انصراف"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <VoiceCommandActionsEditor 
        tempActions={tempActions} setTempActions={setTempActions} 
        segments={segments} macros={macros}
      />
    </div>
  );
}
