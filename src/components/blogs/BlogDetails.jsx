"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Calendar, Clock, Eye, Heart, Share2, Bookmark, Tag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getPublishedBlogBySlug, incrementBlogView } from "@/lib/services/blogService";

/* ─── helpers ─────────────────────────────────────────────────── */

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function formatViews(views) {
  if (!views) return "0";
  if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M";
  if (views >= 1_000) return (views / 1_000).toFixed(1) + "K";
  return views.toString();
}

function getCategoryEmoji(category) {
  const map = {
    Technology: "💻", Development: "🛠️", Opinion: "💭",
    Strategy: "🎯", SEO: "📈", Design: "🎨", Business: "💼",
  };
  return map[category] ?? "📰";
}

function getGradient(category) {
  const map = {
    Technology: "from-blue-700 via-blue-600 to-cyan-500",
    Development: "from-slate-800 via-slate-700 to-slate-600",
    Opinion: "from-purple-700 via-purple-600 to-pink-500",
    Strategy: "from-emerald-700 via-emerald-600 to-teal-500",
    SEO: "from-amber-600 via-yellow-500 to-amber-400",
    Design: "from-rose-700 via-rose-600 to-pink-500",
    Business: "from-indigo-700 via-indigo-600 to-blue-500",
  };
  return map[category] ?? "from-red-700 via-red-600 to-orange-500";
}

/* ─── component ───────────────────────────────────────────────── */

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const result = await getPublishedBlogBySlug(slug);
        if (result.success && result.blog) {
          setBlog(result.blog);
          const hasViewed = sessionStorage.getItem(`blog_viewed_${result.blog.id}`);
          if (!hasViewed && result.blog.id) {
            await incrementBlogView(result.blog.id);
            sessionStorage.setItem(`blog_viewed_${result.blog.id}`, "true");
            setBlog((prev) => ({ ...prev, views: (prev?.views || 0) + 1 }));
          }
        } else {
          toast.error("Blog not found");
          router.push("/blogs");
        }
      } catch {
        toast.error("Failed to load blog");
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug, router]);

  /* ── loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f5] dark:bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-2">
          {[0, 150, 300].map((d) => (
            <div
              key={d}
              className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ── 404 ── */
  if (!blog) {
    return (
      <div className="min-h-screen bg-[#f8f7f5] dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">404</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Blog post not found</p>
          <Link
            href="/blogs"
            className="px-6 py-2.5 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const categoryEmoji = getCategoryEmoji(blog.category);
  const gradient = getGradient(blog.category);
  const hasImage = (blog.coverImage || blog.image) && !imgError;
  const imageUrl = blog.coverImage || blog.image;

  return (
    <div className="min-h-screen bg-[#f8f7f5] dark:bg-slate-950 pb-20">

      {/* ══════════════════════════════════════════
          HERO  — full-bleed image OR gradient card
      ══════════════════════════════════════════ */}
      <div className="relative w-full">

        {hasImage ? (
          /* ── IMAGE HERO ── */
          <div className="relative w-full" style={{ height: "clamp(320px, 55vh, 560px)" }}>
            {/* Actual blog image, fully visible */}
            <Image
              src={imageUrl}
              alt={blog.title}
              fill
              priority
              fetchPriority="high"
              loading="eager"
              sizes="100vw"
              className="object-cover object-center"
              onError={() => setImgError(true)}
            />
            {/* Bottom scrim so text is always readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

            {/* Back button — floated top-left */}
            <div className="absolute top-5 left-4 sm:left-6 lg:left-10 z-20">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  bg-black/40 border border-white/20 text-white text-sm font-medium
                  backdrop-blur-md hover:bg-black/60 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            {/* Text anchored to bottom of image */}
            <div className="absolute inset-x-0 bottom-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-8 pt-16">
                {/* chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    <span>{categoryEmoji}</span>
                    <span>{blog.category}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-xs rounded-full border border-white/20">
                    <Clock className="w-3 h-3" />
                    {blog.readTime} min read
                  </span>
                </div>
                {/* title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-white leading-tight max-w-4xl mb-4 drop-shadow-lg">
                  {blog.title}
                </h1>
                {/* meta */}
                <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-red-600 border-2 border-white/30 flex items-center justify-center text-white font-bold text-xs">
                      {blog.author?.charAt(0) ?? "G"}
                    </div>
                    <span className="font-medium text-white">{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(blog.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{formatViews(blog.views)} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        ) : (
          /* ── GRADIENT HERO (no image) ── */
          <div className={`relative overflow-hidden bg-gradient-to-br ${gradient}`}
               style={{ minHeight: "clamp(280px, 45vh, 480px)" }}>
            {/* dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.13]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            />
            {/* big faint emoji watermark */}
            <div className="absolute inset-0 flex items-center justify-end pr-10 pointer-events-none select-none overflow-hidden">
              <span
                className="opacity-[0.08] font-bold leading-none"
                style={{ fontSize: "clamp(180px, 28vw, 340px)" }}
                aria-hidden
              >
                {categoryEmoji}
              </span>
            </div>
            {/* bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f8f7f5] dark:from-slate-950 to-transparent" />

            {/* Back button */}
            <div className="absolute top-5 left-4 sm:left-6 lg:left-10 z-20">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  bg-white/15 border border-white/25 text-white text-sm font-medium
                  backdrop-blur-sm hover:bg-white/25 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            {/* Text */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-20">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  <span>{categoryEmoji}</span>
                  <span>{blog.category}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm text-white/90 text-xs rounded-full">
                  <Clock className="w-3 h-3" />
                  {blog.readTime} min read
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-4xl mb-5">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/75 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-xs">
                    {blog.author?.charAt(0) ?? "G"}
                  </div>
                  <span className="font-medium text-white/90">{blog.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(blog.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{formatViews(blog.views)} views</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT  — max-w-7xl
      ══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Article body ── */}
          <article className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">

              {/* Action bar */}
              <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-gray-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      isLiked
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                        : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 hover:text-red-600"
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    <span>{formatViews(blog.views)}</span>
                  </button>

                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    title="Bookmark"
                    className={`p-2 rounded-full border transition-all ${
                      isBookmarked
                        ? "bg-red-50 dark:bg-red-900/20 text-red-500 border-red-200 dark:border-red-800"
                        : "bg-gray-50 dark:bg-slate-800 text-gray-400 border-gray-200 dark:border-slate-700 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-red-500" : ""}`} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-sm text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-200 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Article content area */}
              <div className="px-6 md:px-10 py-8">

                {/* Summary callout */}
                <div className="mb-8 p-5 bg-red-50 dark:bg-red-900/10 rounded-xl border-l-4 border-red-500">
                  <p className="text-gray-700 dark:text-gray-300 italic text-[15px] leading-relaxed">
                    {blog.description}
                  </p>
                </div>

                

                {/* HTML content */}
                <div
                  className="
                    prose prose-base md:prose-lg max-w-none
                    prose-headings:font-extrabold prose-headings:text-gray-900 dark:prose-headings:text-white
                    prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3 prose-h2:border-b prose-h2:border-gray-100 dark:prose-h2:border-slate-700/60 prose-h2:pb-2
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-[1.85]
                    prose-a:text-red-600 dark:prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-img:rounded-xl prose-img:shadow-md
                    prose-ul:pl-5 prose-ol:pl-5
                    prose-li:text-gray-700 dark:prose-li:text-gray-300
                    prose-blockquote:border-red-500 prose-blockquote:bg-red-50 dark:prose-blockquote:bg-red-900/10 prose-blockquote:rounded-r-lg prose-blockquote:py-1
                  "
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags?.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-700/60">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Tag className="w-3 h-3" /> Topics
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs rounded-full font-medium hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author bio */}
                <div className="mt-10 p-5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                    Written by
                  </p>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-sm ring-2 ring-red-100 dark:ring-red-900/30">
                      {blog.author?.charAt(0) ?? "G"}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{blog.author}</h4>
                      <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        {blog.authorBio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to blogs */}
            <div className="mt-8 text-center">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-7 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all blogs
              </Link>
            </div>
          </article>

          {/* ── Sidebar (desktop only) ── */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
            <div className="sticky top-6 space-y-4">

              {/* Article stats */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                  Article Info
                </p>
                <dl className="space-y-3.5">
                  {[
                    { icon: <Calendar className="w-3.5 h-3.5" />, label: "Published", value: formatDate(blog.date) },
                    { icon: <Clock className="w-3.5 h-3.5" />, label: "Read time", value: `${blog.readTime} min` },
                    { icon: <Eye className="w-3.5 h-3.5" />, label: "Views", value: formatViews(blog.views) },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <dt className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500">
                        {icon} {label}
                      </dt>
                      <dd className="font-semibold text-gray-800 dark:text-gray-200">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Category pill */}
              <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white relative overflow-hidden shadow-sm`}>
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                  }}
                />
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2 relative">Category</p>
                <p className="relative flex items-center gap-2 text-xl font-extrabold">
                  <span>{categoryEmoji}</span>
                  <span>{blog.category}</span>
                </p>
              </div>

              {/* Share */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                  Share article
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Copy link
                </button>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}