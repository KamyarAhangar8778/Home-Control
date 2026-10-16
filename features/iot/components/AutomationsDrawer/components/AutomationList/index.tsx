import React from "react";
import { Edit2, Trash2, Clock, Thermometer, Info, Layers } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

const DAYS_MAP = [
  { value: 6, label: "شنبه" },
  { value: 0, label: "یکشنبه" },
  { value: 1, label: "دوشنبه" },
  { value: 2, label: "سه‌شنبه" },
  { value: 3, label: "چهارشنبه" },
  { value: 4, label: "پنج‌شنبه" },
  { value: 5, label: "جمعه" },
];

interface AutomationListProps {
  handleEdit: (auto: any) => void;
  handleDelete: (id: string) => void;
  handleToggle: (id: string, enabled: boolean) => void;
}

export default function AutomationList({ handleEdit, handleDelete, handleToggle }: AutomationListProps) {
  const automations = useIoTStore((state) => state.automations);

  return (
    <div className="space-y-4 mt-6 border-t border-[var(--border-color)] pt-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-[var(--text-primary)]">مدیریت اتوماسیون‌ها</h3>
        <span className="text-xs font-mono bg-[var(--card-hover-bg)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
          {automations.length} مورد
        </span>
      </div>
      
      {automations.length === 0 ? (
        <div className="text-center py-10 bg-[var(--card-bg-solid)] rounded-2xl border border-dashed border-[var(--border-color)] text-[var(--text-muted)] text-sm flex flex-col items-center justify-center gap-2">
          <Clock className="w-8 h-8 opacity-20" />
          هیچ اتوماسیونی ثبت نشده است.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {automations.map((auto) => {
            const hasMacros = auto.actions?.some(a => a.targetMacro);
            return (
              <div key={auto.id} className={`flex flex-col p-4 rounded-2xl border transition-all shadow-sm ${auto.enabled ? "bg-[var(--card-bg-solid)] border-[var(--border-color)]" : "bg-[var(--card-bg)] border-[var(--border-color)] opacity-70"}`}>
                
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${auto.enabled ? (hasMacros ? "bg-indigo-500 shadow-indigo-500/40" : (auto.actions?.[0]?.actionOn ? "bg-emerald-500 shadow-emerald-500/40" : "bg-rose-500 shadow-rose-500/40")) : "bg-slate-500 shadow-slate-500/40"}`} />
                    <h4 className="font-bold text-[var(--text-primary)] text-sm">{auto.title}</h4>
                  </div>
                  
                  {/* Toggle Switch */}
                  <button 
                    onClick={() => handleToggle(auto.id, !auto.enabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${auto.enabled ? "bg-[var(--accent3)]" : "bg-[var(--border-color)]"}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${auto.enabled ? "translate-x-1" : "translate-x-4"}`} />
                  </button>
                </div>

                {/* Card Body - Time & Details */}
                <div className="flex items-center justify-between mb-4 bg-[var(--card-hover-bg)] p-3 rounded-xl">
                  {auto.intervalMinutes ? (
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-[var(--accent3)]" />
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {auto.city}: دما {auto.temperatureCondition === "greater" ? "بیشتر از" : "کمتر از"} <span className="font-mono text-lg" dir="ltr">{auto.temperatureThreshold}°C</span>
                        <span className="text-xs text-[var(--text-secondary)] block mt-1">هر {auto.intervalMinutes / 60} ساعت</span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[var(--accent3)]" />
                      <span className="text-xl font-bold font-mono text-[var(--text-primary)] tracking-wider" dir="ltr">{auto.time}</span>
                      {auto.conditionType === "weather" && auto.city && (
                        <div className="flex flex-col mr-2 text-[10px] text-[var(--text-secondary)]">
                          <span>شرط: {auto.city}</span>
                          <span>دما {auto.temperatureCondition === "greater" ? ">" : "<"} {auto.temperatureThreshold}°C</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-col items-end gap-1.5">
                    {auto.intervalMinutes ? (
                      <span className="text-[10px] bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-bold">
                        دما محور (دوره‌ای)
                      </span>
                    ) : auto.repeatCount ? (
                      <span className="text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        یک‌بار مصرف ({auto.repeatCount} بار)
                      </span>
                    ) : (
                      <span className="text-[10px] bg-[var(--accent3-transparent)] text-[var(--accent3)] px-2 py-0.5 rounded-md font-bold">
                        دوره‌ای
                      </span>
                    )}
                    
                    {!auto.intervalMinutes && auto.days && auto.days.length > 0 && (
                      <div className="flex flex-wrap justify-end gap-1 max-w-[150px]">
                        {auto.days.map((d: number) => (
                          <span key={d} className="text-[9px] bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] px-1.5 py-0.5 rounded">
                            {DAYS_MAP.find(m => m.value === d)?.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Card Footer - Actions summary & controls */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-color)]">
                  <div className="text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 opacity-70" />
                    <span>{auto.actions?.length || 0} عملیات تنظیم شده</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(auto)} className="p-2 text-[var(--text-muted)] md:hover:text-blue-500 md:hover:bg-blue-500/10 rounded-lg transition-colors" title="ویرایش">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(auto.id)} className="p-2 text-[var(--text-muted)] md:hover:text-rose-500 md:hover:bg-rose-500/10 rounded-lg transition-colors" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
