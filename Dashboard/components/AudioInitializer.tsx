"use client";

import { useEffect } from "react";
import { soundManager } from "@/lib/audio";

export default function AudioInitializer() {
  useEffect(() => {
    // soundManager is initialized and its global event listener is registered
    // by the module import in lib/audio.ts, but we import it here 
    // to ensure it executes in the client bundle.
  }, []);

  return null;
}
