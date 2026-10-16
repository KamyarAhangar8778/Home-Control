import React from "react";
import { CheckCircle2 } from "lucide-react";

export function SettingsFooter() {
  return (
    <div className="border-t border-accent3-medium/20 pt-4 mt-8 text-right space-y-2">
      <div className="flex items-center gap-1.5 justify-end text-[10px] text-accent3">
        <span className="font-bold">امنیت بومی و پایداری شبکه برقرار است</span>
        <CheckCircle2 className="w-3.5 h-3.5 text-accent4" style={{ color: "var(--accent4)" }} />
      </div>
      <p className="text-[9px] theme-text-muted font-sans">
        برای بازگشت به نمای اصلی، بر روی فضای خارج از منو ضربه بزنید یا کلید ضربدر بالا را کلیک
        کنید.
      </p>
    </div>
  );
}
