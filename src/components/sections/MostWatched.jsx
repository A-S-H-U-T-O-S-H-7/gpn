"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, TrendingUp, Play } from "lucide-react";
import { getMostWatched } from "@/lib/services/homepageService";

function formatViews(views) {
  if (!views) return "0";
  if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
  if (views >= 1000) return (views / 1000).toFixed(1) + "K";
  return views.toString();
}

export default function MostWatched() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostWatched = async () => {
      const result = await getMostWatched(5);
      if (result.success) setItems(result.data);
      setLoading(false);
    };
    fetchMostWatched();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-1 h-6 bg-red-500 rounded-full flex-shrink-0" />
          <span
            className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
            style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}
          >
            Most Watched
          </span>
          <TrendingUp className="w-4 h-4 text-red-500" />
        </div>
        {/* Skeleton rows */}
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 animate-pulse">
              <div className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
              <div className="w-16 h-14 md:w-20 md:h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-1 h-6 bg-red-500 rounded-full flex-shrink-0" />
          <span
            className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
            style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}
          >
            Most Watched
          </span>
          <TrendingUp className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          No watched content available
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-1 h-6 bg-red-500 rounded-full flex-shrink-0" />
        <span
          className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
          style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}
        >
          Most Watched
        </span>
        <TrendingUp className="w-4 h-4 text-red-500" />
      </div>

      {/* List */}
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.type === "video" ? `/video/${item.slug}` : `/news/${item.slug}`}
            className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-red-50/30 dark:hover:bg-red-950/10 -mx-3 px-3 rounded-xl transition-colors duration-200"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 text-center">
              <span
                className="text-lg font-black leading-none"
                style={{
                  color: item.rank <= 3 ? "#ef4444" : "#d1d5db",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {item.rank.toString().padStart(2, "0")}
              </span>
            </div>

            {/* Thumbnail */}
            <div className="flex-shrink-0 w-16 h-14 md:w-20 md:h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-600 text-xs">Img</span>
                </div>
              )}
              {item.type === "video" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 text-white" />
                </div>
              )}
              {item.type === "video" && item.duration && (
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                  {item.duration}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-1.5 flex-wrap">
                <h3 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors leading-snug">
                  {item.title}
                </h3>
                {item.type === "video" && (
                  <span className="text-[9px] text-red-500 font-medium border border-red-200 dark:border-red-800 px-1 py-0.5 rounded flex-shrink-0 mt-0.5">
                    VIDEO
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatViews(item.views)}</span>
                </div>
                <span>·</span>
                <span>{item.timeAgo}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}