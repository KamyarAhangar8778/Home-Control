"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";

export default function TrashDropZone({ activeId }: { activeId: string | null }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "trash-dropzone",
  });

  if (!activeId) return null;

  return (
    <div
      ref={setNodeRef}
      className={`mt-12 p-6 w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[120px] text-center border-2 border-dashed transition-all duration-300 z-10 rounded-xl backdrop-blur-md ${
        isOver
          ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)] scale-105"
          : "bg-[var(--card-bg)]/80 border-[var(--accent3-medium)] text-[var(--accent3)]"
      }`}
    >
      <Trash2 className={`w-8 h-8 mx-auto mb-2 ${isOver ? "animate-bounce" : ""}`} />
      <span className="text-sm font-bold font-sans">برای حذف اینجا رها کنید</span>
    </div>
  );
}
