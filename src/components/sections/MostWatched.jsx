"use client";

import { Eye, TrendingUp } from "lucide-react";

const mostWatched = [
  {
    id: 1,
    rank: 1,
    title: "Global Markets Update: What You Need to Know Today",
    views: "2.4K",
    timeAgo: "2h ago",
    image: "/images/watched1.jpg",
  },
  {
    id: 2,
    rank: 2,
    title: "Inside the World's Most Advanced Electric Car",
    views: "1.9K",
    timeAgo: "3h ago",
    image: "/images/watched2.jpg",
  },
  {
    id: 3,
    rank: 3,
    title: "Historic Win for India in T20 World Cup",
    views: "1.7K",
    timeAgo: "4h ago",
    image: "/images/watched3.jpg",
  },
  {
    id: 4,
    rank: 4,
    title: "AI Breakthrough: New Model Surpasses Human Limits",
    views: "1.5K",
    timeAgo: "5h ago",
    image: "/images/watched4.jpg",
  },
  {
    id: 5,
    rank: 5,
    title: "Top 10 Travel Destinations for 2024",
    views: "1.4K",
    timeAgo: "6h ago",
    image: "/images/watched5.jpg",
  },
];

export default function MostWatched() {
  return (
    <div>
      {/* Section Header with Red Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-red rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Most Watched
        </h2>
        <TrendingUp className="w-5 h-5 text-red" />
      </div>

      {/* Most Watched List */}
      <div className="space-y-3">
        {mostWatched.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            {/* Rank Number */}
            <div className="flex-shrink-0 w-10 text-center">
              <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 group-hover:text-red transition-colors">
                {item.rank.toString().padStart(2, "0")}
              </span>
            </div>

            {/* Thumbnail */}
            <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Img</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{item.views} views</span>
                </div>
                <span>•</span>
                <span>{item.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}