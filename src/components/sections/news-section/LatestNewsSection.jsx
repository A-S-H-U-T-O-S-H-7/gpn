"use client";

import { useState, useEffect } from "react";
import { getLatestNews, getMoreNews } from "@/lib/services/newsService";
import NewsCard from "./NewsCard";
import SkeletonNewsCard from "./SkeletonNewsCard";
import NewsHeader from "./NewsHeader";
import SeeMoreButton from "./LoadMoreButton";
import EmptyNewsState from "./EmptyNewsState";

export default function LatestNewsSection() {
  const [allNews, setAllNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(16);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  const INITIAL_VISIBLE = 16;
  const LOAD_MORE_COUNT = 12;

  const fetchInitialNews = async () => {
    setLoading(true);
    try {
      const result = await getLatestNews(1, 50);
      
      if (result.success) {
        setAllNews(result.news);
        setHasMore(result.hasMore);
        setVisibleCount(Math.min(INITIAL_VISIBLE, result.news.length));
        
        // Store the last document reference for pagination
        if (result.lastVisible) {
          setLastDoc(result.lastVisible);
        }
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNews = async () => {
    if (loadingMore || !hasMore) return;
    
    // If we have more news in allNews array that are not yet visible
    if (visibleCount < allNews.length) {
      setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, allNews.length));
      return;
    }
    
    // Fetch more from API using lastDoc
    setLoadingMore(true);
    try {
      const result = await getMoreNews(lastDoc, LOAD_MORE_COUNT);
      
      if (result.success && result.news && result.news.length > 0) {
        setAllNews(prev => [...prev, ...result.news]);
        setVisibleCount(prev => prev + result.news.length);
        
        // Update lastDoc for next pagination
        if (result.lastVisible) {
          setLastDoc(result.lastVisible);
        }
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more news:", err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSeeMore = () => {
    loadMoreNews();
  };

  useEffect(() => {
    fetchInitialNews();
  }, []);

  const visibleNews = allNews.slice(0, visibleCount);
  const showSeeMoreButton = hasMore || visibleCount < allNews.length;

  console.log("Debug - hasMore:", hasMore);
  console.log("Debug - visibleCount:", visibleCount);
  console.log("Debug - allNews.length:", allNews.length);
  console.log("Debug - showSeeMoreButton:", showSeeMoreButton);

  return (
    <section id="latest-news-section" className="py-8 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10">
        
        <NewsHeader />

        {/* News Grid */}
        {loading && allNews.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(16)].map((_, i) => <SkeletonNewsCard key={i} />)}
          </div>
        ) : visibleNews.length === 0 && !loading ? (
          <EmptyNewsState />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {visibleNews.map((article) => (
                <NewsCard key={article.id} news={article} />
              ))}
            </div>

            {/* See More Button */}
            {showSeeMoreButton && (
              <div className="flex justify-center items-center py-10 mt-4">
                <SeeMoreButton onClick={handleSeeMore} loading={loadingMore} />
              </div>
            )}

            {/* End of content */}
            {!hasMore && !showSeeMoreButton && visibleNews.length > 0 && (
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
          </>
        )}
      </div>
    </section>
  );
}