"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  const loaderRef = useRef(null);
  const itemsPerPage = 6;

  // Fetch initial items
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
      setInitialLoadDone(true);
    }
  };

  // Load more items
  const loadMoreItems = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getTrendingItems(nextPage, itemsPerPage);
      if (result.success && result.items.length > 0) {
        setItems(prev => [...prev, ...result.items]);
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

  // Reset and show all
  const handleShowAll = () => {
    setShowAll(true);
    if (!hasMore && items.length < totalItems) {
      loadMoreItems();
    }
  };

  const handleShowLess = () => {
    setShowAll(false);
    fetchInitialItems();
  };

  // Intersection Observer for infinite scroll when showAll is true
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
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => observer.disconnect();
  }, [showAll, hasMore, loadingMore, loading]);

  useEffect(() => {
    fetchInitialItems();
  }, []);

  const displayedItems = showAll ? items : items.slice(0, 6);

  if (loading && items.length === 0) {
    return (
      <section className="py-10 bg-ghee dark:bg-slate-900/50">
        <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-red fill-red" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-44 rounded-t-xl" />
                <div className="bg-white dark:bg-gray-800 p-3 rounded-b-xl">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-10 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-red fill-red" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Trending Now
            </h2>
            <span className="px-2 py-1 bg-red/10 text-red text-xs font-semibold rounded-full">
              {totalItems} Stories
            </span>
          </div>
          {!showAll && items.length >= 6 && (
            <button
              onClick={handleShowAll}
              className="flex items-center gap-1 px-4 py-2 text-sm text-red hover:text-red-600 font-medium rounded-lg hover:bg-red/10 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
              View All
            </button>
          )}
          {showAll && (
            <button
              onClick={handleShowLess}
              className="flex items-center gap-1 px-4 py-2 text-sm text-red hover:text-red-600 font-medium rounded-lg hover:bg-red/10 transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
              Show Less
            </button>
          )}
        </div>

        {/* Trending Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedItems.map((item, index) => (
            <Link
              key={`${item.id}-${item.type}`}
              href={item.type === 'news' ? `/news/${item.slug}` : `/video/${item.slug}`}
              className="group cursor-pointer bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              {/* Image Container */}
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Image</span>
                  </div>
                )}
                {/* Trending Rank Badge */}
                <div className="absolute top-3 left-3 w-7 h-7 bg-red text-white font-bold rounded-md flex items-center justify-center text-xs shadow-lg z-10">
                  {index + 1}
                </div>
                {/* Type Badge */}
                {item.type === 'video' && (
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                    VIDEO
                  </div>
                )}
                {item.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                    {item.duration}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                {/* Category */}
                <div className="inline-block px-2 py-0.5 bg-red/10 text-red text-xs font-semibold rounded mb-2">
                  {item.category || (item.type === 'news' ? 'News' : 'Video')}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red transition-colors">
                  {item.title}
                </h3>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{item.formattedViews} views</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Trigger for Infinite Scroll */}
        {showAll && hasMore && (
          <div ref={loaderRef} className="flex justify-center items-center py-8 mt-4">
            {loadingMore ? (
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-red rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-red rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            ) : (
              <button
                onClick={loadMoreItems}
                className="px-6 py-2 text-sm text-red border border-red rounded-full hover:bg-red hover:text-white transition-all duration-300"
              >
                Load More
              </button>
            )}
          </div>
        )}

        {/* End Message */}
        {showAll && !hasMore && items.length > 6 && (
          <div className="text-center py-6">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              You've reached the end of trending stories
            </p>
          </div>
        )}
      </div>
    </section>
  );
}