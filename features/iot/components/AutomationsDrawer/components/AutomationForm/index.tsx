import React from "react";
import { Edit2, Plus, MapPin } from "lucide-react";
import ActionBuilder from "./ActionBuilder";
import { Card } from "@/components/ui/card";

interface AutomationFormProps {
  formHook: any; 
}

const DAYS_MAP = [
  { value: 6, label: "شنبه" },
  { value: 0, label: "یکشنبه" },
  { value: 1, label: "دوشنبه" },
  { value: 2, label: "سه‌شنبه" },
  { value: 3, label: "چهارشنبه" },
  { value: 4, label: "پنج‌شنبه" },
  { value: 5, label: "جمعه" },
];

export default function AutomationForm({ formHook }: AutomationFormProps) {
  const {
    editingId, title, setTitle, time, setTime, days, setDays, repeatCount, setRepeatCount,
    autoType, setAutoType, delayHours, setDelayHours, delayMinutes, setDelayMinutes,
    city, setCity, temperatureThreshold, setTemperatureThreshold, temperatureCondition, setTemperatureCondition,
    intervalMinutes, setIntervalMinutes, hasWeatherCondition, setHasWeatherCondition,
    isGettingLocation, actions, setActions, handleGetLocation, resetForm, handleSave
  } = formHook;

  return (
    <Card className="!relative !gap-4 !overflow-hidden !rounded-2xl !border-[var(--border-color)] !bg-[var(--card-bg-solid)] !p-5 shadow-sm">
      <div className="absolute top-0 right-0 w-1 h-full bg-[var(--accent3)]" />
      <h3 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
        {editingId ? <Edit2 className="w-4 h-4 text-[var(--accent3)]" /> : <Plus className="w-4 h-4 text-[var(--accent3)]" />}
        {editingId ? "ویرایش اتوماسیون" : "افزودن اتوماسیون جدید"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <div className="block text-xs font-medium text-[var(--text-secondary)] mb-1">عنوان (دلخواه):</div>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: روشن کردن پمپ آبیاری"
            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] focus-visible:ring-2 focus-visible:ring-[var(--accent3)]/50 text-sm transition-colors text-[var(--text-primary)]"
          />
        </div>

        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-1 bg-[var(--card-bg)] p-1 rounded-xl border border-[var(--border-color)]">
          <button type="button"
            onClick={() => setAutoType("schedule")}
            className={`w-full min-w-0 px-2 py-2 text-xs font-bold rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)] ${autoType === "schedule" ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-transparent text-[var(--text-secondary)] md:hover:bg-[var(--card-hover-bg)] md:hover:text-[var(--text-primary)]"}`}
          >
            زمان‌بندی دوره‌ای
          </button>
          <button type="button"
            onClick={() => setAutoType("timer")}
            className={`w-full min-w-0 px-2 py-2 text-xs font-bold rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)] ${autoType === "timer" ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-transparent text-[var(--text-secondary)] md:hover:bg-[var(--card-hover-bg)] md:hover:text-[var(--text-primary)]"}`}
          >
            تایمر یک‌بار مصرف
          </button>
          <button type="button"
            onClick={() => setAutoType("weather")}
            className={`w-full min-w-0 px-2 py-2 text-xs font-bold rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)] ${autoType === "weather" ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-transparent text-[var(--text-secondary)] md:hover:bg-[var(--card-hover-bg)] md:hover:text-[var(--text-primary)]"}`}
          >
            مبتنی بر دما
          </button>
        </div>

        {autoType === "schedule" && (
          <>
            <div className="col-span-2 md:col-span-1">
              <div className="block text-xs font-medium text-[var(--text-secondary)] mb-1">زمان (ساعت):</div>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                dir="ltr"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="block text-xs font-medium text-[var(--text-secondary)] mb-1">تعداد تکرار:</div>
              <input 
                type="number" 
                min="0"
                value={repeatCount}
                onChange={(e) => setRepeatCount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="0 (بی‌نهایت)"
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
              />
            </div>
            <div className="col-span-2">
              <div className="block text-xs font-medium text-[var(--text-secondary)] mb-2">روزهای هفته:</div>
              <div className="flex flex-wrap justify-center gap-2">
                {DAYS_MAP.map((d) => (
                  <button type="button"
                    key={d.value}
                    onClick={() => {
                      if (days.includes(d.value)) setDays(days.filter((x: number) => x !== d.value));
                      else setDays([...days, d.value].sort());
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)] ${days.includes(d.value) ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] md:hover:bg-[var(--card-hover-bg)] md:hover:text-[var(--text-primary)] md:hover:border-[var(--accent3)]"}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {autoType === "timer" && (
          <>
            <div className="col-span-2 md:col-span-1">
              <div className="block text-xs font-medium text-[var(--text-secondary)] mb-1">تاخیر (ساعت):</div>
              <input 
                type="number" 
                min="0"
                value={delayHours}
                onChange={(e) => setDelayHours(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="مثال: 10"
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="block text-xs font-medium text-[var(--text-secondary)] mb-1">تاخیر (دقیقه):</div>
              <input 
                type="number" 
                min="0"
                max="59"
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="مثال: 30"
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
              />
            </div>
          </>
        )}

        {autoType === "weather" && (
          <div className="col-span-2">
            <div className="block text-xs font-medium text-[var(--text-secondary)] mb-1">دوره بررسی (ساعت):</div>
            <select 
              value={intervalMinutes ? intervalMinutes / 60 : ""}
              onChange={(e) => setIntervalMinutes(e.target.value === "" ? "" : Number(e.target.value) * 60)}
              className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
            >
              <option value="" disabled>انتخاب کنید...</option>
              {Array.from({length: 24}, (_, i) => i + 1).map(h => (
                <option key={h} value={h}>هر {h} ساعت</option>
              ))}
            </select>
          </div>
        )}

        {(autoType === "timer" || autoType === "schedule") && (
          <div className="col-span-2 pt-2 border-t border-[var(--border-color)] mt-2">
            <div className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={hasWeatherCondition}
                onChange={(e) => setHasWeatherCondition(e.target.checked)}
                className="h-4 w-4 shrink-0 accent-[var(--accent3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)]"
              />
              <span className="text-sm font-medium text-[var(--text-primary)]">اضافه کردن شرط آب‌وهوایی (اختیاری)</span>
            </div>
          </div>
        )}

        {(autoType === "weather" || hasWeatherCondition) && (
          <>
            <div className="col-span-2">
              <div className="block text-xs font-medium text-[var(--text-secondary)] mb-1">نام شهر یا مختصات (انگلیسی):</div>
              <div className="flex min-w-0 gap-2">
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: Tehran یا 36.26,59.61"
                  className="min-w-0 flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] focus-visible:ring-2 focus-visible:ring-[var(--accent3)]/40 text-sm transition-colors text-[var(--text-primary)]"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center min-w-[44px] ${isGettingLocation ? "bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed" : "bg-[var(--card-hover-bg)] border-[var(--border-color)] text-[var(--text-secondary)] md:hover:border-[var(--accent3)] md:hover:text-[var(--accent3)]"}`}
                  title="دریافت مکان فعلی"
                >
                  {isGettingLocation ? (
                    <div className="w-5 h-5 border-2 border-[var(--accent3)] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <MapPin className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex-1">
                <div className="block text-xs font-medium text-[var(--text-secondary)] mb-1">شرط دما:</div>
                <select
                  value={temperatureCondition}
                  onChange={(e) => setTemperatureCondition(e.target.value as "greater" | "less")}
                  className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                >
                  <option value="greater">بیشتر از</option>
                  <option value="less">کمتر از</option>
                </select>
              </div>
              <div className="flex-1">
                <div className="block text-xs font-medium text-[var(--text-secondary)] mb-1">دما (°C):</div>
                <input 
                  type="number" 
                  value={temperatureThreshold}
                  onChange={(e) => setTemperatureThreshold(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="مثال: 30"
                  className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                  dir="ltr"
                />
              </div>
            </div>
          </>
        )}

        <ActionBuilder actions={actions} setActions={setActions} />
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-[var(--border-color)] pt-4 sm:flex-row">
        <button type="button" onClick={handleSave} className="flex-1 min-h-11 py-2.5 px-4 bg-[var(--accent3)] text-black font-bold rounded-xl text-sm transition-colors shadow-sm hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)] active:scale-[0.98]">
          {editingId ? "ذخیره تغییرات" : "افزودن به لیست"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="min-h-11 px-4 py-2.5 bg-[var(--card-hover-bg)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent3)] font-bold rounded-xl text-sm transition-colors active:scale-[0.98]">
            انصراف
          </button>
        )}
      </div>
    </Card>
  );
}
