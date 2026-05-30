"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import BlogCard from "./BlogCard";
import { Sparkles, TrendingUp, Globe, Zap, BookOpen } from "lucide-react";
import { getPublishedBlogs } from "@/lib/services/blogService";

export default function BlogsPage() {
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loaderRef = useRef(null);
  const blogsPerLoad = 8;

  const fetchBlogs = useCallback(async (pageNum, isInitial = false) => {
    try {
      const result = await getPublishedBlogs(pageNum, blogsPerLoad);
      if (result.success) {
        if (isInitial) {
          setDisplayedBlogs(result.blogs);
          setHasMore(result.blogs.length === blogsPerLoad);
        } else {
          setDisplayedBlogs((prev) => [...prev, ...result.blogs]);
          setHasMore(result.blogs.length === blogsPerLoad);
        }
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchBlogs(1, true).finally(() => setIsLoading(false));
  }, [fetchBlogs]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBlogs(nextPage, false).finally(() => setIsLoadingMore(false));
  }, [page, hasMore, isLoadingMore, fetchBlogs]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) loadMore();
      },
      { threshold: 0.1, rootMargin: "200px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, loadMore]);

  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-slate-950">

      {/* ── Hero Banner ── */}
      <section className="relative w-full overflow-hidden">
        {/* Fixed aspect-ratio wrapper so layout doesn't shift while loading */}
        <div className="relative w-full h-[420px] sm:h-[480px] md:h-[540px]">

          {/* Desktop banner — priority + eager fetch, small blurDataURL avoids CLS */}
          <Image
            src="/blogbanner.png"
            alt="GPN Blogs Banner"
            fill
            priority
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            className="hidden md:block object-cover object-center"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFERIhMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AoNpuEzc5jse2R3JC1JbSQnAzuauuoIunbYtq3RXkuJIAIKiM5+6UpAf/2Q=="
          />

          {/* Mobile banner */}
          <Image
            src="/blogbanner_m.png"
            alt="GPN Blogs Banner"
            fill
            priority
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            className="block md:hidden object-cover object-center"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAQAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgQF/8QAIhAAAQMEAgMAAAAAAAAAAAAAAQIDBAASBREhMVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmtpuEzc5jse3R3JC1JbSQnAzuauuoIunbYtq3RXkuJIAIKiM5+6UpAf/2Q=="
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
            <div className="max-w-xl">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/90 backdrop-blur-sm rounded-full mb-4">
                <Sparkles className="w-3 h-3 text-white" />
                <span className="text-white text-[11px] font-semibold tracking-wide uppercase">
                  Welcome to GPN Blogs
                </span>
              </div>

              <p className="text-red-400 text-sm font-bold tracking-[0.15em] uppercase mb-1">
                GPN BLOGS
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-1">
                In-Depth. Insightful.
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-red-400 leading-[1.1] mb-4">
                Informed.
              </h2>
              <div className="w-14 h-0.5 bg-red-500 rounded-full mb-4" />

              <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-sm mb-1">
                Thought-provoking analysis, expert opinions, and stories that go beyond the headlines.
              </p>
              <p className="text-white/70 text-sm leading-relaxed max-w-sm mb-6">
                Stay informed with perspectives that matter from around the globe.
              </p>

              {/* Feature chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <BookOpen className="w-3 h-3 text-red-400" />, label: "Expert Insights" },
                  { icon: <TrendingUp className="w-3 h-3 text-red-400" />, label: "Deep Analysis" },
                  { icon: <Globe className="w-3 h-3 text-red-400" />, label: "Global Perspectives" },
                  { icon: <Zap className="w-3 h-3 text-red-400" />, label: "Trending Topics" },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full"
                  >
                    {icon}
                    <span className="text-white text-[11px] font-medium">{label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog Grid ── */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Section heading */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Latest Articles</h2>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 animate-pulse"
              >
                <div className="h-44 bg-gray-200 dark:bg-slate-700" />
                <div className="p-4 space-y-3 bg-white dark:bg-gray-900">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-2/3" />
                  <div className="flex justify-between pt-2">
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog grid */}
        {!isLoading && displayedBlogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {displayedBlogs.map((blog, index) => (
                <BlogCard key={blog.id} post={blog} index={index} />
              ))}
            </div>

            {/* Load more / infinite scroll target */}
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center items-center py-12 mt-4">
                {isLoadingMore ? (
                  <div className="flex items-center gap-2">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={loadMore}
                    className="px-7 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                  >
                    Load More Articles
                  </button>
                )}
              </div>
            )}

            {!hasMore && displayedBlogs.length > 0 && (
              <div className="text-center py-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-full">
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-slate-500 rounded-full" />
                  <p className="text-gray-400 dark:text-slate-500 text-xs font-medium">
                    You've reached the end — {displayedBlogs.length} articles total
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!isLoading && displayedBlogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">📭</span>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No blog posts found</p>
            <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">Check back soon for new articles.</p>
          </div>
        )}
      </section>
    </div>
  );
}