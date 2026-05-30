"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const gradients = [
  "from-red-500 to-orange-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-pink-500",
  "from-yellow-500 to-amber-500",
  "from-indigo-500 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-teal-500 to-green-500",
];

const emojis = ["📰", "📝", "💡", "🚀", "💼", "🎯", "📊", "🎨", "💻", "📱", "🔍", "⭐"];

const formatDate = (dateInput) => {
  if (!dateInput) return "Recent";
  try {
    if (typeof dateInput === "string") {
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
      return dateInput;
    }
    if (dateInput instanceof Date) {
      return dateInput.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    if (dateInput?.toDate) {
      return dateInput.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return "Recent";
  } catch {
    return "Recent";
  }
};

export default function BlogCard({ post, index }) {
  const gradient = gradients[(post.id?.length || index) % gradients.length];
  const emoji = emojis[(post.id?.length || index) % emojis.length];
  const displayDate = formatDate(post.date || post.formattedDate);

  return (
    <Link href={`/blogs/${post.slug}`} className="block h-full">
      <article
        className="group relative flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden
          border border-gray-200 dark:border-slate-700
          shadow-sm hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900
          transition-all duration-400 hover:-translate-y-1.5"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {/* Thumbnail */}
        <div className={`relative h-44 shrink-0 overflow-hidden bg-gradient-to-br ${gradient}`}>
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          {/* Subtle shine sweep on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-10" />

          <div className="absolute inset-0 flex items-center justify-center">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl transform group-hover:scale-110 transition-transform duration-500 select-none">
                {emoji}
              </span>
            )}
          </div>

          {/* Category chip */}
          {post.category && (
            <div className="absolute top-3 left-3 z-20 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
              <span className="text-white text-[10px] font-semibold uppercase tracking-wider">
                {post.category}
              </span>
            </div>
          )}

          {/* Read time */}
          <div className="absolute bottom-3 left-3 z-20 bg-black/55 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-white/80" />
            <span className="text-white text-[11px] font-medium">{post.readTime || 5} min</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          {/* Title */}
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 dark:text-gray-400 text-[13px] leading-relaxed mb-3 line-clamp-2 flex-1">
            {post.description}
          </p>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-slate-700/70 pt-3 mt-auto">
            {/* Meta row */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{displayDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
                  {post.author?.charAt(0) || "G"}
                </div>
                <span className="font-medium text-gray-600 dark:text-gray-400 truncate max-w-[90px]">
                  {post.author || "GPN Editor"}
                </span>
              </div>
            </div>

            {/* Read more */}
            <div className="flex items-center gap-1 text-red-500 dark:text-red-400 text-[12px] font-semibold group-hover:gap-2 transition-all duration-200">
              <span>Read More</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}