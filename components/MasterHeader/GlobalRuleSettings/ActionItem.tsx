import React from "react";
import { Trash2 } from "lucide-react";
import { RuleAction } from "./types";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface ActionItemProps {
  action: RuleAction;
  idx: number;
  isHigh: boolean;
  actions: RuleAction[];
  updateAction: (index: number, updates: Partial<RuleAction>) => void;
  removeAction: (index: number) => void;
}

export default function ActionItem({ action, idx, isHigh, actions, updateAction, removeAction }: ActionItemProps) {
  const showToast = useIoTStore((state) => state.showToast);
  const focusClass = isHigh ? "focus:border-emerald-500" : "focus:border-rose-500";

  return (
    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 relative shadow-sm">
      <button 
        onClick={() => removeAction(idx)}
        className="absolute top-2 left-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        title="حذف"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      
      <div className="flex flex-col gap-3 text-xs pr-2">
        <div>
          <label className="block text-slate-500 mb-1">زمان نگه‌داشتن:</label>
          <select
            value={action.reqHold}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (actions.some((a, i) => i !== idx && a.reqHold === val)) {
                showToast("این زمان قبلاً استفاده شده است", "error");
                return;
              }
              updateAction(idx, { reqHold: val });
            }}
            className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-md focus:outline-none ${focusClass}`}
          >
            <option value={0}>بدون نیاز به نگه‌داشتن (فوری)</option>
            <option value={3}>۳ ثانیه</option>
            <option value={5}>۵ ثانیه</option>
            <option value={10}>۱۰ ثانیه</option>
          </select>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-slate-500 mb-1">پایه هدف (GPIO):</label>
            <input
              type="text"
              placeholder="مثال: 4"
              value={action.targetPin}
              onChange={(e) => updateAction(idx, { targetPin: e.target.value })}
              className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-md text-left focus:outline-none ${focusClass}`}
              dir="ltr"
            />
          </div>
          <div className="flex-1">
            <label className="block text-slate-500 mb-1">وضعیت:</label>
            <select
              value={action.actionOn ? "1" : "0"}
              onChange={(e) => updateAction(idx, { actionOn: e.target.value === "1" })}
              className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-md focus:outline-none ${focusClass}`}
            >
              <option value="1">روشن (HIGH)</option>
              <option value="0">خاموش (LOW)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-500 mb-1">نوع عملیات:</label>
          <select
            value={action.actionType || 0}
            onChange={(e) => updateAction(idx, { actionType: parseInt(e.target.value, 10) })}
            className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-md focus:outline-none ${focusClass}`}
          >
            <option value={0}>همان لحظه تغییر کند</option>
            <option value={1}>بعد از زمان تعیین‌شده تغییر کند</option>
            <option value={2}>فقط برای مدت معین بماند</option>
          </select>
        </div>

        {(action.actionType || 0) > 0 && (
          <div>
            <label className="block text-slate-500 mb-1 text-xs">زمان عملیات (بین ۱ تا ۶۰ ثانیه):</label>
            <input
              type="number"
              min="1"
              max="60"
              value={action.delay || 10}
              onChange={(e) => updateAction(idx, { delay: parseInt(e.target.value, 10) })}
              className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-2 rounded-md text-left text-xs focus:outline-none ${focusClass}`}
              dir="ltr"
            />
          </div>
        )}
      </div>
    </div>
  );
}
