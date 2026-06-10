"use client";

import { ExternalLink } from "lucide-react";
import NewsBadge from "./NewsBadge";

export default function NewsThumbnail({ news }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
      {news.image ? (
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-4xl">
          📰
        </div>
      )}

      {/* Dark scrim on hover */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Read more overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="
          px-4 py-2 rounded-full
          bg-white/90 dark:bg-slate-900/90
          text-slate-900 dark:text-white
          text-xs font-semibold
          flex items-center gap-2
          shadow-lg backdrop-blur-sm
        ">
          Read Article
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>

      {/* Badge */}
      <NewsBadge news={news} />

      {/* Category chip (fallback) */}
      {!news.isBreaking && !news.isTrending && !news.isEditorPick && news.category && (
        <div className="absolute top-3 left-3">
          <span className="
            px-2 py-1 rounded-md
            bg-black/60 backdrop-blur-sm
            text-white text-[10px] font-semibold
            uppercase tracking-wide
          ">
            {news.category}
          </span>
        </div>
      )}
    </div>
  );
}