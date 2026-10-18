import React, { useState } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { Plus, Command } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ICON_MAP } from "@/features/iot/utils/icons";
import { MacroCard } from "./MacroCard";

export default function MacrosSection() {
  const macros = useIoTStore(s => s.macros);
  const setMacros = useIoTStore(s => s.setMacros);
  const [editingMacroId, setEditingMacroId] = useState<string | null>(null);
  const [newMacroTitle, setNewMacroTitle] = useState("");
  const [newMacroIcon, setNewMacroIcon] = useState("");
  const [tempActions, setTempActions] = useState<Array<{targetPin: string, actionOn: boolean}>>([]);
  const [iconMode, setIconMode] = useState<"emoji" | "lucide">("emoji");

  const handleAddMacro = () => {
    const newMacro = {
      id: `macro_${Date.now()}`,
      title: "ماکروی جدید",
      icon: "⚡",
      actions: [],
    };
    setMacros([...macros, newMacro]);
    setEditingMacroId(newMacro.id);
    setNewMacroTitle(newMacro.title);
    setNewMacroIcon(newMacro.icon);
    setIconMode("emoji");
    setTempActions([]);
  };

  const handleDeleteMacro = (id: string) => {
    setMacros(macros.filter((m) => m.id !== id));
    if (editingMacroId === id) setEditingMacroId(null);
  };

  const handleSaveMacro = (id: string) => {
    setMacros(macros.map(m => m.id === id ? { ...m, title: newMacroTitle, icon: newMacroIcon, actions: tempActions } : m));
    setEditingMacroId(null);
  };

  const handleEditStart = (macro: any) => {
    setEditingMacroId(macro.id);
    setNewMacroTitle(macro.title);
    setNewMacroIcon(macro.icon || "");
    setIconMode(ICON_MAP[macro.icon || ""] ? "lucide" : "emoji");
    setTempActions(macro.actions);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 text-right">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
          <Command className="w-5 h-5 text-[var(--accent3)]" />
          مدیریت ماکروها
        </h3>
        <button
          onClick={handleAddMacro}
          className="bg-[var(--accent3)] text-white p-2 rounded-xl hover:bg-[var(--accent3-dark)] transition-colors shadow-md"
          title="افزودن ماکرو جدید"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-[var(--text-secondary)] opacity-80 leading-relaxed">
        با استفاده از ماکروها می‌توانید چندین دستور (روشن/خاموش کردن پایه‌ها) را به صورت همزمان با یک کلیک اجرا کنید. این دکمه‌ها در هدر داشبورد نمایش داده می‌شوند.
      </p>

      <div className="space-y-3 mt-4">
        <AnimatePresence>
          {macros.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-6 bg-[var(--card-bg-solid)] border border-dashed border-[var(--border-color)] rounded-2xl text-[var(--text-tertiary)] text-sm"
            >
              هنوز ماکرویی تعریف نشده است.
            </motion.div>
          )}

          {macros.map((macro) => (
            <MacroCard
              key={macro.id}
              macro={macro}
              isEditing={editingMacroId === macro.id}
              onEditStart={() => handleEditStart(macro)}
              onDelete={() => handleDeleteMacro(macro.id)}
              newMacroTitle={newMacroTitle} setNewMacroTitle={setNewMacroTitle}
              newMacroIcon={newMacroIcon} setNewMacroIcon={setNewMacroIcon}
              iconMode={iconMode} setIconMode={setIconMode}
              tempActions={tempActions} setTempActions={setTempActions}
              onSave={() => handleSaveMacro(macro.id)}
              onCancel={() => setEditingMacroId(null)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
