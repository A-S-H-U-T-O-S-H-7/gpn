"use client";

import { Clock } from "lucide-react";

export default function NewsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        {/* Accent bar */}
        <div className="w-1 h-8 bg-blue-600 rounded-full" />
        
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
           News Articles
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay updated with the latest happenings
          </p>
        </div>

        {/* Fresh badge */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-full">
          <Clock className="w-3 h-3 text-blue-500" />
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">
            Fresh Updates
          </span>
        </span>
      </div>
    </div>
  );
}