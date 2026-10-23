import { Plus } from "lucide-react";
import { ConditionActionItem, type ConditionAction } from "./ConditionActionItem";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface Props {
  type: "high" | "low";
  actions: ConditionAction[];
  onUpdate: (actions: ConditionAction[]) => void;
}

export function ConditionActionsList({ type, actions, onUpdate }: Props) {
  const showToast = useIoTStore((state) => state.showToast);
  const isHigh = type === "high";
  const colorClasses = isHigh ? "text-[var(--accent4)]" : "text-[var(--accent3)]";
  const bgClass = isHigh ? "bg-[var(--accent4)]" : "bg-[var(--accent3)]";
  const borderClass = isHigh ? "border-[var(--accent4-transparent)]" : "border-[var(--accent3-transparent)]";
  const containerBg = isHigh ? "bg-[var(--accent4-transparent)]" : "bg-[var(--accent3-transparent)]";

  const addAction = () => {
    if (actions.length >= 4) { showToast("حداکثر ۴ عملیات برای هر وضعیت مجاز است", "error"); return; }
    const availableHolds = [0, 3, 5, 10].filter((hold) => !actions.some((action) => action.reqHold === hold));
    if (availableHolds.length === 0) return;
    onUpdate([...actions, { reqHold: availableHolds[0], targetPin: "", actionOn: true, actionType: 0, delay: 0 }]);
  };
  const removeAction = (index: number) => { const next = [...actions]; next.splice(index, 1); onUpdate(next); };
  const updateAction = (index: number, updates: Partial<ConditionAction>) => { const next = [...actions]; next[index] = { ...next[index], ...updates }; onUpdate(next); };

  return (
    <div className={`border ${borderClass} ${containerBg} p-4 rounded-xl`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className={`${colorClasses} font-bold text-sm flex items-center gap-2`}><span aria-hidden="true" className={`w-2 h-2 rounded-full ${bgClass}`} />هنگام {isHigh ? "فعال شدن" : "غیرفعال شدن"}</h4>
        <button type="button" onClick={addAction} disabled={actions.length >= 4} className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors disabled:opacity-50 ${isHigh ? "border-[var(--accent4)] text-[var(--accent4)] hover:bg-[var(--accent4)] hover:text-white" : "border-[var(--accent3)] text-[var(--accent3)] hover:bg-[var(--accent3)] hover:text-white"}`}><Plus aria-hidden="true" className="w-3 h-3" /> افزودن</button>
      </div>
      {actions.length === 0 ? <div className="text-center py-4 text-[var(--text-tertiary)] text-xs bg-[var(--card-bg-solid)] rounded-lg border border-dashed border-[var(--border-color)]">هیچ عملیاتی تعریف نشده</div> : (
        <div className="space-y-3">{actions.map((action, idx) => <ConditionActionItem key={action.reqHold} action={action} idx={idx} actions={actions} onRemove={() => removeAction(idx)} onUpdate={(updates) => updateAction(idx, updates)} showToast={showToast} />)}</div>
      )}
    </div>
  );
}
