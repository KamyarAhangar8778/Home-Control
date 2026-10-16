import React from "react";
import { Edit2, Plus, MapPin } from "lucide-react";
import ActionBuilder from "./ActionBuilder";

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
    <div className="bg-[var(--card-bg-solid)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1 h-full bg-[var(--accent3)]" />
      <h3 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
        {editingId ? <Edit2 className="w-4 h-4 text-[var(--accent3)]" /> : <Plus className="w-4 h-4 text-[var(--accent3)]" />}
        {editingId ? "ویرایش اتوماسیون" : "افزودن اتوماسیون جدید"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">عنوان (دلخواه):</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: روشن کردن پمپ آبیاری"
            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
          />
        </div>

        <div className="col-span-2 flex bg-[var(--card-bg)] p-1 rounded-xl border border-[var(--border-color)] overflow-hidden">
          <button
            onClick={() => setAutoType("schedule")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${autoType === "schedule" ? "bg-[var(--accent3)] text-white shadow-sm" : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)]"}`}
          >
            زمان‌بندی دوره‌ای
          </button>
          <button
            onClick={() => setAutoType("timer")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${autoType === "timer" ? "bg-[var(--accent3)] text-white shadow-sm" : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)]"}`}
          >
            تایمر یک‌بار مصرف
          </button>
          <button
            onClick={() => setAutoType("weather")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${autoType === "weather" ? "bg-[var(--accent3)] text-white shadow-sm" : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)]"}`}
          >
            مبتنی بر دما
          </button>
        </div>

        {autoType === "schedule" && (
          <>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">زمان (ساعت):</label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
                dir="ltr"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">تعداد تکرار:</label>
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
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">روزهای هفته:</label>
              <div className="flex flex-wrap justify-center gap-2">
                {DAYS_MAP.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => {
                      if (days.includes(d.value)) setDays(days.filter((x: number) => x !== d.value));
                      else setDays([...days, d.value].sort());
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${days.includes(d.value) ? "bg-[var(--accent3)] text-white shadow-md shadow-[var(--accent3-transparent)]" : "bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] md:hover:border-[var(--accent3)]"}`}
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
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">تاخیر (ساعت):</label>
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
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">تاخیر (دقیقه):</label>
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
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">دوره بررسی (ساعت):</label>
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={hasWeatherCondition}
                onChange={(e) => setHasWeatherCondition(e.target.checked)}
                className="w-4 h-4 text-[var(--accent3)] rounded focus:ring-[var(--accent3)]"
              />
              <span className="text-sm font-medium text-[var(--text-primary)]">اضافه کردن شرط آب‌وهوایی (اختیاری)</span>
            </label>
          </div>
        )}

        {(autoType === "weather" || hasWeatherCondition) && (
          <>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">نام شهر یا مختصات (انگلیسی):</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: Tehran یا 36.26,59.61"
                  className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
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
            <div className="col-span-2 flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">شرط دما:</label>
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
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">دما (°C):</label>
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

      <div className="flex gap-2 pt-2">
        <button onClick={handleSave} className="flex-1 py-2.5 bg-[var(--accent3)] md:hover:bg-[var(--accent2)] text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-[0.98]">
          {editingId ? "ذخیره تغییرات" : "افزودن به لیست"}
        </button>
        {editingId && (
          <button onClick={resetForm} className="px-4 py-2.5 bg-[var(--card-hover-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] md:hover:text-[var(--text-primary)] font-bold rounded-xl text-sm transition-all active:scale-[0.98]">
            انصراف
          </button>
        )}
      </div>
    </div>
  );
}
