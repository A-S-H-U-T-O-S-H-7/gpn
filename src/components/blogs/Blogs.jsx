"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import BlogCard from "./BlogCard";
import { Sparkles, TrendingUp, Globe, Zap, BookOpen, ChevronRight } from "lucide-react";

// Mock Blog Data
const allBlogs = [
  {
    id: 1,
    slug: "future-of-digital-news-2025",
    title: "The Future of Digital News: What to Expect in 2025",
    description: "Explore how AI, video content, and personalized feeds are transforming the way we consume news.",
    date: "May 15, 2024",
    readTime: 5,
    author: "Rajesh Kumar",
  },
  {
    id: 2,
    slug: "how-to-build-news-platform",
    title: "How to Build a Modern News Platform from Scratch",
    description: "Complete guide to building a scalable, video-first news platform with Next.js and Firebase.",
    date: "May 12, 2024",
    readTime: 8,
    author: "Priya Sharma",
  },
  {
    id: 3,
    slug: "journalism-ethics-ai-era",
    title: "Journalism Ethics in the Age of AI",
    description: "Understanding the importance of ethical journalism when using AI tools for news generation.",
    date: "May 10, 2024",
    readTime: 6,
    author: "Amit Verma",
  },
  {
    id: 4,
    slug: "video-content-strategy-news",
    title: "Why Video Content is Dominating News Platforms",
    description: "Analyzing the shift from text-based to video-first news consumption and how to adapt.",
    date: "May 8, 2024",
    readTime: 4,
    author: "Neha Gupta",
  },
  {
    id: 5,
    slug: "seo-optimization-news-sites",
    title: "SEO Optimization for News Websites: Best Practices 2024",
    description: "Learn the latest SEO techniques to improve your news site's visibility and ranking.",
    date: "May 5, 2024",
    readTime: 7,
    author: "Vikram Singh",
  },
  {
    id: 6,
    slug: "mobile-first-news-design",
    title: "Mobile-First Design: Creating News Experiences for Smartphones",
    description: "Design principles and patterns for building exceptional mobile news experiences.",
    date: "May 3, 2024",
    readTime: 6,
    author: "Rajesh Kumar",
  },
  {
    id: 7,
    slug: "monetizing-digital-news",
    title: "Monetization Strategies for Digital News Platforms",
    description: "Exploring subscription models, ads, and premium content strategies for news sites.",
    date: "April 30, 2024",
    readTime: 9,
    author: "Priya Sharma",
  },
  {
    id: 8,
    slug: "breaking-news-workflow",
    title: "Managing Breaking News: Efficient Workflow for Newsrooms",
    description: "How modern newsrooms handle breaking news with speed and accuracy.",
    date: "April 28, 2024",
    readTime: 5,
    author: "Amit Verma",
  },
  {
    id: 9,
    slug: "ai-news-generation-tools",
    title: "Top AI Tools for News Generation and Curation",
    description: "Review of the best AI tools helping journalists create content faster.",
    date: "April 25, 2024",
    readTime: 7,
    author: "Neha Gupta",
  },
  {
    id: 10,
    slug: "newsletter-growth-strategies",
    title: "Growing Your News Newsletter: Strategies That Work",
    description: "Proven tactics to build and monetize a loyal newsletter audience.",
    date: "April 22, 2024",
    readTime: 6,
    author: "Vikram Singh",
  },
  {
    id: 11,
    slug: "data-journalism-examples",
    title: "Data Journalism: Telling Stories with Numbers",
    description: "How data-driven stories are changing journalism and engaging readers.",
    date: "April 20, 2024",
    readTime: 8,
    author: "Rajesh Kumar",
  },
  {
    id: 12,
    slug: "social-media-news-distribution",
    title: "Social Media Strategies for News Distribution",
    description: "Best practices for sharing news content across social platforms.",
    date: "April 18, 2024",
    readTime: 5,
    author: "Priya Sharma",
  },
];

export default function BlogsPage() {
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const loaderRef = useRef(null);
  const blogsPerLoad = 8;

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedBlogs(allBlogs.slice(0, blogsPerLoad));
      setHasMore(allBlogs.length > blogsPerLoad);
      setIsLoading(false);
    }, 500);
  }, []);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      const currentCount = displayedBlogs.length;
      const newBlogs = allBlogs.slice(currentCount, currentCount + blogsPerLoad);
      
      setDisplayedBlogs(prev => [...prev, ...newBlogs]);
      setHasMore(currentCount + newBlogs.length < allBlogs.length);
      setIsLoadingMore(false);
    }, 500);
  }, [displayedBlogs.length, hasMore, isLoadingMore]);

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
        {/* Background Image */}
        <div className="relative w-full h-[450px] md:h-[550px] ">
          {/* Desktop Banner - hidden on mobile */}
          <div className="hidden md:block relative w-full h-full">
            <Image
              src="/blogbanner.png"
              alt="GPN Blogs Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Mobile Banner - visible only on mobile */}
          <div className="block md:hidden relative w-full h-full">
            <Image
              src="/blogbanner_m.png"
              alt="GPN Blogs Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>

        {/* Text Content - Left Side */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <div className="max-w-2xl lg:max-w-xl">
              {/* Small badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red/90 backdrop-blur-sm rounded-full mb-5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs font-medium">Welcome to GPN Blogs</span>
              </div>
              
              {/* GPN Blogs - Small red text */}
              <p className="text-red text-sm md:text-base font-semibold tracking-wider mb-2">
                GPN BLOGS
              </p>
              
              {/* Main Title - Line 1: In-Depth. Insightful. */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 leading-tight">
                In-Depth. Insightful.
              </h1>
              
              {/* Main Title - Line 2: Informed in Red */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-red mb-4 leading-tight">
                Informed.
              </h2>
              
              {/* Separator Line */}
              <div className="w-16 h-0.5 bg-red rounded-full mb-5"></div>
              
              {/* Subtext - Two lines */}
              <p className="text-white/90 text-sm md:text-base lg:text-lg mb-2 leading-relaxed max-w-md">
                Thought-provoking analysis, expert opinions, and stories that go beyond the headlines.
              </p>
              <p className="text-white/80 text-sm md:text-base lg:text-lg mb-6 leading-relaxed max-w-md">
                Stay informed with perspectives that matter from around the globe.
              </p>
              
              {/* Feature Tags */}
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
              
              {/* CTA Button */}
              
            </div>
          </div>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Blog Grid - 4 columns */}
        {!isLoading && displayedBlogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {displayedBlogs.map((blog, index) => (
                <BlogCard key={blog.id} post={blog} index={index} />
              ))}
            </div>

            {/* Load More Trigger */}
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

            {/* End Message */}
            {!hasMore && displayedBlogs.length > 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  You've reached the end of our blog posts
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}