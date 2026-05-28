"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// Colorful gradients for blog thumbnails
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

// Emojis for blog thumbnails
const emojis = ["📰", "📝", "💡", "🚀", "💼", "🎯", "📊", "🎨", "💻", "📱", "🔍", "⭐"];

// Helper function to safely format date
const formatDate = (dateInput) => {
  if (!dateInput) return 'Recent';
  
  try {
    // If it's already a string, use it directly
    if (typeof dateInput === 'string') {
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
      return dateInput;
    }
    
    // If it's a Date object
    if (dateInput instanceof Date) {
      return dateInput.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    
    // If it's a timestamp or Firestore timestamp
    if (dateInput?.toDate) {
      return dateInput.toDate().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    
    return 'Recent';
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Recent';
  }
};

export default function BlogCard({ post, index }) {
  const gradient = gradients[(post.id?.length || index) % gradients.length];
  const emoji = emojis[(post.id?.length || index) % emojis.length];
  
  // Safely get formatted date
  const displayDate = formatDate(post.date || post.formattedDate);

  return (
    <Link href={`/blogs/${post.slug}`}>
      <div 
        className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Thumbnail - Gradient + Emoji */}
        <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${gradient}`}>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl transform group-hover:scale-110 transition-transform duration-500">
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                emoji
              )}
            </span>
          </div>
          {/* Read Time Badge */}
          <div className="absolute bottom-3 left-3 z-20 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-white" />
            <span className="text-white text-xs">{post.readTime || 5} min read</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red transition-colors">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {post.description}
          </p>

          {/* Meta Info - Only Date and Author */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{displayDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-[10px] font-bold">
                {post.author?.charAt(0) || 'G'}
              </div>
              <span className="text-xs font-medium">{post.author || 'GPN Editor'}</span>
            </div>
          </div>

          {/* Read More Link */}
          <div className="mt-3 pt-2">
            <span className="text-red text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              Read More
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}