"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import BlogCard from "./BlogCard";
import { Sparkles, TrendingUp, Globe, Zap, BookOpen, ChevronRight } from "lucide-react";
import { getPublishedBlogs } from "@/lib/services/blogService";

export default function BlogsPage() {
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const loaderRef = useRef(null);
  const blogsPerLoad = 8;

  // Fetch blogs from Firebase
  const fetchBlogs = useCallback(async (pageNum, isInitial = false) => {
    try {
      const result = await getPublishedBlogs(pageNum, blogsPerLoad);
      if (result.success) {
        if (isInitial) {
          setDisplayedBlogs(result.blogs);
          setHasMore(result.blogs.length === blogsPerLoad);
        } else {
          setDisplayedBlogs(prev => [...prev, ...result.blogs]);
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
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, loadMore]);

  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-900/50">
      
      {/* Hero Section with Banner Image and Text Overlay */}
      <div className="relative w-full">
        <div className="relative w-full h-[450px] md:h-[550px]">
          <div className="hidden md:block relative w-full h-full">
            <Image
              src="/blogbanner.png"
              alt="GPN Blogs Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="block md:hidden relative w-full h-full">
            <Image
              src="/blogbanner_m.png"
              alt="GPN Blogs Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <div className="max-w-2xl lg:max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red/90 backdrop-blur-sm rounded-full mb-5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs font-medium">Welcome to GPN Blogs</span>
              </div>
              <p className="text-red text-sm md:text-base font-semibold tracking-wider mb-2">
                GPN BLOGS
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 leading-tight">
                In-Depth. Insightful.
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-red mb-4 leading-tight">
                Informed.
              </h2>
              <div className="w-16 h-0.5 bg-red rounded-full mb-5"></div>
              <p className="text-white/90 text-sm md:text-base lg:text-lg mb-2 leading-relaxed max-w-md">
                Thought-provoking analysis, expert opinions, and stories that go beyond the headlines.
              </p>
              <p className="text-white/80 text-sm md:text-base lg:text-lg mb-6 leading-relaxed max-w-md">
                Stay informed with perspectives that matter from around the globe.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-7">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                  <BookOpen className="w-3 h-3 text-red" />
                  <span className="text-white text-xs">Expert Insights</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                  <TrendingUp className="w-3 h-3 text-red" />
                  <span className="text-white text-xs">Deep Analysis</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                  <Globe className="w-3 h-3 text-red" />
                  <span className="text-white text-xs">Global Perspectives</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                  <Zap className="w-3 h-3 text-red" />
                  <span className="text-white text-xs">Trending Topics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {!isLoading && displayedBlogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {displayedBlogs.map((blog, index) => (
                <BlogCard key={blog.id} post={blog} index={index} />
              ))}
            </div>

            {hasMore && (
              <div ref={loaderRef} className="flex justify-center items-center py-10 mt-8">
                {isLoadingMore ? (
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red rounded-full animate-pulse" />
                    <div className="w-3 h-3 bg-red rounded-full animate-pulse delay-150" />
                    <div className="w-3 h-3 bg-red rounded-full animate-pulse delay-300" />
                  </div>
                ) : (
                  <button
                    onClick={loadMore}
                    className="px-6 py-2 bg-red text-white rounded-full hover:bg-red-600 transition-colors font-medium shadow-md hover:shadow-lg"
                  >
                    Load More Articles
                  </button>
                )}
              </div>
            )}

            {!hasMore && displayedBlogs.length > 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  You've reached the end of our blog posts
                </p>
              </div>
            )}
          </>
        )}
        
        {!isLoading && displayedBlogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">No blog posts found</p>
          </div>
        )}
      </div>
    </div>
  );
}