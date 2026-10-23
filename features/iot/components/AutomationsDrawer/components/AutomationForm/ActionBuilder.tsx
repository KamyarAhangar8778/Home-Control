import React from "react";
import { X, Play, Square, Layers, Plus } from "lucide-react";
import { useAutomationActions } from "../../hooks/useAutomationActions";
import { Card } from "@/components/ui/card";

interface ActionBuilderProps {
  actions: any[];
  setActions: (actions: any[]) => void;
}

export default function ActionBuilder({ actions, setActions }: ActionBuilderProps) {
  const { addAction, updateAction, removeAction, segments, macros } = useAutomationActions(actions, setActions);

  return (
    <div className="col-span-2 space-y-3 pt-2">
      <div className="block text-xs font-medium text-[var(--text-secondary)]">عملیات‌ها ({actions.length}):</div>
      
      {actions.map((act, index) => (
        <Card key={act.targetPin ?? act.targetMacro} className="!relative !gap-2 !rounded-xl !border-[var(--border-color)] !bg-[var(--card-bg)] !p-3 group">
          <button type="button" 
            onClick={() => removeAction(index)}
            aria-label={`حذف عملیات ${index + 1}`}
            className="absolute -top-2 -left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white opacity-100 shadow-md transition-opacity hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <X className="w-3 h-3" />
          </button>

          {act.targetPin !== undefined ? (
            <>
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-[10px] font-bold text-[var(--accent3)] bg-[var(--accent3-transparent)] px-2 py-1 rounded-md">پایه</span>
                <select 
                  value={act.targetPin}
                  onChange={(e) => updateAction(index, { targetPin: e.target.value })}
                  className="min-w-0 flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-2 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-2 focus:ring-[var(--accent3)]/20 text-xs transition-colors text-[var(--text-primary)]"
                >
                  {segments.map(seg => (
                    <option key={seg.id} value={seg.pin}>{seg.title} (پایه {seg.pin})</option>
                  ))}
                  {(!segments.find(s => s.pin === act.targetPin)) && (
                    <option value={act.targetPin}>پایه دستی: {act.targetPin}</option>
                  )}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--card-bg-solid)] rounded-lg border border-[var(--border-color)]">
                <button type="button" 
                  onClick={() => updateAction(index, { actionOn: true })}
                  className={`flex-1 min-h-9 py-1.5 rounded-md text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${act.actionOn ? "bg-emerald-600 text-white shadow-sm" : "bg-transparent text-[var(--text-secondary)] md:hover:bg-[var(--accent)] md:hover:text-[var(--foreground)]"}`}
                >
                  <Play className="w-3 h-3" /> روشن
                </button>
                <button type="button" 
                  onClick={() => updateAction(index, { actionOn: false })}
                  className={`flex-1 min-h-9 py-1.5 rounded-md text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${!act.actionOn ? "bg-rose-600 text-white shadow-sm" : "bg-transparent text-[var(--text-secondary)] md:hover:bg-[var(--destructive)]/10 md:hover:text-[var(--destructive)]"}`}
                >
                  <Square className="w-3 h-3" /> خاموش
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-md flex items-center gap-1">
                <Layers className="w-3 h-3" />
                ماکرو
              </span>
              <select 
                value={act.targetMacro}
                onChange={(e) => updateAction(index, { targetMacro: e.target.value })}
                className="min-w-0 flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-2 rounded-lg focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-xs transition-colors text-[var(--text-primary)]"
              >
                <option value="" disabled>یک ماکرو انتخاب کنید</option>
                {macros.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
          )}
        </Card>
      ))}

      <div className="grid grid-cols-2 gap-2">
        <button type="button" 
          onClick={() => addAction("pin")}
          className="flex-1 min-h-11 py-2 border border-dashed border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:border-[var(--accent3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)] transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> پایه
        </button>
        <button type="button" 
          onClick={() => addAction("macro")}
          className="flex-1 min-h-11 py-2 border border-dashed border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:border-[var(--accent3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)] transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> ماکرو
        </button>
      </div>
    </div>
  );
}
