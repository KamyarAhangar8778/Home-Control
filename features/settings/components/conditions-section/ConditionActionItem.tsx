import React from "react";
import { Trash2 } from "lucide-react";

interface Props {
  action: any;
  idx: number;
  actions: any[];
  onRemove: () => void;
  onUpdate: (updates: any) => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export function ConditionActionItem({ action, idx, actions, onRemove, onUpdate, showToast }: Props) {
  return (
    <div className="bg-[var(--card-bg-solid)] p-4 rounded-xl border border-[var(--border-color)] relative shadow-sm">
      <button 
        onClick={onRemove}
        className="absolute top-3 left-3 p-1.5 text-[var(--accent4)] hover:bg-[var(--accent4-transparent)] border border-transparent hover:border-[var(--accent4)] rounded-lg transition-colors"
        title="حذف"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      
      <div className="flex flex-col gap-3 text-xs pr-2">
        <div>
          <label className="block text-[var(--text-secondary)] font-semibold mb-1.5">زمان نگه‌داشتن:</label>
          <select
            value={action.reqHold}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (actions.some((a, i) => i !== idx && a.reqHold === val)) {
                showToast("این زمان قبلاً استفاده شده است", "error");
                return;
              }
              onUpdate({ reqHold: val });
            }}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)]"
          >
            <option value={0}>بدون نیاز به نگه‌داشتن (فوری)</option>
            <option value={3}>۳ ثانیه</option>
            <option value={5}>۵ ثانیه</option>
            <option value={10}>۱۰ ثانیه</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-[var(--text-secondary)] font-semibold mb-1.5">پایه هدف (GPIO):</label>
            <input
              type="text"
              placeholder="مثال: 4"
              value={action.targetPin}
              onChange={(e) => onUpdate({ targetPin: e.target.value })}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)] text-left"
              dir="ltr"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[var(--text-secondary)] font-semibold mb-1.5">وضعیت:</label>
            <select
              value={action.actionOn ? "1" : "0"}
              onChange={(e) => onUpdate({ actionOn: e.target.value === "1" })}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)]"
            >
              <option value="1">روشن (HIGH)</option>
              <option value="0">خاموش (LOW)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] font-semibold mb-1.5">نوع عملیات:</label>
          <select
            value={action.actionType || 0}
            onChange={(e) => onUpdate({ actionType: parseInt(e.target.value, 10) })}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)]"
          >
            <option value={0}>همان لحظه تغییر کند</option>
            <option value={1}>بعد از زمان تعیین‌شده تغییر کند</option>
            <option value={2}>فقط برای مدت معین بماند</option>
          </select>
        </div>

        {(action.actionType || 0) > 0 && (
          <div>
            <label className="block text-[var(--text-secondary)] font-semibold mb-1.5">زمان عملیات (ثانیه):</label>
            <input
              type="number"
              min="1"
              max="60"
              value={action.delay || 10}
              onChange={(e) => onUpdate({ delay: parseInt(e.target.value, 10) })}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)] text-left"
              dir="ltr"
            />
          </div>
        )}
      </div>
    </div>
  );
}
