"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ShortsNavigation({ onPrev, onNext, hasPrev, hasNext, isDark }) {
  return (
    <>
      {/* Left Navigation Arrow */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className={`
            absolute left-2 top-1/2 -translate-y-1/2 z-10
            w-10 h-10 rounded-full
            flex items-center justify-center
            transition-all duration-300
            ${isDark 
              ? "bg-gray-800/80 hover:bg-gray-700 text-white" 
              : "bg-white/80 hover:bg-white text-gray-900"}
            shadow-lg backdrop-blur-sm
            hover:scale-110
          `}
          aria-label="Previous video"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Right Navigation Arrow */}
      {hasNext && (
        <button
          onClick={onNext}
          className={`
            absolute right-2 top-1/2 -translate-y-1/2 z-10
            w-10 h-10 rounded-full
            flex items-center justify-center
            transition-all duration-300
            ${isDark 
              ? "bg-gray-800/80 hover:bg-gray-700 text-white" 
              : "bg-white/80 hover:bg-white text-gray-900"}
            shadow-lg backdrop-blur-sm
            hover:scale-110
          `}
          aria-label="Next video"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </>
  );
}