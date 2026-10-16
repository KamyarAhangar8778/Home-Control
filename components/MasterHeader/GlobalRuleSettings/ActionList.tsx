import React from "react";
import { Plus } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { RuleAction } from "./types";
import ActionItem from "./ActionItem";

interface ActionListProps {
  type: "high" | "low";
  actions: RuleAction[];
  setActions: (actions: RuleAction[]) => void;
}

export default function ActionList({ type, actions, setActions }: ActionListProps) {
  const showToast = useIoTStore((state) => state.showToast);
  const isHigh = type === "high";

  const colorClasses = isHigh ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
  const bgClass = isHigh ? "bg-emerald-500" : "bg-rose-500";
  const borderClass = isHigh ? "border-emerald-100 dark:border-emerald-900/30" : "border-rose-100 dark:border-rose-900/30";
  const containerBg = isHigh ? "bg-emerald-50/50 dark:bg-emerald-950/20" : "bg-rose-50/50 dark:bg-rose-950/20";

  const addAction = () => {
    if (actions.length >= 4) {
      showToast("حداکثر ۴ عملیات برای هر وضعیت مجاز است", "error");
      return;
    }
    const availableHolds = [0, 3, 5, 10].filter(h => !actions.some(a => a.reqHold === h));
    if (availableHolds.length === 0) return;

    const newAction: RuleAction = { reqHold: availableHolds[0], targetPin: "", actionOn: true, actionType: 0, delay: 0 };
    setActions([...actions, newAction]);
  };

  const removeAction = (index: number) => {
    const newArray = [...actions];
    newArray.splice(index, 1);
    setActions(newArray);
  };

  const updateAction = (index: number, updates: Partial<RuleAction>) => {
    const newArray = [...actions];
    newArray[index] = { ...newArray[index], ...updates };
    setActions(newArray);
  };

  return (
    <div className={`border ${borderClass} ${containerBg} p-4 rounded-xl`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className={`${colorClasses} font-medium text-sm flex items-center gap-2`}>
          <span className={`w-2 h-2 rounded-full ${bgClass}`}></span>
          هنگام {isHigh ? "فعال شدن" : "غیرفعال شدن"}
        </h4>
        <button 
          onClick={addAction}
          disabled={actions.length >= 4}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md border ${isHigh ? "border-emerald-200 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/50" : "border-rose-200 text-rose-600 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/50"} transition-colors disabled:opacity-50`}
        >
          <Plus className="w-3 h-3" /> افزودن
        </button>
      </div>

      {actions.length === 0 ? (
        <div className="text-center py-4 text-slate-400 text-xs bg-white/50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
          هیچ عملیاتی تعریف نشده
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((action, idx) => (
            <ActionItem 
              key={idx}
              action={action}
              idx={idx}
              isHigh={isHigh}
              actions={actions}
              updateAction={updateAction}
              removeAction={removeAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
