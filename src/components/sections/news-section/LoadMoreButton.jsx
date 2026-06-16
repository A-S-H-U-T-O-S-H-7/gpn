"use client";

import { ChevronDown } from "lucide-react";

export default function SeeMoreButton({ onClick, loading }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-6 py-2.5">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        <span className="text-sm text-slate-500">Loading more articles...</span>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="
        group inline-flex items-center gap-2
        px-6 py-2.5 rounded-full text-sm font-semibold
        bg-white dark:bg-slate-800
        border-2 border-blue-500 dark:border-blue-600
        text-blue-600 dark:text-blue-400
        hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white
        shadow-md hover:shadow-lg
        transition-all duration-300
      "
    >
      See More Articles
      <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
    </button>
  );
}