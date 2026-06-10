"use client";

import { Newspaper } from "lucide-react";

export default function EmptyNewsState() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
        <Newspaper className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
        No news articles found
      </h3>
      <p className="text-sm text-slate-400">
        Check back later for updates
      </p>
    </div>
  );
}