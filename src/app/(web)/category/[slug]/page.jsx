"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, Play, LayoutGrid, Newspaper, Video } from "lucide-react";
import { getCategoryBySlug } from "@/lib/services/categoryService";
import { getNewsByCategory } from "@/lib/services/newsService";
import { getVideosByCategory } from "@/lib/services/videoService";

// Helper function to strip HTML tags
const stripHtml = (html) => {
  if (!html) return "";
  
  // Create a temporary div element
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  
  // Get the text content (automatically strips HTML)
  const text = tmp.textContent || tmp.innerText || '';
  
  // Clean up extra whitespace
  return text
    .replace(/\u200B/g, '') // Remove zero-width spaces
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Alternative helper that works on server-side too
const stripHtmlSafe = (html) => {
  if (!html) return "";
  
  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\u200B/g, '') // Remove zero-width spaces
    .replace(/\s+/g, ' ')
    .trim();
};

// Helper to clean content (title, excerpt, description)
const cleanContent = (content) => {
  if (!content) return "";
  
  // If running in browser, use DOM method (more reliable)
  if (typeof window !== 'undefined') {
    return stripHtml(content);
  }
  
  // Fallback for server-side
  return stripHtmlSafe(content);
};

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoryResult = await getCategoryBySlug(slug);
        if (!categoryResult.success || !categoryResult.category) {
          router.push("/");
          return;
        }
        setCategory(categoryResult.category);

        const newsResult = await getNewsByCategory(slug);
        if (newsResult.success) {
          // Clean HTML from news items
          const cleanedNews = newsResult.news.map(item => ({
            ...item,
            title: cleanContent(item.title),
            excerpt: cleanContent(item.excerpt),
            description: cleanContent(item.description),
          }));
          setNews(cleanedNews);
        }

        const videosResult = await getVideosByCategory(slug);
        if (videosResult.success) {
          // Clean HTML from video items
          const cleanedVideos = videosResult.videos.map(item => ({
            ...item,
            title: cleanContent(item.title),
            description: cleanContent(item.description),
          }));
          setVideos(cleanedVideos);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug, router]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(1) + "K";
    return views.toString();
  };

  const getFilteredContent = () => {
    if (activeTab === "news") return news;
    if (activeTab === "videos") return videos;
    return [...news, ...videos].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  const filteredContent = getFilteredContent();
  const accentColor = category?.backgroundColor || "#ef4444";

  const tabs = [
    { key: "all", label: "All", count: news.length + videos.length, icon: LayoutGrid },
    { key: "news", label: "News", count: news.length, icon: Newspaper },
    { key: "videos", label: "Videos", count: videos.length, icon: Video },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-ghee dark:bg-slate-900/50">
        {/* Skeleton header */}
        <div className="border-b border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
            <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-900/50">
      {/* Category Hero Header */}
      <div className="bg-ghee dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors mb-5 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

          <div className="flex items-start gap-4">
            {/* Category color badge */}
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm mt-0.5"
              style={{ backgroundColor: accentColor }}
            >
              {category?.iconEmoji || "📁"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {category?.name}
                </h1>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: `${accentColor}18`,
                    color: accentColor,
                  }}
                >
                  {news.length + videos.length} articles
                </span>
              </div>
              {category?.description && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 leading-relaxed">
                  {cleanContent(category.description)}
                </p>
              )}
              {/* Accent underline */}
              <div
                className="h-0.5 w-12 rounded-full mt-3"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-gray-200 dark:border-gray-700/60">
            {tabs.map(({ key, label, count, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                  activeTab === key
                    ? "border-current"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                style={
                  activeTab === key
                    ? { color: accentColor, borderColor: accentColor }
                    : {}
                }
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === key
                      ? ""
                      : "bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400"
                  }`}
                  style={
                    activeTab === key
                      ? { background: `${accentColor}18`, color: accentColor }
                      : {}
                  }
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-3xl mb-4">
              {category?.iconEmoji || "📁"}
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">No content yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Check back soon for {category?.name} updates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredContent.map((item) => {
              const isVideo = item.videoId !== undefined;
              const linkHref = isVideo ? `/video/${item.slug}` : `/news/${item.slug}`;
              const thumbnail = isVideo ? item.thumbnail : item.image;
              const excerpt = item.excerpt || item.description;

              return (
                <Link
                  key={`${item.id}-${isVideo ? "video" : "news"}`}
                  href={linkHref}
                  className="group bg-white dark:bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                        {isVideo
                          ? <Play className="w-10 h-10 text-gray-400" />
                          : <span className="text-4xl opacity-40">📰</span>
                        }
                      </div>
                    )}

                    {/* Type badge */}
                    <div className="absolute top-2.5 left-2.5">
                      {isVideo ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                          <Play className="w-2.5 h-2.5 fill-white" /> VIDEO
                        </span>
                      ) : (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${accentColor}22`, color: accentColor }}
                        >
                          NEWS
                        </span>
                      )}
                    </div>

                    {/* Duration badge */}
                    {isVideo && item.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                        {item.duration}
                      </div>
                    )}

                    {/* Video play overlay */}
                    {isVideo && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 text-gray-800 fill-gray-800 ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors leading-snug flex-1">
                      {item.title}
                    </h2>

                    {excerpt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                        {excerpt}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60 text-xs text-gray-400 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatViews(item.views)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}