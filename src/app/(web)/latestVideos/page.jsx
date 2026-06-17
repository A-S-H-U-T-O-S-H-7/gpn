"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play, Eye, Calendar, TrendingUp, Heart } from "lucide-react";
import { getLatestVideos, getMoreVideos } from "@/lib/services/videoService";

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60">
        <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
        <div className="p-3 space-y-2">
          <div className="h-3 rounded-full w-4/5 bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 rounded-full w-3/5 bg-gray-200 dark:bg-gray-700" />
          <div className="flex justify-between pt-1">
            <div className="h-2.5 rounded-full w-1/4 bg-gray-200 dark:bg-gray-700" />
            <div className="h-2.5 rounded-full w-1/4 bg-gray-200 dark:bg-gray-700" />
            <div className="h-2.5 rounded-full w-1/4 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  return (
    <Link href={`/video/${video.slug}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600/70 shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/60 hover:-translate-y-1 transition-all duration-300">
        <div className="relative aspect-video overflow-hidden bg-gray-800">
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
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 group-hover:bg-red-600 backdrop-blur-sm flex items-center justify-center scale-90 group-hover:scale-110 shadow-lg transition-all duration-300">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide">
              {video.duration}
            </div>
          )}
          {video.isTrending && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-rose-500 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-md font-semibold">
              <TrendingUp className="w-2.5 h-2.5" /> Trending
            </div>
          )}
        </div>

        <div className="absolute left-2.5 -bottom-[calc(theme(spacing.3)+0.6rem)] sm:-bottom-[calc(theme(spacing.3)+0.7rem)]">
          <span className="inline-block px-2 py-0.5 bg-red-600 text-white text-[9px] sm:text-[10px] font-bold rounded-full shadow-md uppercase tracking-wide">
            {video.category || "Video"}
          </span>
        </div>

        <div className="px-3 pt-5 pb-3">
          <h3 className="text-[11px] sm:text-xs md:text-[13px] font-bold leading-snug text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 min-h-[32px] sm:min-h-[36px] transition-colors duration-200">
            {video.title}
          </h3>
          <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="w-2.5 h-2.5 flex-shrink-0" />
              {video.formattedViews ?? video.views}
            </span>
            <span className="w-px h-3 bg-gray-200 dark:bg-gray-600" />
            <span className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
              {video.formattedDate}
            </span>
            <span className="w-px h-3 bg-gray-200 dark:bg-gray-600" />
            <span className="flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 flex-shrink-0" />
              {video.formattedLikes}
            </span>
          </div>
        </div>

        <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-500 rounded-b-xl" />
      </div>
    </Link>
  );
}

export default function VideosPage() {
  const router = useRouter();
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalVideos, setTotalVideos] = useState(0);
  const loaderRef = useRef(null);

  const fetchInitialVideos = async () => {
    setLoading(true);
    try {
      const result = await getLatestVideos(1, 24);
      if (result.success) {
        setVideos(result.videos);
        setHasMore(result.hasMore);
        setTotalVideos(result.totalVideos || result.videos.length);
        if (result.lastVisible) setLastDoc(result.lastVisible);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const result = await getMoreVideos(lastDoc, 12);
      if (result.success && result.videos.length > 0) {
        setVideos(prev => [...prev, ...result.videos]);
        setLastDoc(result.lastVisible);
        setHasMore(result.hasMore);
        setTotalVideos(prev => prev + result.videos.length);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more videos:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreVideos();
        }
      },
      { threshold: 0.1, rootMargin: "120px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, lastDoc]);

  useEffect(() => {
    fetchInitialVideos();
  }, []);

  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Header - Following CategoryPage pattern */}
        {/* Header - Clean & Modern */}
<div className="mb-10">
  {/* Back Button */}
  <button
    onClick={() => router.back()}
    className="inline-flex cursor-pointer border rounded-md px-2 py-1 border-blue-500 items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 mb-5"
  >
    <ArrowLeft className="w-4 h-4" />
    <span>Back</span>
  </button>

  {/* Title Section */}
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          All Videos
        </h1>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700/50">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
          {totalVideos} videos
        </span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
        Discover the latest news and stories from around the world
      </p>
    </div>
    
   
  </div>

  {/* Decorative Divider */}
  <div className="mt-4 h-px w-24 bg-gradient-to-r from-blue-500 via-blue-400/50 to-transparent" />
</div>

        {/* Video Grid */}
        {loading && videos.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No videos found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Load More - Following CategoryPage pattern */}
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center items-center py-10 mt-4">
                {loadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Loading more...</span>
                  </div>
                ) : (
                  <button
                    onClick={loadMoreVideos}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Load More Videos
                  </button>
                )}
              </div>
            )}

            {/* End of library */}
            {!hasMore && videos.length > 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400 dark:text-gray-500">You've reached the end of our video library</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}