"use client";

import { Newspaper, AlertCircle, Flame, Award } from "lucide-react";

export default function NewsFilters({ activeFilter, onFilterChange }) {
  const filters = [
    { id: "all", label: "All News", icon: <Newspaper className="w-3.5 h-3.5" /> },
    { id: "breaking", label: "Breaking", icon: <AlertCircle className="w-3.5 h-3.5" /> },
    { id: "trending", label: "Trending", icon: <Flame className="w-3.5 h-3.5" /> },
    { id: "editor", label: "Editor's Pick", icon: <Award className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            inline-flex items-center gap-1.5
            px-3 py-1.5 rounded-full text-xs font-semibold
            transition-all duration-200
            ${activeFilter === filter.id 
              ? "bg-blue-600 text-white shadow-md" 
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600"
            }
          `}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  );
}