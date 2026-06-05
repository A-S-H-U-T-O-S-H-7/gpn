"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Play, Eye, Clock, ChevronLeft, ChevronRight, TrendingUp, Flame, Radio } from "lucide-react";
import { getHeroItems } from "@/lib/services/heroService";
import { getFeaturedVideosForHero } from "@/lib/services/videoService";

function formatViews(views) {
  if (!views) return "0";
  if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
  if (views >= 1000) return (views / 1000).toFixed(1) + "K";
  return views.toString();
}

// Helper function to strip HTML tags and limit to 120 chars for 2 lines
function stripHtmlTags(html, maxLength = 120) {
  if (!html) return "";
  const stripped = html.replace(/<[^>]*>/g, "");
  if (stripped.length > maxLength) {
    return stripped.substring(0, maxLength) + "...";
  }
  return stripped;
}

// ── Skeleton ───────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <section className="py-3 bg-slate-50 dark:bg-slate-900/60">
      <div className="max-w-[90rem] mx-auto px-3 sm:px-5 lg:px-7">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 animate-pulse">
            <div className="h-[300px] md:h-[520px] bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2 animate-pulse" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-28 h-[68px] bg-slate-200 dark:bg-slate-700 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3" />
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HeroSection() {
  const [heroItems, setHeroItems] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [heroResult, videosResult] = await Promise.all([
        getHeroItems(),
        getFeaturedVideosForHero(5),
      ]);
      if (heroResult.success) setHeroItems(heroResult.heroItems);
      if (videosResult.success) setFeaturedVideos(videosResult.videos);
      setLoading(false);
    };
    fetchData();
  }, []);

  const changeSlide = useCallback(
    (newIndex) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  useEffect(() => {
    if (!isAutoScrolling || heroItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoScrolling, heroItems.length]);

  const goToPrevious = () => {
    setIsAutoScrolling(false);
    changeSlide((currentIndex - 1 + heroItems.length) % heroItems.length);
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const goToNext = () => {
    setIsAutoScrolling(false);
    changeSlide((currentIndex + 1) % heroItems.length);
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const goToSlide = (index) => {
    setIsAutoScrolling(false);
    changeSlide(index);
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const scrollToLatestVideos = () => {
    document.getElementById("latest-videos-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return <HeroSkeleton />;

  const currentItem = heroItems[currentIndex];

  return (
    <section className="pb-3 pt-5 md:pt-9 bg-ghee dark:bg-slate-900/60">
      <div className="max-w-8xl mx-auto px-3 sm:px-7 lg:px-9">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ══ LEFT — Hero Carousel ══════════════════════════ */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/40 dark:shadow-slate-950/60">

              {heroItems.length > 0 ? (
                <>
                  {/* ── Main image ── */}
                  <Link
                    href={currentItem.type === "news" ? `/news/${currentItem.slug}` : `/video/${currentItem.slug}`}
                    className="block group"
                  >
                    {/* Changed height for mobile to prevent cropping */}
                    <div className="relative h-[300px] sm:h-[380px] md:h-[520px] bg-slate-900 overflow-hidden">
                      {currentItem.image ? (
                        <img
                          key={currentIndex}
                          src={currentItem.image}
                          alt={currentItem.title}
                          className="w-full h-full object-contain md:object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          style={{
                            transition: "opacity 0.4s ease, transform 0.7s ease",
                            opacity: isTransitioning ? 0 : 1,
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
                          {currentItem.type === "video" ? (
                            <Play className="w-16 h-16 text-slate-500" />
                          ) : (
                            <span className="text-5xl">📰</span>
                          )}
                        </div>
                      )}

                      {/* Gradient overlay - stronger for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

                      {/* Top-left badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span
                          className={[
                            "inline-flex items-center gap-1.5 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[11px] font-bold tracking-wider uppercase shadow-lg",
                            currentItem.type === "video" ? "bg-red-600 text-white" : "bg-blue-600 text-white",
                          ].join(" ")}
                        >
                          {currentItem.type === "video" ? (
                            <>
                              <Play className="w-2.5 h-2.5 md:w-3 md:h-3" fill="white" />
                              FEATURED
                            </>
                          ) : (
                            <>
                              <Radio className="w-2.5 h-2.5 md:w-3 md:h-3" />
                              TOP STORY
                            </>
                          )}
                        </span>
                      </div>

                      {/* Top-right views */}
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[9px] md:text-[11px] text-white border border-white/20">
                          <Eye className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          <span>{formatViews(currentItem.views)}</span>
                        </div>
                      </div>

                      {/* Bottom content */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-7 text-white">
                        
                        {/* Category */}
                        <div className="mb-1 md:mb-2">
                          <span className="text-[8px] md:text-[11px] font-bold text-red-400 uppercase tracking-wider">
                            {currentItem.category || (currentItem.type === "video" ? "Featured" : "Top Story")}
                          </span>
                          {currentItem.type === "news" && currentItem.readTime && (
                            <>
                              <span className="mx-1 md:mx-2 text-white/30">•</span>
                              <span className="text-[8px] md:text-[11px] text-slate-300">
                                {currentItem.readTime} min read
                              </span>
                            </>
                          )}
                          {currentItem.type === "video" && currentItem.duration && (
                            <>
                              <span className="mx-1 md:mx-2 text-white/30">•</span>
                              <span className="text-[8px] md:text-[11px] text-slate-300">
                                {currentItem.duration}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Title - 2 lines max, responsive sizing */}
                        <h2 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold leading-tight line-clamp-2 mb-1 md:mb-2 drop-shadow-lg">
                          {currentItem.title}
                        </h2>

                        {/* Description - EXACTLY 2 LINES using CSS */}
                        {currentItem.description && (
                          <div className="hidden sm:block mb-2 md:mb-3">
                            <p className="text-[11px] md:text-sm text-slate-200 line-clamp-2 max-w-2xl leading-relaxed">
                              {stripHtmlTags(currentItem.description, 120)}
                            </p>
                          </div>
                        )}

                        {/* CTA Button - smaller on mobile */}
                        <span className="inline-flex items-center gap-1 md:gap-2 px-2.5 md:px-5 py-1 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 transition-all duration-200 hover:-translate-y-0.5">
                          {currentItem.type === "video" ? (
                            <>
                              <Play className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" fill="white" />
                              Watch Now
                            </>
                          ) : (
                            <>Read Story →</>
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Navigation arrows */}
                  {heroItems.length > 1 && (
                    <>
                      <button
                        onClick={goToPrevious}
                        className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={goToNext}
                        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                      >
                        <ChevronRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
                      </button>
                    </>
                  )}

                  {/* Dots indicator */}
                  {heroItems.length > 1 && (
                    <div className="absolute bottom-12 md:bottom-[88px] left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 md:gap-2">
                      {heroItems.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={[
                            "rounded-full transition-all duration-300",
                            currentIndex === index
                              ? "w-4 h-1 md:w-6 md:h-1.5 bg-red-500"
                              : "w-1.5 h-1.5 md:w-2 md:h-2 bg-white/40 hover:bg-white/70",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  )}

                  {/* Slide count */}
                  <div className="absolute bottom-2 right-2 md:bottom-3 md:right-4 z-20 text-[8px] md:text-[11px] text-white/50 font-medium tabular-nums">
                    {String(currentIndex + 1).padStart(2, "0")} / {String(heroItems.length).padStart(2, "0")}
                  </div>
                </>
              ) : (
                <div className="h-[300px] md:h-[520px] bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center rounded-2xl">
                  <div className="text-center px-4">
                    <div className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
                      <Play className="w-6 h-6 md:w-10 md:h-10 text-red-500" />
                    </div>
                    <p className="text-slate-400 font-medium text-xs md:text-base">No hero content selected</p>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-1">Mark News or Videos as Hero in admin</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT — Sidebar ════════════════════ */}
          <div className="flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 rounded-xl shadow-md shadow-red-600/25">
                <Flame className="w-3.5 h-3.5 text-white" fill="white" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Latest Videos</span>
              </div>
              <button
                onClick={scrollToLatestVideos}
                className="text-[11px] font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-0.5"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Video list */}
            <div className="space-y-1">
              {featuredVideos.length > 0 ? (
                featuredVideos.map((video, index) => (
                  <Link
                    key={video.id}
                    href={`/video/${video.slug}`}
                    className="group flex gap-2 md:gap-3 p-2 md:p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    {/* Rank number */}
                    <div className="flex-shrink-0 w-4 md:w-5 flex items-center justify-center">
                      <span
                        className={[
                          "text-xs md:text-sm font-black tabular-nums",
                          index === 0 ? "text-red-500" :
                          index === 1 ? "text-orange-400" :
                          index === 2 ? "text-amber-400" :
                          "text-slate-400 dark:text-slate-600",
                        ].join(" ")}
                      >
                        {index + 1}
                      </span>
                    </div>

                    {/* Thumbnail - Fixed size to prevent cropping */}
                    <div className="relative w-[80px] md:w-[104px] h-[50px] md:h-[64px] flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-slate-700">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800">
                          <Play className="w-4 h-4 md:w-5 md:h-5 text-white/40" />
                        </div>
                      )}

                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 bg-transparent group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                        <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-lg">
                          <Play className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-white ml-0.5" fill="white" />
                        </div>
                      </div>

                      {/* Duration */}
                      {video.duration && (
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[7px] md:text-[9px] px-1 py-0.5 rounded font-semibold">
                          {video.duration}
                        </div>
                      )}
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0 py-0">
                      <h3 className="text-[11px] md:text-[13px] font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug mb-0.5 md:mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {video.title}
                      </h3>
                      
                      {/* Stats row */}
                      <div className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-0.5 md:gap-1">
                          <Eye className="w-2 h-2 md:w-2.5 md:h-2.5" />
                          {formatViews(video.views)}
                        </span>
                        {video.publishedAt && (
                          <>
                            <span className="w-px h-2 bg-slate-300 dark:bg-slate-600" />
                            <span>
                              {new Date(video.publishedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No videos available</p>
                  <p className="text-xs mt-1 opacity-70">Mark videos as "Featured" in admin</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}