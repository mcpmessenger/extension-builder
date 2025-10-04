import React from "react";

export function CircleSticker({ className }: { className?: string }) {
  return (
    <div className={`w-8 h-8 border-2 border-blue-500 rounded-full bg-blue-500/20 ${className || ""}`}>
      <div className="w-full h-full rounded-full border-2 border-blue-400"></div>
    </div>
  );
}

export function ArrowSticker({ className }: { className?: string }) {
  return (
    <div className={`w-8 h-8 flex items-center justify-center ${className || ""}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red-500">
        <path
          d="M5 12H19M19 12L12 5M19 12L12 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function ClickHereSticker({ className }: { className?: string }) {
  return (
    <div className={`bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium ${className || ""}`}>
      Click
    </div>
  );
}

