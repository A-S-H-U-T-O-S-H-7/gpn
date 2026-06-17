"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLatestNews, getMoreNews } from "@/lib/services/newsService";
import NewsCard from "@/components/sections/news-section/NewsCard";
import SkeletonNewsCard from "@/components/sections/news-section/SkeletonNewsCard";

export default function NewsPage() {
  const router = useRouter();
  
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalNews, setTotalNews] = useState(0);
  const loaderRef = useRef(null);

  const fetchInitialNews = async () => {
    setLoading(true);
    try {
      const result = await getLatestNews(1, 24);
      if (result.success) {
        setNews(result.news);
        setHasMore(result.hasMore);
        setTotalNews(result.totalNews || result.news.length);
        if (result.lastVisible) setLastDoc(result.lastVisible);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNews = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const result = await getMoreNews(lastDoc, 12);
      if (result.success && result.news.length > 0) {
        setNews(prev => [...prev, ...result.news]);
        setLastDoc(result.lastVisible);
        setHasMore(result.hasMore);
        setTotalNews(prev => prev + result.news.length);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more news:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreNews();
        }
      },
      { threshold: 0.1, rootMargin: "120px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, lastDoc]);

  useEffect(() => {
    fetchInitialNews();
  }, []);

  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-18 py-8">
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
          All News
        </h1>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700/50">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
          {totalNews} articles
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

        {/* News Grid */}
        {loading && news.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(12)].map((_, i) => <SkeletonNewsCard key={i} />)}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No news articles found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {news.map((article) => (
                <NewsCard key={article.id} news={article} />
              ))}
            </div>

            {/* Load More - Following CategoryPage pattern */}
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center items-center py-10 mt-4">
                {loadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Loading more...</span>
                  </div>
                ) : (
                  <button
                    onClick={loadMoreNews}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Load More
                  </button>
                )}
              </div>
            )}

            {/* End of library */}
            {!hasMore && news.length > 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400 dark:text-gray-500">You've reached the end of our news feed</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}