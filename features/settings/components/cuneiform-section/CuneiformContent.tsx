import React from "react";
import OpacityControl from "./OpacityControl";
import ColorPicker from "./ColorPicker";
import { CuneiformSectionProps } from "./types";

type CuneiformContentProps = Pick<
  CuneiformSectionProps,
  "cuneiformOpacity" | "setCuneiformOpacity" | "cuneiformColor" | "setCuneiformColor"
>;

export default function CuneiformContent({
  cuneiformOpacity,
  setCuneiformOpacity,
  cuneiformColor,
  setCuneiformColor,
}: CuneiformContentProps) {
  return (
    <div className="space-y-4 text-right font-sans">
      <p className="text-[10px] theme-text-tertiary leading-relaxed">
        با استفاده از ابزارهای زیر می‌توانید میزان پدیداری و هویت رنگ کتیبه سنگی خط میخی هخامنشی
        متحرک در پس‌زمینه را سفارشی‌سازی کنید:
      </p>

      <OpacityControl
        cuneiformOpacity={cuneiformOpacity}
        setCuneiformOpacity={setCuneiformOpacity}
      />

      <ColorPicker cuneiformColor={cuneiformColor} setCuneiformColor={setCuneiformColor} />
    </div>
  );
}
