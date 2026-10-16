import React from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { publishUpdateRuleCommand } from "@/features/iot/services/mqttService";
import { validateEsp32Pin } from "@/features/iot/utils/pinValidation";
import { SegmentRule } from "./types";
import ActionList from "./ActionList";

interface SegmentRuleCardProps {
  segment: any;
  rule: SegmentRule;
  setLocalRules: React.Dispatch<React.SetStateAction<Record<string, SegmentRule>>>;
}

export default function SegmentRuleCard({ segment, rule, setLocalRules }: SegmentRuleCardProps) {
  const updateSegmentRule = useIoTStore((state) => state.updateSegmentRule);
  const showToast = useIoTStore((state) => state.showToast);

  const handleSave = () => {
    // Validate all pins
    const allActions = [...(rule.highActions || []), ...(rule.lowActions || [])];
    for (const action of allActions) {
      if (action.targetPin) {
        const val = validateEsp32Pin(action.targetPin, "output");
        if (!val.isValid) {
          showToast(`خطا در پایه: ${val.message}`, "error");
          return;
        }
      }
    }
    
    updateSegmentRule(segment.id, rule);
    publishUpdateRuleCommand(segment.id, rule.highActions, rule.lowActions);
    showToast("شرط‌ها با موفقیت ثبت و به دستگاه ارسال شدند.", "success");
  };

  const updateActions = (type: "high" | "low", newActions: any[]) => {
    setLocalRules(prev => ({
      ...prev,
      [segment.id]: {
        ...rule,
        [type === "high" ? "highActions" : "lowActions"]: newActions
      }
    }));
  };

  return (
    <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[var(--card-bg)] shadow-sm flex flex-col gap-5">
      <div className="font-bold text-sm text-[var(--accent3)] flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/50 pb-3">
        <span className="w-2 h-2 rounded-full bg-[var(--accent3)]"></span>
        {segment.title} (پایه: {segment.pin})
      </div>

      <div className="flex flex-col gap-4">
        <ActionList type="high" actions={rule.highActions} setActions={(a) => updateActions("high", a)} />
        <ActionList type="low" actions={rule.lowActions} setActions={(a) => updateActions("low", a)} />
      </div>

      <div className="flex justify-end mt-2">
        <button 
          onClick={handleSave}
          className="w-full py-2 bg-[var(--accent3)] hover:bg-[var(--accent2)] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          ثبت و ارسال
        </button>
      </div>
    </div>
  );
}
