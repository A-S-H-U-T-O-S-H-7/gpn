"use client";

import { useState } from "react";
import { Flame, Eye, Clock, ChevronDown, ChevronUp } from "lucide-react";

const allTrendingNews = [
  {
    id: 1,
    title: "World Leaders Meet to Discuss Climate Action and Sustainability",
    category: "WORLD",
    timeAgo: "2h ago",
    views: "1.8K",
    image: "/images/trending1.jpg",
  },
  {
    id: 2,
    title: "AI Breakthrough: New Chip Changes Everything",
    category: "TECHNOLOGY",
    timeAgo: "3h ago",
    views: "3.2K",
    image: "/images/trending2.jpg",
  },
  {
    id: 3,
    title: "India Wins Thriller in World Cup Super Over",
    category: "SPORTS",
    timeAgo: "4h ago",
    views: "3.1K",
    image: "/images/trending3.jpg",
  },
  {
    id: 4,
    title: "Global Markets Rally as Inflation Concerns Ease",
    category: "BUSINESS",
    timeAgo: "6h ago",
    views: "1.8K",
    image: "/images/trending4.jpg",
  },
  {
    id: 5,
    title: "New Movie Breaks Box Office Records Worldwide",
    category: "ENTERTAINMENT",
    timeAgo: "6h ago",
    views: "2.7K",
    image: "/images/trending5.jpg",
  },
  {
    id: 6,
    title: "Revolutionary Medical Breakthrough Announced",
    category: "HEALTH",
    timeAgo: "8h ago",
    views: "2.1K",
    image: "/images/trending6.jpg",
  },
  {
    id: 7,
    title: "Electric Vehicle Sales Hit Record High in 2024",
    category: "AUTOMOTIVE",
    timeAgo: "10h ago",
    views: "1.5K",
    image: "/images/trending7.jpg",
  },
  {
    id: 8,
    title: "SpaceX Announces Historic Mars Mission Timeline",
    category: "SPACE",
    timeAgo: "12h ago",
    views: "4.2K",
    image: "/images/trending8.jpg",
  },
  {
    id: 9,
    title: "New Study Reveals Benefits of Mediterranean Diet",
    category: "HEALTH",
    timeAgo: "14h ago",
    views: "1.2K",
    image: "/images/trending9.jpg",
  },
  {
    id: 10,
    title: "Cryptocurrency Markets Surge After Regulatory Clarity",
    category: "BUSINESS",
    timeAgo: "15h ago",
    views: "2.9K",
    image: "/images/trending10.jpg",
  },
  {
    id: 11,
    title: "Hollywood Stars Unite for Climate Change Documentary",
    category: "ENTERTAINMENT",
    timeAgo: "18h ago",
    views: "1.7K",
    image: "/images/trending11.jpg",
  },
  {
    id: 12,
    title: "5G Technology Reaches Remote Areas of the World",
    category: "TECHNOLOGY",
    timeAgo: "20h ago",
    views: "2.3K",
    image: "/images/trending12.jpg",
  },
];

export default function TrendingSection() {
  const [showAll, setShowAll] = useState(false);
  
  // Show 8 cards initially, all cards when showAll is true
  const displayedNews = showAll ? allTrendingNews : allTrendingNews.slice(0, 8);

  return (
    <section className="py-10 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-red fill-red" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Trending Now
            </h2>
            <span className="px-2 py-1 bg-red/10 text-red text-xs font-semibold rounded-full">
              {allTrendingNews.length} Stories
            </span>
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 px-4 py-2 text-sm text-red hover:text-red-600 font-medium rounded-lg hover:bg-red/10 transition-colors"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View All
              </>
            )}
          </button>
        </div>

        {/* Trending Grid - 4 cards per row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedNews.map((news, index) => (
            <div
              key={news.id}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-44 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Image</span>
                </div>
                {/* Trending Rank Badge */}
                <div className="absolute top-3 left-3 w-7 h-7 bg-red text-white font-bold rounded-md flex items-center justify-center text-xs shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                {/* Category */}
                <div className="inline-block px-2 py-0.5 bg-red/10 text-red text-xs font-semibold rounded mb-2">
                  {news.category}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red transition-colors">
                  {news.title}
                </h3>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{news.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{news.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expand/Collapse Animation Notice */}
        {showAll && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(false)}
              className="inline-flex items-center gap-1 px-5 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
              Collapse
            </button>
          </div>
        )}
      </div>
    </section>
  );
}