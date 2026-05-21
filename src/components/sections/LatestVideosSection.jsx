"use client";

import { useState } from "react";
import { Play, Eye, Calendar, TrendingUp, Clock, Heart, Share2, ChevronDown } from "lucide-react";

// Mock video data - 25+ videos
const allVideos = [
  {
    id: 1,
    title: "New Satellite Network To Transform Global Communications",
    duration: "12:45",
    views: "12.5K",
    date: "2 hours ago",
    category: "Technology",
    likes: "1.2K",
  },
  {
    id: 2,
    title: "Global Markets Update: What You Need to Know Today",
    duration: "08:23",
    views: "8.4K",
    date: "3 hours ago",
    category: "Business",
    likes: "892",
  },
  {
    id: 3,
    title: "Breakthrough in AI: New Model Surpasses Human Limits",
    duration: "15:30",
    views: "22.1K",
    date: "5 hours ago",
    category: "Technology",
    likes: "3.4K",
  },
  {
    id: 4,
    title: "Inside the World's Most Advanced Electric Car",
    duration: "10:15",
    views: "6.2K",
    date: "6 hours ago",
    category: "Automotive",
    likes: "567",
  },
  {
    id: 5,
    title: "Heavy Rain Causes Flooding in Several Cities",
    duration: "03:45",
    views: "4.8K",
    date: "8 hours ago",
    category: "Weather",
    likes: "234",
  },
  {
    id: 6,
    title: "SpaceX Launches Next-Gen Satellite Network",
    duration: "18:20",
    views: "15.3K",
    date: "10 hours ago",
    category: "Space",
    likes: "2.1K",
  },
  {
    id: 7,
    title: "India's New Education Policy 2024: Key Highlights",
    duration: "07:50",
    views: "3.9K",
    date: "12 hours ago",
    category: "India",
    likes: "456",
  },
  {
    id: 8,
    title: "Global Climate Summit Reaches Historic Agreement",
    duration: "14:30",
    views: "9.7K",
    date: "14 hours ago",
    category: "World",
    likes: "1.1K",
  },
  {
    id: 9,
    title: "Revolutionary Quantum Computing Breakthrough",
    duration: "11:15",
    views: "5.2K",
    date: "16 hours ago",
    category: "Technology",
    likes: "789",
  },
  {
    id: 10,
    title: "Top 10 Travel Destinations for 2024",
    duration: "09:40",
    views: "7.8K",
    date: "18 hours ago",
    category: "Travel",
    likes: "1.5K",
  },
  {
    id: 11,
    title: "Electric Vehicle Sales Hit Record High",
    duration: "06:25",
    views: "4.1K",
    date: "20 hours ago",
    category: "Automotive",
    likes: "345",
  },
  {
    id: 12,
    title: "New Study Reveals Benefits of Mediterranean Diet",
    duration: "08:15",
    views: "3.2K",
    date: "22 hours ago",
    category: "Health",
    likes: "678",
  },
  {
    id: 13,
    title: "Cryptocurrency Markets Surge After Regulatory Clarity",
    duration: "12:30",
    views: "11.4K",
    date: "1 day ago",
    category: "Business",
    likes: "1.8K",
  },
  {
    id: 14,
    title: "Hollywood Stars Unite for Climate Documentary",
    duration: "05:50",
    views: "2.8K",
    date: "1 day ago",
    category: "Entertainment",
    likes: "423",
  },
  {
    id: 15,
    title: "5G Technology Reaches Remote Areas",
    duration: "07:20",
    views: "6.7K",
    date: "1 day ago",
    category: "Technology",
    likes: "901",
  },
  {
    id: 16,
    title: "New Movie Breaks Box Office Records",
    duration: "04:35",
    views: "18.2K",
    date: "1 day ago",
    category: "Entertainment",
    likes: "2.3K",
  },
  {
    id: 17,
    title: "World Leaders Meet for Peace Talks",
    duration: "22:15",
    views: "9.3K",
    date: "2 days ago",
    category: "World",
    likes: "1.4K",
  },
  {
    id: 18,
    title: "Revolutionary Medical Device Approved",
    duration: "13:40",
    views: "5.6K",
    date: "2 days ago",
    category: "Health",
    likes: "678",
  },
  {
    id: 19,
    title: "Space Tourism Takes Off",
    duration: "09:55",
    views: "21.4K",
    date: "2 days ago",
    category: "Space",
    likes: "3.1K",
  },
  {
    id: 20,
    title: "New Smartphone Revolutionizes Mobile Photography",
    duration: "11:30",
    views: "14.7K",
    date: "2 days ago",
    category: "Technology",
    likes: "2.2K",
  },
  {
    id: 21,
    title: "Sustainable Fashion Trends 2024",
    duration: "06:50",
    views: "3.1K",
    date: "3 days ago",
    category: "Lifestyle",
    likes: "567",
  },
  {
    id: 22,
    title: "New Species Discovered in Amazon",
    duration: "08:25",
    views: "7.2K",
    date: "3 days ago",
    category: "Science",
    likes: "1.1K",
  },
  {
    id: 23,
    title: "Stock Market Hits All-Time High",
    duration: "10:15",
    views: "19.8K",
    date: "3 days ago",
    category: "Business",
    likes: "2.7K",
  },
  {
    id: 24,
    title: "New Album Breaks Streaming Records",
    duration: "04:20",
    views: "8.9K",
    date: "4 days ago",
    category: "Entertainment",
    likes: "1.3K",
  },
  {
    id: 25,
    title: "AI Powered Robots Transform Manufacturing",
    duration: "16:45",
    views: "12.3K",
    date: "4 days ago",
    category: "Technology",
    likes: "1.9K",
  },
];

export default function LatestVideosSection() {
  const [visibleCount, setVisibleCount] = useState(20);
  const displayedVideos = allVideos.slice(0, visibleCount);
  const hasMore = visibleCount < allVideos.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <section className="py-10 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Red Bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-red rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Latest Videos
            </h2>
            <div className="flex items-center gap-1 px-3 py-1 bg-red/10 rounded-full">
              <Clock className="w-3 h-3 text-red" />
              <span className="text-xs text-red font-semibold">Fresh Uploads</span>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {allVideos.length}+ videos this week
          </div>
        </div>

        {/* Video Grid - 5 cards per row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {displayedVideos.map((video, index) => (
            <div
              key={video.id}
              className="group relative"
            >
              {/* Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                
                {/* Thumbnail Container */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden relative">
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red/90 hover:bg-red flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-300">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                      {video.duration}
                    </div>
                    
                    {/* Trending Badge for top videos */}
                    {index < 3 && (
                      <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-md">
                        <TrendingUp className="w-2.5 h-2.5" />
                        <span>Trending</span>
                      </div>
                    )}

                    {/* Thumbnail Placeholder */}
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                      🎬
                    </div>
                  </div>

                  {/* Category Chip - Floating */}
                  <div className="absolute -bottom-2 left-2">
                    <span className="px-2 py-0.5 bg-red text-white text-[10px] font-semibold rounded-full shadow-md">
                      {video.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-2.5 pt-3">
                  {/* Title */}
                  <h3 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-red transition-colors min-h-[36px]">
                    {video.title}
                  </h3>
                  
                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" />
                      <span>{video.views}</span>
                    </div>
                    <div className="w-0.5 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>{video.date.split(" ")[0]}</span>
                    </div>
                    <div className="w-0.5 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5" />
                      <span>{video.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={loadMore}
              className="group inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-900 border-2 border-red text-red hover:bg-red hover:text-white font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>See More Videos</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              Showing {displayedVideos.length} of {allVideos.length} videos
            </p>
          </div>
        )}
      </div>
    </section>
  );
}