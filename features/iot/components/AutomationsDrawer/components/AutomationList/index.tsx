import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Clock, Thermometer, Info, Layers } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { Card } from "@/components/ui/card";

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
        <Card className="!gap-2 !items-center !justify-center !rounded-2xl !border-dashed !bg-[var(--card-bg-solid)] !p-10 text-center text-sm text-[var(--text-muted)] shadow-none">
          <Clock className="w-8 h-8 opacity-30" />
          هیچ اتوماسیونی ثبت نشده است.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {automations.map((auto) => {
            const hasMacros = auto.actions?.some(a => a.targetMacro);
            return (
              <Card key={auto.id} className={`!gap-0 !rounded-2xl !border-[var(--border-color)] !p-4 !shadow-sm transition-all ${auto.enabled ? "!bg-[var(--card-bg-solid)]" : "!bg-[var(--card-bg)]"}`}>
                
                {/* Card Header */}
                <div className="mb-4 flex min-w-0 items-center justify-between gap-4">
                  <h4 className="min-w-0 flex-1 break-words text-sm font-bold leading-6 text-[var(--text-primary)]">
                    {auto.title}
                  </h4>

                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className={`text-xs font-semibold ${auto.enabled ? "text-emerald-700 dark:text-emerald-400" : "text-[var(--text-secondary)]"}`}>
                      {auto.enabled ? "فعال" : "غیرفعال"}
                    </span>
                    <Button variant="ghost"
                      type="button"
                      role="switch"
                      aria-checked={auto.enabled}
                      aria-label={`وضعیت اتوماسیون ${auto.title}`}
                      onClick={() => handleToggle(auto.id, !auto.enabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)] motion-reduce:transition-none ${auto.enabled ? "justify-end border-emerald-700 bg-emerald-600" : "justify-start border-[var(--border-color)] bg-[var(--card-hover-bg)]"}`}
                    >
                      <span className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-black/10" />
                    </Button>
                  </div>
                </div>

                {/* Card Body - Time & Details */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4 bg-[var(--card-hover-bg)] p-3 rounded-xl">
                  {auto.intervalMinutes ? (
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Thermometer className="w-5 h-5 text-[var(--accent3)]" />
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {auto.city}: دما {auto.temperatureCondition === "greater" ? "بیشتر از" : "کمتر از"} <span className="font-mono text-lg" dir="ltr">{auto.temperatureThreshold}°C</span>
                        <span className="text-xs text-[var(--text-secondary)] block mt-1">هر {auto.intervalMinutes / 60} ساعت</span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex min-w-0 flex-1 items-center gap-2">
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
                  
                  <div className="flex max-w-full flex-col items-end gap-1.5">
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
                <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-3 border-t border-[var(--border-color)]">
                  <div className="text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 opacity-70" />
                    <span>{auto.actions?.length || 0} عملیات تنظیم شده</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" type="button" onClick={() => handleEdit(auto)} aria-label={`ویرایش اتوماسیون ${auto.title}`} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--text-primary)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)]" title="ویرایش">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" type="button" onClick={() => handleDelete(auto.id)} aria-label={`حذف اتوماسیون ${auto.title}`} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)]" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
