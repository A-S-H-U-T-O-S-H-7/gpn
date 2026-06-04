"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Calendar, Eye, Clock, Play, FileText, Video, BookOpen, ArrowLeft } from "lucide-react";
import { searchAllContent } from "@/lib/services/searchService";

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatViews(views) {
  if (!views) return "0";
  if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
  if (views >= 1000) return (views / 1000).toFixed(1) + "K";
  return views.toString();
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("all");
  const [searchResults, setSearchResults] = useState({ news: [], videos: [], blogs: [] });
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (query && query.length >= 2) {
      performSearch();
    } else {
      setLoading(false);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    const result = await searchAllContent(query);
    if (result.success) {
      setSearchResults(result.results);
      setTotalResults(result.total);
    }
    setLoading(false);
  };

  const getTabCount = (tab) => {
    if (tab === "all") return totalResults;
    if (tab === "news") return searchResults.news.length;
    if (tab === "videos") return searchResults.videos.length;
    if (tab === "blogs") return searchResults.blogs.length;
    return 0;
  };

  const getResultsToShow = () => {
    if (activeTab === "all") {
      return [
        ...searchResults.news.map(r => ({ ...r, type: "news" })),
        ...searchResults.videos.map(r => ({ ...r, type: "video" })),
        ...searchResults.blogs.map(r => ({ ...r, type: "blog" })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (activeTab === "news") return searchResults.news.map(r => ({ ...r, type: "news" }));
    if (activeTab === "videos") return searchResults.videos.map(r => ({ ...r, type: "video" }));
    if (activeTab === "blogs") return searchResults.blogs.map(r => ({ ...r, type: "blog" }));
    return [];
  };

  const renderResultCard = (item) => {
    const href = `/${item.type === "video" ? "video" : item.type === "blog" ? "blogs" : "news"}/${item.slug}`;
    const thumbnail = item.image || item.thumbnail;
    
    return (
      <Link key={`${item.type}-${item.id}`} href={href} className="group">
        <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col sm:flex-row gap-4 p-4">
          {/* Thumbnail */}
          <div className="relative w-full sm:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
            {thumbnail ? (
              <img src={thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                {item.type === "video" ? "🎬" : item.type === "blog" ? "📝" : "📰"}
              </div>
            )}
            {item.type === "video" && item.duration && (
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                {item.duration}
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                item.type === "video" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                item.type === "blog" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              }`}>
                {item.type === "video" ? "VIDEO" : item.type === "blog" ? "BLOG" : "NEWS"}
              </span>
              {item.category && (
                <span className="text-xs text-gray-500">{item.category}</span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red transition-colors line-clamp-2">
              {item.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {item.excerpt || item.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(item.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{formatViews(item.views)} views</span>
              </div>
              {item.type === "blog" && item.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.readTime} min read</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const resultsToShow = getResultsToShow();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-red" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h1>
          </div>
          {query && (
            <p className="text-gray-600 dark:text-gray-400">
              Found {totalResults} result{totalResults !== 1 ? "s" : ""} for "{query}"
            </p>
          )}
        </div>

        {/* Tabs */}
        {totalResults > 0 && (
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
            {["all", "news", "videos", "blogs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 capitalize flex items-center gap-2 ${
                  activeTab === tab
                    ? "text-red border-b-2 border-red"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab === "all" && "All"}
                {tab === "news" && "News"}
                {tab === "videos" && "Videos"}
                {tab === "blogs" && "Blogs"}
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
                  {getTabCount(tab)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : resultsToShow.length > 0 ? (
          <div className="space-y-4">
            {resultsToShow.map(renderResultCard)}
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              We couldn't find any matches for "{query}". Try searching with different keywords.
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Enter a search term
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Search for news, videos, or blogs across our platform
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}