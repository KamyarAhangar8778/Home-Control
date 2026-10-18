import React from "react";
import { Settings2 } from "lucide-react";
import { ConditionActionsList } from "./ConditionActionsList";
import { validateEsp32Pin } from "@/features/iot/utils/pinValidation";

interface Props {
  segment: any;
  rule: any;
  updateLocalRule: (type: "high" | "low", newActions: any[]) => void;
  onSave: () => void;
}

export function ConditionSegment({ segment, rule, updateLocalRule, onSave }: Props) {
  return (
    <div className="p-5 border border-[var(--border-color)] rounded-2xl bg-[var(--card-bg-solid)] shadow-sm flex flex-col gap-5">
      <div className="font-bold text-sm text-[var(--accent3)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
        <div className="p-1.5 rounded-lg bg-[var(--accent3-transparent)] text-[var(--accent3)]">
          <Settings2 className="w-4 h-4" />
        </div>
        {segment.title} (پایه: {segment.pin})
      </div>

      <div className="flex flex-col gap-4">
        <ConditionActionsList 
          type="high" 
          actions={rule.highActions || []} 
          onUpdate={(newActions) => updateLocalRule("high", newActions)} 
        />
        <ConditionActionsList 
          type="low" 
          actions={rule.lowActions || []} 
          onUpdate={(newActions) => updateLocalRule("low", newActions)} 
        />
      </div>

      <div className="flex justify-end mt-2">
        <button 
          onClick={onSave}
          className="w-full py-3 bg-[var(--accent3)] hover:bg-[var(--accent3-dark)] text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-[var(--accent3-transparent)]"
        >
          ثبت و ارسال
        </button>
      </div>
    </div>
  );
}
