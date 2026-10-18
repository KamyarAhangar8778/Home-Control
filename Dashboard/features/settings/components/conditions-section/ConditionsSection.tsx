"use client";

import React, { useState } from "react";
import { Info, Settings2 } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { publishUpdateRuleCommand } from "@/features/iot/services/mqttService";
import { validateEsp32Pin } from "@/features/iot/utils/pinValidation";
import { ConditionSegment } from "./ConditionSegment";

export default function ConditionsSection() {
  const segments = useIoTStore((state) => state.segments);
  const updateSegmentRule = useIoTStore((state) => state.updateSegmentRule);
  const showToast = useIoTStore((state) => state.showToast);
  
  const [localRules, setLocalRules] = useState<Record<string, {
    highActions: Array<{ reqHold: number; targetPin: string; actionOn: boolean; actionType?: number; delay?: number; }>;
    lowActions: Array<{ reqHold: number; targetPin: string; actionOn: boolean; actionType?: number; delay?: number; }>;
  }>>({});

  const inputSegments = segments.filter((s) => s.type === "input");

  return (
    <div className="space-y-6">
      <div className="bg-[var(--accent3-transparent)] border border-[var(--accent3)] text-[var(--accent3)] p-4 rounded-xl text-xs flex gap-3 items-start">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          در این بخش می‌توانید برای زمان‌های مختلف نگه‌داشتن کلید (مثلاً 0، 3، 5 یا 10 ثانیه) عملیات متفاوتی تعریف کنید. 
          شما می‌توانید برای هر وضعیت چندین عملیات بسازید تا هرکدام روی یک پایه‌ی مجزا تاثیر بگذارند.
        </p>
      </div>

      {inputSegments.length === 0 ? (
        <div className="text-center py-8 bg-[var(--card-bg-solid)] rounded-2xl border border-dashed border-[var(--border-color)]">
          <Settings2 className="w-8 h-8 mx-auto mb-2 text-[var(--text-secondary)] opacity-50" />
          <p className="text-sm text-[var(--text-secondary)]">هیچ ورودی (سنسور/کلید) در داشبورد وجود ندارد.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {inputSegments.map(segment => {
            const originalRule = segment.rule || { highActions: [], lowActions: [] };
            const rule = localRules[segment.id] || { 
              highActions: originalRule.highActions || [], 
              lowActions: originalRule.lowActions || [] 
            };
            
            const handleSave = () => {
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

            const updateLocalRule = (type: "high" | "low", newActions: any[]) => {
              setLocalRules(prev => ({
                ...prev,
                [segment.id]: {
                  ...rule,
                  [type === "high" ? "highActions" : "lowActions"]: newActions
                }
              }));
            };

            return (
              <ConditionSegment 
                key={segment.id}
                segment={segment}
                rule={rule}
                updateLocalRule={updateLocalRule}
                onSave={handleSave}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
