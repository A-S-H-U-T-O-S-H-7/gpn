"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getLatestNews, getMoreNews } from "@/lib/services/newsService";
import NewsCard from "./NewsCard";
import SkeletonNewsCard from "./SkeletonNewsCard";
import NewsHeader from "./NewsHeader";
import EmptyNewsState from "./EmptyNewsState";

export default function LatestNewsSection() {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalNews, setTotalNews] = useState(0);

  useEffect(() => {
    fetchInitialNews();
  }, []);

  const fetchInitialNews = async () => {
    setLoading(true);
    try {
      const result = await getLatestNews(1, 20);
      
      if (result.success) {
        setAllNews(result.news);
        setTotalNews(result.totalNews || result.news.length);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="latest-news-section" className="py-8 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <NewsHeader />
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonNewsCard key={i} />)}
          </div>
        ) : allNews.length === 0 ? (
          <EmptyNewsState />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {allNews.map((article) => (
                <NewsCard key={article.id} news={article} />
              ))}
            </div>

            {/* View All Button - Centered at Bottom */}
            <div className="flex justify-center mt-10">
              <Link
                href="/latestNews"
                className="group relative inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700/50 rounded-full shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View All News</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                
                {/* Glow Effect */}
                <span className="absolute inset-0 rounded-full bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}