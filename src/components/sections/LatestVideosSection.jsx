"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, Eye, Calendar, TrendingUp, Clock, Heart, ChevronDown, Video, ChevronRight } from "lucide-react";
import { getLatestVideos, getMoreVideos } from "@/lib/services/videoService";

// ── Skeleton Card ──────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
        <div className="aspect-video bg-slate-200 dark:bg-slate-700" />
        <div className="p-3 space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-4/5" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-3/5" />
          <div className="flex justify-between pt-1">
            <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4" />
            <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4" />
            <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Video Card ─────────────────────────────────────────────────
function VideoCard({ video }) {
  return (
    <Link href={`/video/${video.slug}`} className="group block">
      <div className="
        relative rounded-xl overflow-hidden
        bg-white dark:bg-slate-800/80
        border border-slate-200 dark:border-slate-600/70
        shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/60
        hover:-translate-y-1
        transition-all duration-300
      ">

        {/* ── Thumbnail ── */}
        <div className="relative aspect-video overflow-hidden bg-slate-800">

          {/* Image */}
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 text-3xl">
              🎬
            </div>
          )}

          {/* Dark scrim */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="
              w-10 h-10 sm:w-11 sm:h-11 rounded-full
              bg-white/20 group-hover:bg-red-600
              backdrop-blur-sm
              flex items-center justify-center
              scale-90 group-hover:scale-110
              shadow-lg
              transition-all duration-300
            ">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" fill="white" />
            </div>
          </div>

          {/* Duration badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide">
              {video.duration}
            </div>
          )}

          {/* Trending badge */}
          {video.isTrending && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-rose-500 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-md font-semibold">
              <TrendingUp className="w-2.5 h-2.5" />
              Trending
            </div>
          )}
        </div>

        {/* ── Category chip ── */}
        <div className="absolute left-2.5 -bottom-[calc(theme(spacing.3)+0.6rem)] sm:-bottom-[calc(theme(spacing.3)+0.7rem)]">
          <span className="inline-block px-2 py-0.5 bg-red-600 text-white text-[9px] sm:text-[10px] font-bold rounded-full shadow-md uppercase tracking-wide">
            {video.category || "Video"}
          </span>
        </div>

        {/* ── Content ── */}
        <div className="px-3 pt-5 pb-3">
          <h3 className="
            text-[11px] sm:text-xs md:text-[13px] font-bold leading-snug
            text-slate-800 dark:text-slate-100
            group-hover:text-red-600 dark:group-hover:text-red-400
            line-clamp-2 min-h-[32px] sm:min-h-[36px]
            transition-colors duration-200
          ">
            {video.title}
          </h3>

          {/* Stats */}
          <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Eye className="w-2.5 h-2.5 flex-shrink-0" />
              {video.formattedViews ?? video.views}
            </span>
            <span className="w-px h-3 bg-slate-200 dark:bg-slate-600" />
            <span className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
              {video.formattedDate}
            </span>
            <span className="w-px h-3 bg-slate-200 dark:bg-slate-600" />
            <span className="flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 flex-shrink-0" />
              {video.formattedLikes}
            </span>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-500 rounded-b-xl" />
      </div>
    </Link>
  );
}

// ── Main Section ───────────────────────────────────────────────
export default function LatestVideosSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVideos, setTotalVideos] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const result = await getLatestVideos(1, 20);
      if (result.success) {
        setVideos(result.videos);
        setTotalVideos(result.totalVideos || result.videos.length);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="latest-videos-section" className="pt-8 bg-ghee dark:bg-slate-900/60">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10">

        {/* ── Section Header ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-red-600 rounded-full" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Latest Videos
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-full">
              <Clock className="w-3 h-3 text-red-500" />
              <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold uppercase tracking-wide">
                Fresh Uploads
              </span>
            </span>
          </div>
        </div>

        {/* ── Video Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No videos available</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* ── View All Button - Centered at Bottom ── */}
            <div className="flex justify-center mx-10 my-8">
              <Link
                href="/latestVideos"
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-700/50 rounded-full shadow-sm hover:shadow-md hover:border-red-400 dark:hover:border-red-500 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View All Videos</span>
                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                  {totalVideos}
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                
                {/* Glow Effect */}
                <span className="absolute inset-0 rounded-full bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}