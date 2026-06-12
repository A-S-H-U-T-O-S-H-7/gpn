"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Flame, ChevronRight } from "lucide-react";
import { getBreakingNews } from "@/lib/services/newsService";

export default function BreakingNewsTicker() {
  const [breakingNews, setBreakingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef(null);
  const [animationDuration, setAnimationDuration] = useState(40); // Default slower speed

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const result = await getBreakingNews();
        if (result.success) {
          setBreakingNews(result.news);
        }
      } catch (error) {
        console.error("Error fetching breaking news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBreakingNews();
  }, []);

  // Calculate animation duration based on number of news items
  useEffect(() => {
    if (breakingNews.length > 0) {
      // Each news item takes about 3-4 seconds to read comfortably
      // Slower speed = longer duration
      const baseDuration = breakingNews.length * 3.5; // 3.5 seconds per item
      setAnimationDuration(Math.max(baseDuration, 40)); // Minimum 40 seconds
    }
  }, [breakingNews]);

  if (loading || breakingNews.length === 0) {
    return null;
  }

  const renderNewsItems = (duplicate = false) =>
    breakingNews.map((news) => (
      <Link
        key={duplicate ? `${news.id}-duplicate` : news.id}
        href={`/news/${news.slug}`}
        tabIndex={duplicate ? -1 : undefined}
        className="inline-flex items-center gap-1.5 sm:gap-2 py-2 group hover:bg-red-700/50 px-2 rounded-lg transition-colors"
      >
        <span className="text-white/60 text-xs flex-shrink-0">{"\u2022"}</span>
        <span className="text-white text-sm md:text-base font-medium hover:text-yellow-200 transition-colors whitespace-normal">
          {news.title}
        </span>
        <ChevronRight className="w-3 h-3 text-white/50 group-hover:text-white transition-colors flex-shrink-0" />
      </Link>
    ));

  return (
    <div className="w-full bg-gradient-to-r from-red-600 to-red-700 border-b border-red-800">
      <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center h-12 min-w-0">
          {/* Left Side - Fixed Breaking News Label */}
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 pr-2 md:pr-4 border-r border-red-400/50 z-10 bg-gradient-to-r from-red-600 to-red-700">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-white animate-pulse" />
              <span className="text-white font-bold text-sm md:text-base tracking-wide">
                BREAKING
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="text-white/80 text-sm font-medium">NEWS</span>
            </div>
          </div>

          {/* Right Side - Marquee Scrolling News Ticker */}
          <div
            className="flex-1 min-w-0 ml-2 sm:ml-4 overflow-hidden relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              ref={tickerRef}
              className="inline-flex w-max whitespace-nowrap"
              style={{
                animation: `marquee ${animationDuration}s linear infinite`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              <div className="inline-flex items-center gap-4 sm:gap-6 pr-4 sm:pr-6">
                {renderNewsItems()}
              </div>
              <div
                className="inline-flex items-center gap-4 sm:gap-6 pr-4 sm:pr-6"
                aria-hidden="true"
              >
                {renderNewsItems(true)}
              </div>
            </div>

            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r from-red-600 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l from-red-600 to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>

      {/* Add keyframes animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}