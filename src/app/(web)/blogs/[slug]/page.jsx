"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Eye, Heart, Share2, Bookmark, User, Tag } from "lucide-react";

// Mock blog data - In production, fetch from Firebase
const mockBlogs = {
  "future-of-digital-news-2025": {
    id: 1,
    slug: "future-of-digital-news-2025",
    title: "The Future of Digital News: What to Expect in 2025",
    description: "Explore how AI, video content, and personalized feeds are transforming the way we consume news.",
    content: `
      <p>The digital news landscape is evolving faster than ever before. As we look ahead to 2025, several key trends are shaping the future of how we consume and interact with news content.</p>
      
      <h2>The Rise of AI-Powered Personalization</h2>
      <p>Artificial intelligence is revolutionizing news curation. Algorithms are becoming sophisticated enough to understand individual preferences while maintaining editorial standards and avoiding echo chambers.</p>
      
      <h2>Video-First Approach</h2>
      <p>Short-form video content is dominating user engagement. News platforms are investing heavily in vertical video formats optimized for mobile consumption.</p>
      
      <h2>Trust and Verification</h2>
      <p>With misinformation on the rise, news platforms are implementing robust verification systems and blockchain technology to ensure content authenticity.</p>
      
      <h2>Interactive Storytelling</h2>
      <p>Immersive experiences through AR/VR and interactive graphics are becoming mainstream, allowing readers to engage with stories in new ways.</p>
      
      <p>The future of digital news is exciting, challenging, and full of opportunities for those who adapt quickly to changing consumer behaviors.</p>
    `,
    category: "Technology",
    date: "May 15, 2024",
    readTime: 5,
    views: "12.5K",
    likes: "892",
    author: "Rajesh Kumar",
    authorBio: "Senior Technology Journalist with 10+ years of experience covering digital trends and innovations.",
    tags: ["Digital News", "AI", "Future Trends"],
    thumbnail: "/blogs/blog1.jpg",
  },
  // Add more blog data for other slugs...
};

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      const blogData = mockBlogs[slug];
      if (blogData) {
        setBlog(blogData);
      }
      setIsLoading(false);
    }, 300);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ghee dark:bg-slate-900/50 flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-ghee dark:bg-slate-900/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Blog post not found</p>
          <Link href="/blogs" className="px-6 py-2 bg-red text-white rounded-lg hover:bg-red-600 transition-colors">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-900/50 pb-16">
      
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ghee dark:from-slate-900/50 via-transparent to-transparent z-20" />
        
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
          <span className="text-6xl">📰</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-red text-white text-xs font-semibold rounded-full">
              {blog.category}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readTime} min read
            </span>
          </div>
          <div className="mb-4 flex items-start gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="mt-1 rounded-full border border-white/40 bg-white/15 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {blog.title}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{blog.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-10">
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                  isLiked ? "bg-red/10 text-red" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red/10"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-red text-red" : ""}`} />
                <span className="text-sm">{blog.likes}</span>
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-1.5 rounded-full transition-colors ${
                  isBookmarked ? "text-red" : "text-gray-400 hover:text-red"
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-red/10 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>

          {/* Description/Summary */}
          <div className="mb-8 p-5 bg-red/5 rounded-xl border-l-4 border-red">
            <p className="text-gray-700 dark:text-gray-300 italic">
              {blog.description}
            </p>
          </div>

          {/* Main Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-red prose-strong:text-gray-900 dark:prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-8 p-5 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                {blog.author.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{blog.author}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{blog.authorBio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red text-white rounded-full hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
