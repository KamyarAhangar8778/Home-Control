import React from "react";
import { X, Play, Square, Layers, Plus } from "lucide-react";
import { useAutomationActions } from "../../hooks/useAutomationActions";

interface ActionBuilderProps {
  actions: any[];
  setActions: (actions: any[]) => void;
}

export default function ActionBuilder({ actions, setActions }: ActionBuilderProps) {
  const { addAction, updateAction, removeAction, segments, macros } = useAutomationActions(actions, setActions);

  return (
    <div className="col-span-2 space-y-3 pt-2">
      <label className="block text-xs font-medium text-[var(--text-secondary)]">عملیات‌ها ({actions.length}):</label>
      
      {actions.map((act, index) => (
        <div key={index} className="flex flex-col gap-2 p-3 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] relative group">
          <button 
            onClick={() => removeAction(index)}
            className="absolute -top-2 -left-2 p-1.5 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <X className="w-3 h-3" />
          </button>

          {act.targetPin !== undefined ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[var(--accent3)] bg-[var(--accent3-transparent)] px-2 py-1 rounded-md">پایه</span>
                <select 
                  value={act.targetPin}
                  onChange={(e) => updateAction(index, { targetPin: e.target.value })}
                  className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-2 rounded-lg focus:outline-none focus:border-[var(--accent3)] text-xs transition-colors text-[var(--text-primary)]"
                >
                  {segments.map(seg => (
                    <option key={seg.id} value={seg.pin}>{seg.title} (پایه {seg.pin})</option>
                  ))}
                  {(!segments.find(s => s.pin === act.targetPin)) && (
                    <option value={act.targetPin}>پایه دستی: {act.targetPin}</option>
                  )}
                </select>
              </div>
              <div className="flex gap-2 p-1 bg-[var(--card-bg-solid)] rounded-lg border border-[var(--border-color)]">
                <button 
                  onClick={() => updateAction(index, { actionOn: true })}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${act.actionOn ? "bg-emerald-500 text-white shadow-sm" : "text-[var(--text-muted)] md:hover:text-emerald-500"}`}
                >
                  <Play className="w-3 h-3" /> روشن
                </button>
                <button 
                  onClick={() => updateAction(index, { actionOn: false })}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${!act.actionOn ? "bg-rose-500 text-white shadow-sm" : "text-[var(--text-muted)] md:hover:text-rose-500"}`}
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
                className="flex-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-2 rounded-lg focus:outline-none focus:border-indigo-500/50 text-xs transition-colors text-[var(--text-primary)]"
              >
                <option value="" disabled>یک ماکرو انتخاب کنید</option>
                {macros.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <button 
          onClick={() => addAction("pin")}
          className="flex-1 py-2 border border-dashed border-[var(--border-color)] rounded-xl text-xs text-[var(--text-muted)] md:hover:text-[var(--accent3)] md:hover:border-[var(--accent3)] transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> پایه
        </button>
        <button 
          onClick={() => addAction("macro")}
          className="flex-1 py-2 border border-dashed border-[var(--border-color)] rounded-xl text-xs text-[var(--text-muted)] md:hover:text-indigo-400 md:hover:border-indigo-400 transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> ماکرو
        </button>
      </div>
    </div>
  );
}
