import React from "react";
import { Clock } from "lucide-react";

export default function RealTimeClock({ time, className }: { time: Date | null; className?: string }) {
  if (!time) {
    return <Clock className={className} />;
  }

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourRotation = (hours % 12) * 30 + minutes * 0.5;
  const minuteRotation = minutes * 6 + seconds * 0.1;

  return (
    <svg
      xmlns="http://www.w3.org/00/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="7"
        style={{
          transform: `rotate(${hourRotation}deg)`,
          transformOrigin: "12px 12px",
          transition: "transform 0.2s linear",
        }}
      />
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="4"
        style={{
          transform: `rotate(${minuteRotation}deg)`,
          transformOrigin: "12px 12px",
          transition: "transform 0.2s linear",
        }}
      />
    </svg>
  );
}
