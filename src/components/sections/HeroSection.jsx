"use client";

import { Play, Eye, Clock } from "lucide-react";

export default function HeroSection() {
  const mainStory = {
    id: 1,
    title: "New Satellite Network To Transform Global Communications",
    description: "The next-generation satellite system promises faster internet, broader coverage, and reliable connections worldwide.",
    category: "TOP STORY",
  };

  const latestVideos = [
    {
      id: 2,
      title: "Global Markets Update: What You Need to Know Today",
      live: true,
      viewers: "2.4K",
    },
    {
      id: 3,
      title: "Breakthrough in AI: New Model Surpasses Human Limits",
      views: "12.2K",
      duration: "12:45",
    },
    {
      id: 4,
      title: "Inside the World's Most Advanced Electric Car",
      views: "9.8K",
      duration: "08:32",
    },
    {
      id: 5,
      title: "Heavy Rains Cause Flooding in Several Cities",
      views: "4.6K",
      duration: "03:15",
    },
  ];

  return (
    <section className="py-2 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Main Story */}
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg">
              {/* Main Image Placeholder */}
              <div className="relative h-[400px] md:h-[550px] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red/20 flex items-center justify-center">
                    <Play className="w-10 h-10 text-red" />
                  </div>
                  <p className="text-gray-400">Main Story Image</p>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-red uppercase tracking-wider">
                    {mainStory.category}
                  </span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    5 min read
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                  {mainStory.title}
                </h1>
                <p className="text-gray-200 text-sm md:text-base mb-4 line-clamp-2">
                  {mainStory.description}
                </p>
                <button className="px-5 py-2 bg-red hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors">
                  Read Full Story →
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Latest Videos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Latest Videos
              </h2>
              <button className="text-sm text-red hover:text-red-600 font-medium">
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {latestVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="group flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative w-28 h-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 overflow-hidden">
                    {video.live && (
                      <div className="absolute top-1 left-1 z-10 flex items-center gap-1 bg-red text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}
                    {video.duration && (
                      <div className="absolute bottom-1 right-1 z-10 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                        {video.duration}
                      </div>
                    )}
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white/50 group-hover:text-red transition-colors" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-red transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {video.live ? (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{video.viewers} watching</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{video.views} views</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}