"use client";

import { useState } from "react";
import { 
  Play, 
  Clock, 
  Eye, 
  Calendar, 
  Tv, 
  Radio, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronRight,
  AlertCircle
} from "lucide-react";

// Mock live stream data
const liveStream = {
  isLive: true,
  title: "GPN Live News - Breaking News Coverage",
  description: "Live coverage of global events, breaking news, and real-time updates from around the world.",
  viewers: "24.5K",
  category: "News",
  quality: "1080p",
};

// TV Schedule Data
const tvSchedule = {
  current: {
    title: "Global News Live",
    timeRange: "10:00 AM - 12:00 PM",
    viewers: "24.5K",
    isLive: true,
  },
  upcoming: [
    { id: 1, title: "Business Today", timeRange: "12:00 PM - 01:00 PM", category: "Business" },
    { id: 2, title: "Sports Live", timeRange: "01:00 PM - 02:00 PM", category: "Sports" },
    { id: 3, title: "Tech Talks", timeRange: "02:00 PM - 03:00 PM", category: "Technology" },
    { id: 4, title: "World Brief", timeRange: "03:00 PM - 04:00 PM", category: "World" },
    { id: 5, title: "India Special", timeRange: "04:00 PM - 05:00 PM", category: "India" },
    { id: 6, title: "Entertainment Now", timeRange: "05:00 PM - 06:00 PM", category: "Entertainment" },
    { id: 7, title: "Health & Wellness", timeRange: "06:00 PM - 07:00 PM", category: "Health" },
    { id: 8, title: "Prime Time News", timeRange: "07:00 PM - 09:00 PM", category: "News" },
  ],
  days: ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

// Featured Videos
const featuredVideos = [
  { id: 1, title: "New Satellite Network Launch", duration: "12:45", views: "12.5K", date: "2h ago" },
  { id: 2, title: "Global Markets Update", duration: "08:23", views: "8.4K", date: "3h ago" },
  { id: 3, title: "AI Breakthrough Announcement", duration: "15:30", views: "22.1K", date: "5h ago" },
  { id: 4, title: "Electric Car Revolution", duration: "10:15", views: "6.2K", date: "6h ago" },
];

export default function LiveTVPage() {
  const [selectedDay, setSelectedDay] = useState("Today");
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLive, setIsLive] = useState(true);

  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-900/50">
      
      {/* Hero Section - Live Player */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Live Stream Player */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Video Player Area */}
            <div className="relative aspect-video bg-black">
              {/* YouTube Embed Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 rounded-full bg-red/30 animate-ping"></div>
                    <div className="relative flex items-center gap-2 px-4 py-2 bg-red rounded-full">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      <span className="text-white text-sm font-bold">LIVE NOW</span>
                    </div>
                  </div>
                  <p className="text-gray-400">YouTube Live Stream Embed</p>
                  <p className="text-xs text-gray-500 mt-2">GPN Live Stream will appear here</p>
                </div>
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-red transition-colors">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <div className="text-white text-sm">
                      <span className="font-semibold">24.5K</span>
                      <span className="text-gray-400 text-xs ml-1">watching</span>
                    </div>
                  </div>
                  <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-white hover:text-red transition-colors">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Live Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-red rounded-md">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  <span className="text-white text-xs font-bold">LIVE</span>
                </div>
                <div className="px-2 py-1 bg-black/70 rounded-md">
                  <span className="text-white text-xs">1080p</span>
                </div>
              </div>
            </div>

            {/* Stream Info */}
            <div className="bg-white dark:bg-gray-900 p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {liveStream.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {liveStream.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{liveStream.viewers} watching now</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Tv className="w-4 h-4" />
                  <span>GPN News Channel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule & Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - TV Schedule */}
          <div className="lg:col-span-2">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 bg-red rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                TV Schedule
              </h2>
              <Radio className="w-5 h-5 text-red" />
            </div>

            {/* Day Selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {tvSchedule.days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                    selectedDay === day
                      ? "bg-red text-white shadow-md"
                      : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-red/10"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Schedule List */}
            <div className="space-y-3">
              {/* Current Live Show */}
              {tvSchedule.current.isLive && (
                <div className="bg-gradient-to-r from-red/10 to-transparent rounded-xl p-4 border-l-4 border-red">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 bg-red rounded-full animate-pulse"></span>
                        <span className="text-red text-xs font-bold">ON AIR NOW</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {tvSchedule.current.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{tvSchedule.current.timeRange}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{tvSchedule.current.viewers} watching</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                      Watch Live
                    </button>
                  </div>
                </div>
              )}

              {/* Upcoming Shows */}
              {tvSchedule.upcoming.map((show) => (
                <div
                  key={show.id}
                  className="bg-white dark:bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400">{show.category}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red transition-colors">
                        {show.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{show.timeRange}</span>
                      </div>
                    </div>
                    <button className="text-red text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Remind Me
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View Full Schedule Link */}
            <div className="mt-6 text-center">
              <button className="inline-flex items-center gap-1 text-red hover:text-red-600 font-medium text-sm">
                View Complete Weekly Schedule
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column - Featured Videos & Info */}
          <div>
            {/* Featured Videos */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 bg-red rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Featured Videos
                </h2>
              </div>

              <div className="space-y-4">
                {featuredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="group flex gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="relative w-24 h-16 flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-white/50 group-hover:text-red transition-colors" />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{video.views} views</span>
                        <span>•</span>
                        <span>{video.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-center text-red text-sm font-medium hover:text-red-600">
                View All Videos →
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                About GPN Live
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                24/7 live news coverage from around the world. Breaking news, in-depth analysis, and expert opinions.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-1.5 h-1.5 bg-red rounded-full"></div>
                <span>Available on Web & Mobile</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}