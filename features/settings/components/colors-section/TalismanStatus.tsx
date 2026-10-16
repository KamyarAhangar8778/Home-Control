import React from "react";
import { Sparkles } from "lucide-react";

interface TalismanStatusProps {
  accent3: string;
  accent4: string;
}

export default function TalismanStatus({ accent3, accent4 }: TalismanStatusProps) {
  return (
    <div className="theme-card-bg-solid border border-accent4-medium/40 p-3 text-center space-y-1.5 rounded-2xl">
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-accent4">
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        <span className="font-bold">مجموعه رنگ‌های کدهای سخت‌افزاری پایدار است</span>
      </div>
      <div className="flex justify-center gap-2 text-[9px] font-mono theme-text-tertiary">
        <span>A3: {accent3}</span>
        <span className="text-gray-600">|</span>
        <span>A4: {accent4}</span>
      </div>
    </div>
  );
}
