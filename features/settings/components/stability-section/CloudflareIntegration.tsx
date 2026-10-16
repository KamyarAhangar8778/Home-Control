"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe, CloudLightning, Server } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import {
  getCloudflareWorkerUrl,
  setCloudflareWorkerUrl,
  isCloudflareEnabled,
} from "@/features/iot/services/cloudflareService";
import { saveConfigToCloudflare } from "@/features/iot/services/cloudflare/api";
import type { EspConfig } from "@/features/iot/services/esp32Config";

interface CloudflareIntegrationProps {
  isDark?: boolean;
}

export default function CloudflareIntegration({
  isDark: _isDark = true,
}: CloudflareIntegrationProps) {
  const [cfUrl, setCfUrl] = useState(() => getCloudflareWorkerUrl());
  const {
    segments,
    groupsOrder,
    groupConfigs,
    groupsCols,
    showToast,
    manualSaveMode,
    setManualSaveMode,
  } = useIoTStore();
  const [isSavingUrl, setIsSavingUrl] = useState(false);

  const handleCfUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCfUrl(e.target.value);
  };

  const handleSaveUrl = async () => {
    if (!cfUrl || cfUrl.includes("YOUR_SUBDOMAIN") || cfUrl.length < 10) {
      showToast("لطفاً یک آدرس معتبر وارد کنید.", "error");
      return;
    }

    setIsSavingUrl(true);
    setCloudflareWorkerUrl(cfUrl);

    if (!isCloudflareEnabled()) {
      setIsSavingUrl(false);
      return;
    }

    // ساخت یک config حداقل برای ذخیره URL
    const currentConfig: EspConfig = {
      version: "1.2.0-Achaemenid",
      device: {
        name: "سامانه مرزی پاسارگاد",
        chip: "ESP32-S3-WROOM-1",
        firmware: "v3.4.1-Achaemenid-OS",
        reboot_count: 0,
        last_boot: new Date().toISOString(),
      },
      preferences: {
        theme_mode: "dark",
        accent_color_3: "#D4AF37",
        accent_color_4: "#10B981",
        font_family: "vazir",
        animations_enabled: true,
        header_animation: "fade",
        header_title: "سامانه هوشمند پادشاهی هخامنش",
        matrix_density: 40,
        matrix_size: 4,
        matrix_hover_size: 3,
        matrix_color: "#D4AF37",
        matrix_moving: true,
        matrix_mouse_effect: true,
        manual_save_mode: manualSaveMode,
      },
      layout: {
        groups_order: groupsOrder,
        groups_cols: groupsCols,
        group_configs: groupConfigs,
      },
      segments: segments,
      worker_url: cfUrl,
    };

    const result = await saveConfigToCloudflare(currentConfig);
    setIsSavingUrl(false);
    if (result.success) {
      showToast("آدرس ورکر جدید با موفقیت ذخیره شد.", "success");
    } else {
      showToast("خطا در ذخیره آدرس ورکر جدید.", "error");
    }
  };

  const isCfConnected = isCloudflareEnabled();

  return (
    <div className="pt-2 space-y-4 text-right">
      <div className="flex items-center justify-between">
        <span className="text-[10px] theme-text-tertiary">
          Cloudflare Workers KV & Durable Objects
        </span>
        <span className="font-bold text-[11px] text-accent3">اتصال هوشمند کلودفلر</span>
      </div>

      <p className="text-[10px] theme-text-tertiary leading-relaxed">
        برای ذخیره‌سازی ابری و دائم ساختار چیدمان (Cloudflare KV) و نظارت بر شیرها و سوییچ‌ها (Durable
        Objects)، آدرس ورکر خود را وارد کنید:
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleSaveUrl}
          disabled={isSavingUrl}
          className="px-4 py-2.5 bg-accent3/20 text-accent3 hover:bg-accent3 hover:text-black border border-accent3/30 rounded-xl text-[10px] font-bold transition-all disabled:opacity-50"
        >
          {isSavingUrl ? "در حال ذخیره..." : "ذخیره آدرس"}
        </button>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Globe className="h-4 w-4 text-accent3 opacity-70" />
          </div>
          <input
            type="text"
            dir="ltr"
            value={cfUrl}
            onChange={handleCfUrlChange}
            placeholder="https://api.agkalaa.ir"
            className="block w-full py-2.5 pr-10 pl-3 border border-accent3-medium/30 rounded-xl bg-black/40 text-[11px] text-white placeholder-gray-600 focus:outline-none focus:border-accent3 font-mono transition-all"
          />
        </div>
      </div>

      <div className="p-3 mt-4 rounded-xl border border-slate-800 bg-black/30 flex items-center justify-between">
        <label className="flex items-center cursor-pointer gap-3 w-full">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={manualSaveMode}
              onChange={(e) => setManualSaveMode(e.target.checked)}
            />
            <div
              className={`block w-10 h-6 rounded-full transition-colors ${manualSaveMode ? "bg-accent3" : "bg-slate-800"}`}
            ></div>
            <div
              className={`dot absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${manualSaveMode ? "transform translate-x-4" : ""}`}
            ></div>
          </div>
          <div className="flex flex-col flex-1 text-right">
            <span className="text-[11px] font-bold text-white">
              جلوگیری از ذخیره خودکار تغییرات داشبورد
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5">
              در صورت فعال بودن، تغییرات داشبورد به صورت خودکار ذخیره نمی‌شوند و یک دکمه ذخیره دستی
              به شما نمایش داده می‌شود.
            </span>
          </div>
        </label>
      </div>

      {/* Status Indicator Bar */}
      <div
        className={`p-3 rounded-xl border flex items-center justify-between text-right text-[10px] ${
          isCfConnected
            ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400"
            : "bg-slate-950/40 border-slate-800 text-slate-400"
        }`}
      >
        <div className="flex items-center gap-1.5 justify-end w-full">
          <span className="font-bold">
            {isCfConnected
              ? "سیستم روی حالت ذخیره‌سازی کلودفلر (ابر زنده) تنظیم شده است."
              : "پخش آفلاین / حافظه محلی فعال است (ورکر تنظیم نشده است)."}
          </span>
          {isCfConnected ? (
            <CloudLightning className="w-3.5 h-3.5 text-emerald-400 animate-pulse animate-[pulse_2s_infinite]" />
          ) : (
            <Server className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </div>
    </div>
  );
}
