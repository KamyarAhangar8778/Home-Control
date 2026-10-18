import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0c10] text-[#c5a880] p-6 text-center select-none font-sans">
      <h1 className="text-4xl font-extrabold tracking-widest text-[#D4AF37] mb-4">۴۰۴</h1>
      <h2 className="text-lg font-bold mb-6">صفحه مورد نظر یافت نشد</h2>
      <Link
        href="/"
        className="px-6 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold rounded-sm"
      >
        بازگشت به پیشخوان پادشاهی
      </Link>
    </div>
  );
}
