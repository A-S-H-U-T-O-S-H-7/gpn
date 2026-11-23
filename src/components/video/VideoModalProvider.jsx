"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Eye, Heart, Clock, SkipBack, SkipForward, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getVideoBySlug, getYouTubeId, incrementVideoView } from "@/lib/services/videoService";

const VideoModalContext = createContext(null);

export const useVideoModal = () => useContext(VideoModalContext);

const LIKED_KEY = "gpn_liked_videos";

const readLiked = () => {
  try {
    return JSON.parse(localStorage.getItem(LIKED_KEY) || "[]");
  } catch {
    return [];
  }
};

const formatNumber = (num) => {
  const n = Number(num) || 0;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
};

// Resolve the YouTube id from whatever shape the card's data has
const resolveYouTubeId = (video) =>
  video?.videoId || getYouTubeId(video?.youtubeUrl) || null;

export default function VideoModalProvider({ children }) {
  // `video` is the card data (shown instantly), `details` is the full doc fetched by slug
  const [video, setVideo] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const isOpen = !!video;

  const openVideo = useCallback((videoData, list = []) => {
    if (!videoData?.slug && !resolveYouTubeId(videoData)) return false;
    setVideo(videoData);
    setPlaylist(Array.isArray(list) ? list.filter((v) => v?.slug) : []);
    return true;
  }, []);

  const closeVideo = useCallback(() => {
    setVideo(null);
    setDetails(null);
    setError(false);
  }, []);

  // Fetch full video data (videoId, description, stats) + count the view
  useEffect(() => {
    if (!video) return;
    let cancelled = false;

    const load = async () => {
      setDetails(null);
      setError(false);

      let full = video;
      if (video.slug) {
        setLoading(true);
        try {
          const result = await getVideoBySlug(video.slug);
          if (cancelled) return;
          if (result.success && result.video) {
            full = { ...video, ...result.video };
          } else if (!resolveYouTubeId(video)) {
            setError(true);
          }
        } catch (err) {
          console.error("Error loading video:", err);
          if (!cancelled && !resolveYouTubeId(video)) setError(true);
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
      if (cancelled) return;

      setDetails(full);
      setLikeCount(Number(full.likes) || 0);
      setIsLiked(full.id ? readLiked().includes(full.id) : false);

      // Same once-per-session view counting as the /video/[slug] page
      if (full.id) {
        const key = `video_viewed_${full.id}`;
        try {
          if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, "true");
            await incrementVideoView(full.id);
            if (!cancelled) {
              setDetails((prev) => (prev ? { ...prev, views: (Number(prev.views) || 0) + 1 } : prev));
            }
          }
        } catch (err) {
          console.error("Error incrementing view:", err);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [video]);

  // ESC to close + lock page scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeVideo();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeVideo]);

  const step = (dir) => {
    if (!video || playlist.length < 2) return;
    const idx = playlist.findIndex((v) => v.slug === video.slug);
    const next = playlist[(idx + dir + playlist.length) % playlist.length];
    setVideo(next);
  };

  const toggleLike = () => {
    const current = details || video;
    if (!current?.id) return;
    const liked = readLiked();
    const next = isLiked ? liked.filter((id) => id !== current.id) : [...liked, current.id];
    localStorage.setItem(LIKED_KEY, JSON.stringify(next));
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
    if (!isLiked) toast.success("Added to liked videos");
  };

  const shown = details || video;
  const youTubeId = details ? resolveYouTubeId(details) : null;
  const hasPlaylist = playlist.length > 1;

  return (
    <VideoModalContext.Provider value={{ openVideo, closeVideo }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="video-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md"
              onClick={closeVideo}
            />

            <div
              key="video-modal-container"
              className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4 pointer-events-none"
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={shown?.title || "Video player"}
                initial={{ opacity: 0, scale: 0.93, y: 28 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 28 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close */}
                <button
                  onClick={closeVideo}
                  aria-label="Close video"
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Player */}
                <div className="relative w-full aspect-video bg-black">
                  {youTubeId ? (
                    <iframe
                      key={youTubeId}
                      src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                      title={shown?.title || "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <>
                      {shown?.thumbnail && (
                        <img
                          src={shown.thumbnail}
                          alt={shown.title || ""}
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        {loading || !details ? (
                          error ? null : <Loader2 className="w-10 h-10 animate-spin" />
                        ) : null}
                        {(error || (details && !youTubeId)) && (
                          <p className="px-4 text-center text-sm font-medium bg-black/60 rounded-lg py-2">
                            This video is not available right now.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="px-4 py-4 sm:px-6 sm:py-5">
                  {shown?.category && (
                    <span className="inline-block px-2 py-0.5 mb-2 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                      {shown.category}
                    </span>
                  )}
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug pr-8">
                    {shown?.title}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {formatNumber(shown?.views)} views
                    </span>
                    {shown?.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {shown.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      {formatNumber(likeCount)} likes
                    </span>
                  </div>

                  {/* Controls */}
                  <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      {hasPlaylist && (
                        <>
                          <button
                            onClick={() => step(-1)}
                            title="Previous"
                            aria-label="Previous video"
                            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <SkipBack className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => step(1)}
                            title="Next"
                            aria-label="Next video"
                            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <SkipForward className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={toggleLike}
                      disabled={!details?.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all text-sm font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "text-red-600 fill-red-600" : ""}`} />
                      {isLiked ? "Liked" : "Like"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </VideoModalContext.Provider>
  );
}
