import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0c10] text-[#c5a880] select-none font-sans">
      {/* Background Cuneiform Glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/5 to-transparent pointer-events-none" />

      {/* Persian Arch themed Loading Container */}
      <div className="relative p-8 flex flex-col items-center justify-center max-w-sm w-full text-center">
        {/* Glowing Geometric Spinner representing Cyrus Sun / Mithra */}
        <div className="relative w-16 h-16 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent animate-spin" />
          {/* Inner royal gold diamond */}
          <div className="w-5 h-5 bg-amber-500 rotate-45 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
        </div>

        {/* Loading text with ancient title */}
        <h3 className="text-sm font-sans font-black tracking-widest text-[#c5a880] uppercase">
          سامانه هوشمند هخامنشی
        </h3>

        <p className="text-[10px] text-gray-500 font-mono tracking-wider mt-2 animate-pulse uppercase">
          Achaemenid IoT System Connecting...
        </p>

        {/* Stylized step indicators */}
        <div className="flex gap-1 mt-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
        </div>
      </div>
    </div>
  );
}
