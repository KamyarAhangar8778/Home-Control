import { Trash2 } from "lucide-react";

export interface ConditionAction {
  reqHold: number;
  targetPin: string;
  actionOn: boolean;
  actionType?: number;
  delay?: number;
}
interface Props {
  action: ConditionAction;
  idx: number;
  actions: ConditionAction[];
  onRemove: () => void;
  onUpdate: (updates: Partial<ConditionAction>) => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export function ConditionActionItem({ action, idx, actions, onRemove, onUpdate, showToast }: Props) {
  return (
    <div className="bg-[var(--card-bg-solid)] p-4 rounded-xl border border-[var(--border-color)] relative shadow-sm">
      <button type="button" onClick={onRemove} aria-label="حذف عملیات" className="absolute top-3 left-3 p-1.5 text-[var(--accent4)] hover:bg-[var(--accent4-transparent)] border border-transparent hover:border-[var(--accent4)] rounded-lg transition-colors" title="حذف"><Trash2 aria-hidden="true" className="w-4 h-4" /></button>
      <div className="flex flex-col gap-3 text-xs pr-2">
        <div><label className="block text-[var(--text-secondary)] font-semibold mb-1.5"><span>زمان نگه‌داشتن:</span><select aria-label="زمان نگه‌داشتن" value={action.reqHold} onChange={(e) => { const val = Number.parseInt(e.target.value, 10); if (actions.some((a, i) => i !== idx && a.reqHold === val)) { showToast("این زمان قبلاً استفاده شده است", "error"); return; } onUpdate({ reqHold: val }); }} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)]"><option value={0}>بدون نیاز به نگه‌داشتن (فوری)</option><option value={3}>۳ ثانیه</option><option value={5}>۵ ثانیه</option><option value={10}>۱۰ ثانیه</option></select></label></div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><label className="block text-[var(--text-secondary)] font-semibold mb-1.5">پایه هدف (GPIO):<input aria-label="پایه هدف GPIO" type="text" placeholder="مثال: 4" value={action.targetPin} onChange={(e) => onUpdate({ targetPin: e.target.value })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)] text-left" dir="ltr" /></label></div>
          <div className="flex-1"><label className="block text-[var(--text-secondary)] font-semibold mb-1.5">وضعیت:<select aria-label="وضعیت خروجی" value={action.actionOn ? "1" : "0"} onChange={(e) => onUpdate({ actionOn: e.target.value === "1" })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)]"><option value="1">روشن (HIGH)</option><option value="0">خاموش (LOW)</option></select></label></div>
        </div>
        <div><label className="block text-[var(--text-secondary)] font-semibold mb-1.5">نوع عملیات:<select aria-label="نوع عملیات" value={action.actionType || 0} onChange={(e) => onUpdate({ actionType: Number.parseInt(e.target.value, 10) })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)]"><option value={0}>همان لحظه تغییر کند</option><option value={1}>بعد از زمان تعیین‌شده تغییر کند</option><option value={2}>فقط برای مدت معین بماند</option></select></label></div>
        {(action.actionType || 0) > 0 && <div><label className="block text-[var(--text-secondary)] font-semibold mb-1.5">زمان عملیات (ثانیه):<input aria-label="زمان عملیات به ثانیه" type="number" min="1" max="60" value={action.delay || 10} onChange={(e) => onUpdate({ delay: Number.parseInt(e.target.value, 10) })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all text-[var(--text-primary)] text-left" dir="ltr" /></label></div>}
      </div>
    </div>
  );
}
