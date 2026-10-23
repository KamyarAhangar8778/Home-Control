import React from "react";
import { Info } from "lucide-react";
import { Alert } from "@/components/reui/alert";

interface ConnectionNoteProps {
  accent3: string;
}

export default function ConnectionNote({ accent3 }: ConnectionNoteProps) {
  return (
    <Alert className="!mt-6 !grid-cols-1 !flex !items-start !gap-2 !rounded-xl !border-[var(--accent3-medium)] !bg-[var(--accent3-transparent)] !p-3 text-[10px] theme-text-tertiary leading-relaxed text-right">
      <Info className="w-4 h-4 text-accent3 shrink-0 mt-0.5" style={{ color: accent3 }} />
      <span>
        با افزودن سگمنت، کدهای لازم برای پردازش پایه مورد نظر در فایل خروجی دانشنامه و کدهای ESP32
        نیز ادغام می‌شوند تا ارتباط فیزیکی بی‌نقص برقرار بگردد.
      </span>
    </Alert>
  );
}
