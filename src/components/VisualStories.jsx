"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play, Eye, Calendar, Flame } from "lucide-react";
import { getLatestShorts, getShortsCount } from "@/lib/services/videoService";
import ShortsModal from "@/components/sections/shorts/ShortsModal";

const PAGE_SIZE = 24;

function SkeletonStory() {
  return <div className="animate-pulse aspect-[9/16] rounded-xl bg-slate-200 dark:bg-slate-700" />;
}

function StoryCard({ short, onClick }) {
  const thumb =
    short.thumbnail || (short.videoId ? `https://img.youtube.com/vi/${short.videoId}/hqdefault.jpg` : null);

  return (
    <button
      type="button"
      onClick={() => onClick(short)}
      className="group relative block w-full aspect-[9/16] rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer bg-slate-800"
    >
      {thumb ? (
        <img
          src={thumb}
          alt={short.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
        </div>
      </div>

      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
        {short.videoType === "reel" ? "Reel" : "Short"}
      </span>
      {short.duration && (
        <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-semibold rounded-md">
          {short.duration}
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white text-xs sm:text-sm font-bold leading-snug line-clamp-3 mb-1.5">{short.title}</h3>
        <div className="flex items-center gap-3 text-white/70 text-[10px]">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {short.formattedViews ?? short.views ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {short.formattedDate || "Recent"}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function VisualStories() {
  const router = useRouter();
  const [shorts, setShorts] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [selected, setSelected] = useState(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [result, count] = await Promise.all([getLatestShorts(PAGE_SIZE), getShortsCount()]);
      if (result.success) {
        setShorts(result.shorts);
        setHasMore(result.hasMore);
        setLastDoc(result.lastVisible);
      }
      setTotal(count);
      setLoading(false);
    };
    load();
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore || !lastDoc) return;
    setLoadingMore(true);
    try {
      const result = await getLatestShorts(PAGE_SIZE, lastDoc);
      if (result.success && result.shorts.length > 0) {
        setShorts((prev) => {
          const seen = new Set(prev.map((s) => s.id));
          return [...prev, ...result.shorts.filter((s) => !seen.has(s.id))];
        });
        setHasMore(result.hasMore);
        setLastDoc(result.lastVisible);
      } else {
        setHasMore(false);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: "400px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, lastDoc]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex cursor-pointer border rounded-md px-2 py-1 border-red-500 items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              Visual Stories
              <Flame className="w-6 h-6 text-red-600" />
            </h1>
            {total != null && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full border border-red-200 dark:border-red-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {total} stories
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">News beyond headlines — short videos from Great Post News</p>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-red-500 via-red-400/50 to-transparent" />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(12)].map((_, i) => <SkeletonStory key={i} />)}
          </div>
        ) : shorts.length === 0 ? (
          <p className="text-center py-16 text-gray-500 dark:text-gray-400 text-lg">No stories yet</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {shorts.map((short) => (
                <StoryCard key={short.id} short={short} onClick={setSelected} />
              ))}
            </div>

            {hasMore && (
              <div ref={loaderRef} className="flex justify-center py-10">
                {loadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Loading more...</span>
                  </div>
                ) : (
                  <button
                    onClick={loadMore}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    Load More Stories
                  </button>
                )}
              </div>
            )}

            {!hasMore && (
              <p className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">You&apos;ve seen all the stories</p>
            )}
          </>
        )}
      </div>

      {selected && (
        <ShortsModal
          short={selected}
          allShorts={shorts}
          onClose={() => setSelected(null)}
          onNavigate={setSelected}
          isDark={false}
        />
      )}
    </div>
  );
}
