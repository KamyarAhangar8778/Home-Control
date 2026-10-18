import React, { useState } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { Plus, Mic } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VoiceTranscriptOverlay } from "./VoiceTranscriptOverlay";
import { VoiceCommandCard } from "./VoiceCommandCard";

export default function VoiceCommandsSection() {
  const voiceCommands = useIoTStore(s => s.voiceCommands);
  const setVoiceCommands = useIoTStore(s => s.setVoiceCommands);
  const segments = useIoTStore(s => s.segments);
  const macros = useIoTStore(s => s.macros);
  const isListening = useIoTStore(s => s.isListening);
  const voiceTranscript = useIoTStore(s => s.voiceTranscript);
  const [editingCommandId, setEditingCommandId] = useState<string | null>(null);
  const [newCommandPhrase, setNewCommandPhrase] = useState("");
  const [tempActions, setTempActions] = useState<Array<{targetPin?: string, targetMacro?: string, actionOn?: boolean}>>([]);

  const handleAddCommand = () => {
    const newCommand = {
      id: `voice_${Date.now()}`,
      phrase: "دستور جدید",
      actions: [],
    };
    setVoiceCommands([...(voiceCommands || []), newCommand]);
    setEditingCommandId(newCommand.id);
    setNewCommandPhrase(newCommand.phrase);
    setTempActions([]);
  };

  const handleDeleteCommand = (id: string) => {
    setVoiceCommands((voiceCommands || []).filter((m) => m.id !== id));
    if (editingCommandId === id) setEditingCommandId(null);
  };

  const handleSaveCommand = (id: string) => {
    setVoiceCommands((voiceCommands || []).map(m => m.id === id ? { ...m, phrase: newCommandPhrase, actions: tempActions } : m));
    setEditingCommandId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 text-right">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
          <Mic className="w-5 h-5 text-[var(--accent3)]" />
          مدیریت دستورات صوتی
        </h3>
        <button
          onClick={handleAddCommand}
          className="bg-[var(--accent3)] text-white p-2 rounded-xl hover:bg-[var(--accent3-dark)] transition-colors shadow-md"
          title="افزودن دستور صوتی جدید"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-[var(--text-secondary)] opacity-80 leading-relaxed">
        با تعریف دستورات صوتی، می‌توانید با گفتن یک عبارت خاص به دستیار صوتی، چندین دستور (مانند روشن/خاموش کردن پایه‌ها یا اجرای ماکروها) را اجرا کنید.
      </p>

      <VoiceTranscriptOverlay isListening={isListening} voiceTranscript={voiceTranscript} />

      <div className="space-y-3 mt-4">
        <AnimatePresence>
          {(!voiceCommands || voiceCommands.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 bg-[var(--card-bg-solid)] border border-dashed border-[var(--border-color)] rounded-2xl text-[var(--text-tertiary)] text-sm"
            >
              هنوز دستور صوتی تعریف نشده است.
            </motion.div>
          )}

          {(voiceCommands || []).map((cmd) => (
            <VoiceCommandCard
              key={cmd.id}
              cmd={cmd}
              isEditing={editingCommandId === cmd.id}
              onEditStart={() => {
                setEditingCommandId(cmd.id);
                setNewCommandPhrase(cmd.phrase);
                setTempActions(cmd.actions);
              }}
              onDelete={() => handleDeleteCommand(cmd.id)}
              newCommandPhrase={newCommandPhrase} setNewCommandPhrase={setNewCommandPhrase}
              tempActions={tempActions} setTempActions={setTempActions}
              onSave={() => handleSaveCommand(cmd.id)}
              onCancel={() => setEditingCommandId(null)}
              segments={segments} macros={macros}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
