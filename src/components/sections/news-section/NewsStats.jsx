"use client";

import { Eye, Calendar, Clock } from "lucide-react";

export default function NewsStats({ news }) {
  return (
    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {news.formattedViews !== undefined ? news.formattedViews : (news.views || 0)}
        </span>
        <span className="w-px h-3 bg-slate-200 dark:bg-slate-600" />
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {news.formattedDate || "Recent"}
        </span>
        <span className="w-px h-3 bg-slate-200 dark:bg-slate-600" />
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {news.readTime || "3 min read"}
        </span>
      </div>
    </div>
  );
}