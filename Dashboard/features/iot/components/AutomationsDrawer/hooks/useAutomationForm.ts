import { useState } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export function useAutomationForm() {
  const automations = useIoTStore((state) => state.automations);
  const setAutomations = useIoTStore((state) => state.setAutomations);
  const showToast = useIoTStore((state) => state.showToast);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [days, setDays] = useState<number[]>([]);
  const [repeatCount, setRepeatCount] = useState<number | "">("");
  
  const [autoType, setAutoType] = useState<"schedule" | "timer" | "weather">("schedule");
  const [delayHours, setDelayHours] = useState<number | "">("");
  const [delayMinutes, setDelayMinutes] = useState<number | "">("");
  
  const [city, setCity] = useState("");
  const [temperatureThreshold, setTemperatureThreshold] = useState<number | "">("");
  const [temperatureCondition, setTemperatureCondition] = useState<"greater" | "less">("greater");
  
  const [intervalMinutes, setIntervalMinutes] = useState<number | "">("");
  const [hasWeatherCondition, setHasWeatherCondition] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Actions state
  const [actions, setActions] = useState<Array<{
    targetPin?: string;
    targetMacro?: string;
    actionOn?: boolean;
  }>>([]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast("مرورگر شما از قابلیت مکان‌یابی پشتیبانی نمی‌کند.", "error");
      return;
    }
    
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        setCity(`${lat},${lon}`);
        setIsGettingLocation(false);
        showToast("مکان شما با موفقیت ثبت شد.", "success");
      },
      (error) => {
        setIsGettingLocation(false);
        showToast("خطا در دریافت مکان. لطفاً دسترسی دستگاه را بررسی کنید.", "error");
      }
    );
  };

  const resetForm = () => {
    setTitle("");
    setTime("");
    setDays([]);
    setRepeatCount("");
    setAutoType("schedule");
    setDelayHours("");
    setDelayMinutes("");
    setCity("");
    setTemperatureThreshold("");
    setTemperatureCondition("greater");
    setIntervalMinutes("");
    setHasWeatherCondition(false);
    setActions([]);
    setEditingId(null);
  };

  const handleEdit = (auto: any) => {
    setEditingId(auto.id);
    setTitle(auto.title);
    setTime(auto.time || "");
    setDays(auto.days ? [...auto.days] : []);
    setRepeatCount(auto.repeatCount || "");
    setIntervalMinutes(auto.intervalMinutes || "");
    
    if (auto.city && auto.temperatureThreshold !== undefined) {
      setHasWeatherCondition(true);
      setCity(auto.city);
      setTemperatureThreshold(auto.temperatureThreshold);
      setTemperatureCondition(auto.temperatureCondition || "greater");
    } else {
      setHasWeatherCondition(false);
      setCity("");
      setTemperatureThreshold("");
    }

    if (auto.intervalMinutes) {
      setAutoType("weather");
    } else if (auto.repeatCount) {
      setAutoType("timer");
    } else {
      setAutoType("schedule");
    }
    
    setActions(auto.actions ? [...auto.actions] : []);
  };

  const handleSave = () => {
    let finalTime = time;
    let finalDays = [...days];
    let finalRepeatCount = typeof repeatCount === 'number' && repeatCount > 0 ? repeatCount : undefined;
    let finalConditionType: "time" | "weather" = "time";
    let finalCity = city;
    let finalTempThresh = typeof temperatureThreshold === 'number' ? temperatureThreshold : undefined;
    let finalTempCond = temperatureCondition;

    let finalIntervalMinutes = typeof intervalMinutes === 'number' && intervalMinutes > 0 ? intervalMinutes : undefined;

    if (autoType === "timer") {
      const dHours = Number(delayHours) || 0;
      const dMins = Number(delayMinutes) || 0;
      
      if (dHours === 0 && dMins === 0) {
        showToast("لطفاً زمان تاخیر را مشخص کنید.", "error");
        return;
      }
      
      const now = new Date();
      now.setHours(now.getHours() + dHours);
      now.setMinutes(now.getMinutes() + dMins);
      
      finalTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      finalDays = [now.getDay()]; 
      finalRepeatCount = 1;
    } else if (autoType === "weather") {
      if (!city || finalTempThresh === undefined || !finalIntervalMinutes) {
        showToast("لطفاً شهر، شرط دما و دوره بررسی را مشخص کنید.", "error");
        return;
      }
      finalConditionType = "weather";
      finalTime = ""; 
      finalDays = [];
    } else {
      if (!time || days.length === 0) {
        showToast("لطفاً زمان و روزهای هفته را مشخص کنید.", "error");
        return;
      }
    }

    if ((autoType === "timer" || autoType === "schedule") && hasWeatherCondition) {
      if (!city || finalTempThresh === undefined) {
        showToast("لطفاً شهر و شرط دما را مشخص کنید.", "error");
        return;
      }
      finalConditionType = "weather";
    } else if (autoType !== "weather") {
      finalConditionType = "time";
    }

    if (!title) {
      showToast("لطفاً عنوان را وارد کنید.", "error");
      return;
    }
    
    if (actions.length === 0) {
      showToast("حداقل یک عملیات مشخص کنید.", "error");
      return;
    }

    const newAuto = {
      id: editingId || `auto_${Date.now()}`,
      title,
      time: finalTime,
      days: finalDays,
      repeatCount: finalRepeatCount,
      intervalMinutes: finalIntervalMinutes,
      conditionType: finalConditionType,
      city: finalCity,
      temperatureThreshold: finalTempThresh,
      temperatureCondition: finalTempCond,
      actions,
      enabled: true,
    };

    if (editingId) {
      setAutomations(automations.map(a => a.id === editingId ? { ...newAuto, enabled: a.enabled } : a));
    } else {
      setAutomations([...automations, newAuto]);
    }
    resetForm();
    showToast("اتوماسیون با موفقیت ثبت شد.", "success");
  };

  const handleDelete = (id: string) => {
    setAutomations(automations.filter(a => a.id !== id));
    showToast("اتوماسیون حذف شد.", "success");
  };

  const handleToggle = (id: string, enabled: boolean) => {
    setAutomations(automations.map(a => a.id === id ? { ...a, enabled } : a));
  };

  return {
    // states
    editingId,
    title, setTitle,
    time, setTime,
    days, setDays,
    repeatCount, setRepeatCount,
    autoType, setAutoType,
    delayHours, setDelayHours,
    delayMinutes, setDelayMinutes,
    city, setCity,
    temperatureThreshold, setTemperatureThreshold,
    temperatureCondition, setTemperatureCondition,
    intervalMinutes, setIntervalMinutes,
    hasWeatherCondition, setHasWeatherCondition,
    isGettingLocation,
    actions, setActions,

    // actions
    handleGetLocation,
    resetForm,
    handleEdit,
    handleSave,
    handleDelete,
    handleToggle
  };
}
