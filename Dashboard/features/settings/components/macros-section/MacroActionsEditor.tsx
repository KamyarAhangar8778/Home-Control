import React from "react";
import { Trash2 } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface Props {
  tempActions: Array<{targetPin: string, actionOn: boolean}>;
  setTempActions: (actions: Array<{targetPin: string, actionOn: boolean}>) => void;
}

export function MacroActionsEditor({ tempActions, setTempActions }: Props) {
  const segments = useIoTStore(s => s.segments);

  const handleAddAction = () => {
    if (segments.length === 0) return;
    setTempActions([...tempActions, { targetPin: segments[0].pin, actionOn: true }]);
  };

  const handleRemoveAction = (index: number) => {
    const newActions = [...tempActions];
    newActions.splice(index, 1);
    setTempActions(newActions);
  };

  const handleUpdateAction = (index: number, updates: Partial<{targetPin: string, actionOn: boolean}>) => {
    const newActions = [...tempActions];
    newActions[index] = { ...newActions[index], ...updates };
    setTempActions(newActions);
  };

  return (
    <div className="space-y-2 border-t border-[var(--border-color)] pt-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[var(--text-secondary)]">عملیات‌ها</h4>
        <button
          onClick={handleAddAction}
          className="text-[var(--accent3)] text-xs font-bold px-2 py-1 bg-[var(--accent3-transparent)] rounded-lg hover:bg-[var(--accent3)] hover:text-white transition-colors"
        >
          + افزودن
        </button>
      </div>

      {tempActions.length === 0 && (
        <p className="text-xs text-[var(--text-tertiary)] opacity-80 text-center py-2">
          عملیاتی اضافه نشده است
        </p>
      )}

      {tempActions.map((action, index) => (
        <div key={index} className="flex items-center gap-2 bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-2 rounded-xl">
          <select
            value={action.targetPin}
            onChange={(e) => handleUpdateAction(index, { targetPin: e.target.value })}
            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)]"
          >
            {segments.map((seg) => (
              <option key={seg.id} value={seg.pin}>
                {seg.title} ({seg.pin})
              </option>
            ))}
          </select>
          <select
            value={action.actionOn ? "on" : "off"}
            onChange={(e) => handleUpdateAction(index, { actionOn: e.target.value === "on" })}
            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)]"
          >
            <option value="on">روشن شود</option>
            <option value="off">خاموش شود</option>
          </select>
          <button
            onClick={() => handleRemoveAction(index)}
            className="p-2 text-[var(--accent4)] hover:bg-[var(--accent4-transparent)] border border-transparent hover:border-[var(--accent4)] rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
