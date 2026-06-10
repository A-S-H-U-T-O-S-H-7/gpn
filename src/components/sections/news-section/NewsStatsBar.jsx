"use client";

import { Newspaper, Eye } from "lucide-react";

export default function NewsStatsBar({ totalNews, news }) {
  const totalViews = news.reduce((acc, item) => acc + (item.views || 0), 0);

  return (
    <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400 dark:text-slate-500">
      <div className="flex items-center gap-1.5">
        <Newspaper className="w-3.5 h-3.5" />
        <span>{totalNews} articles</span>
      </div>
      <div className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
      <div className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5" />
        <span>Total views: {totalViews.toLocaleString()}</span>
      </div>
    </div>
  );
}