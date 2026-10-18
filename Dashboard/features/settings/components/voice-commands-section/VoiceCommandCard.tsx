import React from "react";
import { Edit2, Trash2, Mic } from "lucide-react";
import { motion } from "motion/react";
import { VoiceCommandEditor } from "./VoiceCommandEditor";

interface Props {
  cmd: any;
  isEditing: boolean;
  onEditStart: () => void;
  onDelete: () => void;
  newCommandPhrase: string;
  setNewCommandPhrase: (val: string) => void;
  tempActions: Array<any>;
  setTempActions: (val: Array<any>) => void;
  onSave: () => void;
  onCancel: () => void;
  segments: any[];
  macros: any[];
}

export function VoiceCommandCard({
  cmd, isEditing, onEditStart, onDelete,
  newCommandPhrase, setNewCommandPhrase,
  tempActions, setTempActions,
  onSave, onCancel,
  segments, macros
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 rounded-2xl shadow-sm flex flex-col gap-3"
    >
      {isEditing ? (
        <VoiceCommandEditor
          newCommandPhrase={newCommandPhrase} setNewCommandPhrase={setNewCommandPhrase}
          tempActions={tempActions} setTempActions={setTempActions}
          onSave={onSave} onCancel={onCancel}
          segments={segments} macros={macros}
        />
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[var(--accent3-transparent)] border border-[var(--accent3)] rounded-xl text-xl text-[var(--accent3)]">
              <Mic className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[var(--text-primary)]">"{cmd.phrase}"</span>
              <span className="text-xs text-[var(--text-secondary)] opacity-80">
                {cmd.actions.length} عملیات
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onEditStart}
              className="p-2 bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent3)] hover:border-[var(--accent3)] rounded-xl transition-colors"
              title="ویرایش"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent4)] hover:border-[var(--accent4)] rounded-xl transition-colors"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
