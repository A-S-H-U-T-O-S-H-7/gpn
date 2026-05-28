"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Eye, Heart, Share2, Bookmark, User, Tag } from "lucide-react";
import { toast } from "react-hot-toast";
import { getPublishedBlogBySlug, incrementBlogView } from "@/lib/services/blogService";

function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatViews(views) {
  if (!views) return '0';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
}

function getCategoryEmoji(category) {
  const emojis = {
    "Technology": "💻",
    "Development": "🛠️",
    "Opinion": "💭",
    "Strategy": "🎯",
    "SEO": "📈",
    "Design": "🎨",
    "Business": "💼",
    "Default": "📰"
  };
  return emojis[category] || emojis.Default;
}

function getGradient(category) {
  const gradients = {
    "Technology": "from-blue-600 to-cyan-500",
    "Development": "from-gray-700 to-gray-600",
    "Opinion": "from-purple-600 to-pink-500",
    "Strategy": "from-emerald-600 to-teal-500",
    "SEO": "from-yellow-600 to-amber-500",
    "Design": "from-rose-600 to-pink-500",
    "Business": "from-indigo-600 to-blue-500",
    "Default": "from-red-600 to-orange-500"
  };
  return gradients[category] || gradients.Default;
}

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const result = await getPublishedBlogBySlug(slug);
        if (result.success && result.blog) {
          setBlog(result.blog);
          
          // Increment view count
          const hasViewed = sessionStorage.getItem(`blog_viewed_${result.blog.id}`);
          if (!hasViewed && result.blog.id) {
            await incrementBlogView(result.blog.id);
            sessionStorage.setItem(`blog_viewed_${result.blog.id}`, 'true');
            setBlog(prev => ({ ...prev, views: (prev?.views || 0) + 1 }));
          }
        } else {
          toast.error("Blog not found");
          router.push("/blogs");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) fetchBlog();
  }, [slug, router]);

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
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Blog post not found</p>
          <Link href="/blogs" className="px-6 py-2 bg-red text-white rounded-lg hover:bg-red-600 transition-colors">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const categoryEmoji = getCategoryEmoji(blog.category);
  const gradient = getGradient(blog.category);

  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-900/50 pb-16">
      
      {/* Hero Section */}
      <div className={`relative h-[50vh] md:h-[55vh] overflow-hidden bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ghee dark:from-slate-900/50 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[200px] md:text-[300px]">{categoryEmoji}</span>
        </div>

        <div className="relative z-20 h-full flex flex-col justify-end max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <span>{categoryEmoji}</span>
              <span>{blog.category}</span>
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
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                {blog.author.charAt(0)}
              </div>
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{formatViews(blog.views)} views</span>
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
                <span className="text-sm">{formatViews(blog.views)}</span>
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
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-red/10 transition-colors"
            >
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
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

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