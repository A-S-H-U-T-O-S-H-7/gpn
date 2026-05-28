"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Award, Play } from "lucide-react";
import { getEditorsPicks } from "@/lib/services/homepageService";

export default function EditorsPicks() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPicks = async () => {
      const result = await getEditorsPicks(3);
      if (result.success) {
        setPicks(result.data);
      }
      setLoading(false);
    };
    fetchPicks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-1 h-6 bg-red-500 rounded-full flex-shrink-0" />
          <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-red-50 text-red-500 dark:bg-red-950/30">
            Editor's Picks
          </span>
          <Award className="w-4 h-4 text-red-500" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-24 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (picks.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-1 h-6 bg-red-500 rounded-full flex-shrink-0" />
          <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-red-50 text-red-500 dark:bg-red-950/30">
            Editor's Picks
          </span>
          <Award className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          No editor's picks available
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
          Editor's Picks
        </span>
        <Award className="w-4 h-4 text-red-500" />
      </div>

      {/* List */}
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
        {picks.map((pick, idx) => (
          <Link
            key={pick.id}
            href={pick.type === 'news' ? `/news/${pick.slug}` : `/video/${pick.slug}`}
            className="group flex gap-3 py-3.5 first:pt-0 last:pb-0 hover:bg-red-50/30 dark:hover:bg-red-950/10 -mx-3 px-3 rounded-xl transition-colors duration-200"
          >
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-24 h-20 md:w-28 md:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative">
              <div
                className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold z-10"
                style={{ background: "#ef4444" }}
              >
                {idx + 1}
              </div>
              {pick.image ? (
                <img src={pick.image} alt={pick.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-600 text-xs">Image</span>
                </div>
              )}
              {pick.type === 'video' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white" />
                </div>
              )}
              {pick.type === 'video' && pick.duration && (
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                  {pick.duration}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <span
                    className="inline-block text-xs font-semibold px-2 py-0.5 rounded"
                    style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}
                  >
                    {pick.category}
                  </span>
                  {pick.type === 'video' && (
                    <span className="text-[10px] text-red-500 font-medium border border-red-200 dark:border-red-800 px-1.5 py-0.5 rounded">
                      VIDEO
                    </span>
                  )}
                </div>
                <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors leading-snug">
                  {pick.title}
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1 hidden sm:block">
                {pick.description}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{pick.timeAgo}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}