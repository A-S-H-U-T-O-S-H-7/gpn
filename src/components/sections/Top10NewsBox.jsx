"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, Clock, ChevronRight, Newspaper } from "lucide-react";
import { getTop10Video } from "@/lib/services/videoService";

export default function Top10NewsBox() {
  const [top10Video, setTop10Video] = useState(null);
  const [top10Points, setTop10Points] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const listRef = useRef(null);
  const animRef = useRef(null);
  const scrollYRef = useRef(0);
  const lastTsRef = useRef(null);
  const isPausedRef = useRef(false);

  const ITEM_H = 56; // px per item row
  const SCROLL_SPEED = 0.022; // px per ms

  useEffect(() => {
    fetchTop10Video();
  }, []);

  const fetchTop10Video = async () => {
    setLoading(true);
    try {
      const result = await getTop10Video();
      if (result.success && result.video) {
        setTop10Video(result.video);
        const points = extractPoints(result.video.description);
        setTop10Points(points);
      }
    } catch (error) {
      console.error("Error fetching Top 10 video:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractPoints = (htmlDescription) => {
    if (!htmlDescription) return [];
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlDescription;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    const cleaned = textContent
      .replace(/\d+\.\s*/g, "|")
      .split("|")
      .filter((s) => s.trim().length > 0);
    if (cleaned.length >= 10)
      return cleaned.slice(0, 10).map((s) => s.trim().replace(/\s+/g, " "));
    const lines = textContent
      .split("\n")
      .filter((line) => line.trim().length > 0);
    if (lines.length >= 10)
      return lines.slice(0, 10).map((line) => line.trim().replace(/\s+/g, " "));
    return cleaned.slice(0, 10).map((s) => s.trim().replace(/\s+/g, " "));
  };

  // Infinite smooth scroll via rAF
  useEffect(() => {
    if (top10Points.length === 0 || !listRef.current) return;

    const totalH = ITEM_H * top10Points.length;

    const step = (ts) => {
      if (!isPausedRef.current) {
        if (lastTsRef.current !== null) {
          const delta = ts - lastTsRef.current;
          scrollYRef.current += SCROLL_SPEED * delta;

          // Seamless reset — loop back after one full set
          if (scrollYRef.current >= totalH) {
            scrollYRef.current -= totalH;
          }

          if (listRef.current) {
            listRef.current.style.transform = `translateY(-${scrollYRef.current}px)`;
          }

          const idx = Math.round(scrollYRef.current / ITEM_H) % top10Points.length;
          setActiveIndex(idx);
        }
        lastTsRef.current = ts;
      } else {
        lastTsRef.current = null;
      }
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [top10Points]);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    setIsPaused(false);
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-10 bg-red-900" />
        <div className="bg-white dark:bg-gray-900 p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty state ──
  if (!top10Video || top10Points.length === 0) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="bg-red-900 px-4 py-3 flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-red-300" />
          <span className="text-red-100 font-medium text-xs uppercase tracking-widest">
            The Daily Top 10
          </span>
        </div>
        <div className="bg-white dark:bg-gray-900 flex items-center justify-center py-16">
          <p className="text-sm text-gray-400">No Top 10 available today. Check back soon.</p>
        </div>
      </div>
    );
  }

  // Render 3× the list so the infinite loop resets invisibly
  const tripled = [...top10Points, ...top10Points, ...top10Points];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      {/* ── Header ── */}
      <div className="bg-red-900 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-red-300" />
          <span className="text-red-100 font-medium text-xs uppercase tracking-widest">
            The Daily Top 10
          </span>
        </div>
        <span className="text-red-400 text-[10px]">
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* ── Watch link ── */}
      <Link
        href={`/video/${top10Video.slug}`}
        className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 border-b border-gray-100 dark:border-gray-800 transition-colors group"
      >
        <Play className="w-3 h-3 fill-current" />
        <span className="group-hover:underline underline-offset-2">Watch full video</span>
        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* ── Scrolling list ── */}
      <div
        className="overflow-hidden relative"
        style={{ height: `${ITEM_H * 6}px` }} // show 6 items at a time
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

        <div ref={listRef} className="will-change-transform">
          {tripled.map((point, i) => {
            const realIdx = i % top10Points.length;
            const isActive = realIdx === activeIndex;
            return (
              <div
                key={i}
                style={{ height: `${ITEM_H}px` }}
                className={`flex items-start gap-3 px-4 py-3 transition-colors duration-300 ${
                  isActive
                    ? "bg-red-50 dark:bg-red-950/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/40"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-red-700 text-white scale-110"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {realIdx + 1}
                </span>
                <p
                  className={`text-[12.5px] leading-relaxed line-clamp-2 transition-colors duration-300 ${
                    isActive
                      ? "text-gray-900 dark:text-white font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {point}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Dot indicators ── */}
      <div className="flex items-center justify-center gap-1.5 py-3 border-t border-gray-100 dark:border-gray-800">
        {top10Points.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-400 ${
              i === activeIndex
                ? "w-5 bg-red-700 dark:bg-red-500"
                : "w-1.5 bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[65%]">
          📰 {top10Video.title}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
          <Clock className="w-2.5 h-2.5" />
          <span>
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}