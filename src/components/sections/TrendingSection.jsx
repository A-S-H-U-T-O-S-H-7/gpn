"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Flame, Eye, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { getTrendingItems } from "@/lib/services/trendingService";

export default function TrendingSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const loaderRef = useRef(null);
  const itemsPerPage = 6;

  const fetchInitialItems = async () => {
    setLoading(true);
    try {
      const result = await getTrendingItems(1, itemsPerPage);
      if (result.success) {
        setItems(result.items);
        setHasMore(result.hasMore);
        setTotalItems(result.total);
        setPage(1);
      }
    } catch (error) {
      console.error("Error fetching trending items:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreItems = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getTrendingItems(nextPage, itemsPerPage);
      if (result.success && result.items.length > 0) {
        setItems((prev) => [...prev, ...result.items]);
        setPage(nextPage);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more items:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
    if (!hasMore && items.length < totalItems) loadMoreItems();
  };

  const handleShowLess = () => {
    setShowAll(false);
    fetchInitialItems();
  };

  // Infinite scroll observer
  useEffect(() => {
    if (!showAll || !hasMore || loadingMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [showAll, hasMore, loadingMore, loading]);

  useEffect(() => {
    fetchInitialItems();
  }, []);

  const displayedItems = showAll ? items : items.slice(0, 8);

  // ── Loading skeleton ──
  if (loading && items.length === 0) {
    return (
      <section className="py-2">
        <div className="flex items-center gap-3 mb-5">
          <Flame className="w-5 h-5 text-red-600 fill-red-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-700" />
              <div className="bg-white dark:bg-gray-900 p-3 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-14" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0 && !loading) return null;

  return (
    <section className="py-2">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-5">
        <Flame className="w-5 h-5 text-red-600 fill-red-600 flex-shrink-0" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
        {/* <span className="flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900">
          {totalItems} stories
        </span> */}
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {displayedItems.map((item, index) => (
          <Link
            key={`${item.id}-${item.type}`}
            href={item.type === "news" ? `/news/${item.slug}` : `/video/${item.slug}`}
            className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900 hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl opacity-20">📰</span>
                </div>
              )}

              {/* Rank badge */}
              <div className="absolute top-2.5 left-2.5 w-6 h-6 bg-red-700 text-white font-bold rounded-md flex items-center justify-center text-[10px] shadow z-10">
                {index + 1}
              </div>

              {/* Type badge */}
              {item.type === "video" && (
                <div className="absolute top-2.5 right-2.5 bg-black/65 text-white text-[9px] font-medium px-1.5 py-0.5 rounded tracking-wider">
                  VIDEO
                </div>
              )}

              {/* Duration */}
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black/65 text-white text-[9px] px-1.5 py-0.5 rounded">
                  {item.duration}
                </div>
              )}

              {/* Bottom gradient for text legibility on dark images */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-3 gap-2">
              {/* Category */}
              <span className="self-start text-[10px] font-semibold uppercase tracking-wide text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 px-2 py-0.5 rounded">
                {item.category || (item.type === "news" ? "News" : "Video")}
              </span>

              {/* Title */}
              <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors flex-1">
                {item.title}
              </h3>

              {/* Meta */}
              <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-auto">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.timeAgo}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {item.formattedViews} views
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Show All button ── */}
      {!showAll && items.length >= 8 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowAll}
            className="group flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-800 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
          >
            Show all trending stories
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* ── Show Less button ── */}
      {showAll && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowLess}
            className="group flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
          >
            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Show less
          </button>
        </div>
      )}

      {/* ── Infinite scroll trigger ── */}
      {showAll && hasMore && (
        <div ref={loaderRef} className="flex justify-center items-center py-8">
          {loadingMore ? (
            <div className="flex gap-1.5">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          ) : (
            <button
              onClick={loadMoreItems}
              className="px-5 py-2 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
            >
              Load more
            </button>
          )}
        </div>
      )}

      {/* ── End of list ── */}
      {showAll && !hasMore && items.length > 8 && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 py-6">
          You've seen all trending stories
        </p>
      )}
    </section>
  );
}