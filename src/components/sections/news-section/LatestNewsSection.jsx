"use client";

import { useState, useEffect, useRef } from "react";
import { getLatestNews, getMoreNews } from "@/lib/services/newsService";
import NewsCard from "./NewsCard";
import SkeletonNewsCard from "./SkeletonNewsCard";
import NewsHeader from "./NewsHeader";
import LoadMoreButton from "./LoadMoreButton";
import EmptyNewsState from "./EmptyNewsState";

export default function LatestNewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  const loaderRef = useRef(null);

  const fetchInitialNews = async () => {
    setLoading(true);
    try {
      const result = await getLatestNews(1, 20);
      if (result.success) {
        setNews(result.news);
        setHasMore(result.hasMore);
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
      const result = await getMoreNews(lastDoc, 10);
      if (result.success && result.news.length > 0) {
        setNews((prev) => [...prev, ...result.news]);
        setLastDoc(result.lastVisible);
        setHasMore(result.hasMore);
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
    <section id="latest-news-section" className="py-8 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10">
        
        <NewsHeader />

        {/* News Grid */}
        {loading && news.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(12)].map((_, i) => <SkeletonNewsCard key={i} />)}
          </div>
        ) : news.length === 0 && !loading ? (
          <EmptyNewsState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {news.map((article) => (
              <NewsCard key={article.id} news={article} />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && news.length > 0 && (
          <div ref={loaderRef} className="flex justify-center items-center py-10 mt-4">
            <LoadMoreButton onClick={loadMoreNews} loading={loadingMore} />
          </div>
        )}

        {/* End of library */}
        {!hasMore && news.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex flex-col items-center gap-2">
              <div className="w-12 h-px bg-slate-200 dark:bg-slate-700" />
              <p className="text-xs text-slate-400 dark:text-slate-500">
                You've reached the end of our news feed
              </p>
              <div className="w-12 h-px bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}