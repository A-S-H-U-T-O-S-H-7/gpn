"use client";

import { useState } from "react";
import { 
  Play, 
  Clock, 
  Eye, 
  Tv, 
  Volume2, 
  VolumeX,
  Maximize2,
  AlertCircle,
  Timer
} from "lucide-react";

// Mock live stream data
const liveStream = {
  isLive: true, // Change to false to see "No live coverage" state
  title: "GPN Live News - Breaking News Coverage",
  description: "Live coverage of global events, breaking news, and real-time updates from around the world.",
  viewers: "24.5K",
  quality: "1080p",
};

// Next Program Data
const nextProgram = {
  title: "Business Today",
  startTime: "12:00 PM",
  category: "Business",
};

// Featured Videos
const featuredVideos = [
  { id: 1, title: "New Satellite Network Launch", duration: "12:45", views: "12.5K", date: "2h ago" },
  { id: 2, title: "Global Markets Update", duration: "08:23", views: "8.4K", date: "3h ago" },
  { id: 3, title: "AI Breakthrough Announcement", duration: "15:30", views: "22.1K", date: "5h ago" },
  { id: 4, title: "Electric Car Revolution", duration: "10:15", views: "6.2K", date: "6h ago" },
];

export default function LiveTVPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-900/50">
      
      {/* Live Player Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Live Stream Player */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            {/* Video Player Area - Compact */}
            <div className="relative aspect-video md:aspect-[21/9] bg-black">
              
              {liveStream.isLive ? (
                // LIVE STREAM CONTENT
                <>
                  {/* YouTube Embed Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center">
                      <div className="relative inline-block mb-3">
                        <div className="absolute inset-0 rounded-full bg-red/30 animate-ping"></div>
                        <div className="relative flex items-center gap-2 px-3 py-1.5 bg-red rounded-full">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          <span className="text-white text-xs font-bold">LIVE NOW</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">YouTube Live Stream</p>
                      <p className="text-xs text-gray-500 mt-1">GPN Live Stream</p>
                    </div>
                  </div>

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-red transition-colors">
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <div className="text-white text-xs">
                          <span className="font-semibold">{liveStream.viewers}</span>
                          <span className="text-gray-400 text-xs ml-1">watching</span>
                        </div>
                      </div>
                      <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-white hover:text-red transition-colors">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Live Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-red rounded-md">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      <span className="text-white text-[10px] font-bold">LIVE</span>
                    </div>
                    <div className="px-2 py-0.5 bg-black/70 rounded-md">
                      <span className="text-white text-[10px]">{liveStream.quality}</span>
                    </div>
                  </div>
                </>
              ) : (
                // NO LIVE COVERAGE STATE
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                      <AlertCircle className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Live Coverage</h3>
                    <p className="text-gray-400 text-sm">Check back later for live broadcasts</p>
                    {nextProgram && (
                      <p className="text-xs text-gray-500 mt-2">Next: {nextProgram.title} at {nextProgram.startTime}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Stream Info */}
            <div className="bg-white dark:bg-gray-900 p-5">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {liveStream.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
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

      {/* Next Program & Featured Section */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Next Program Only */}
          <div className="lg:col-span-2">
            {/* Next Program Card */}
            <div className="bg-gradient-to-r from-red/5 to-transparent rounded-xl p-5 border-l-4 border-red">
              <div className="flex items-center gap-2 mb-3">
                <Timer className="w-5 h-5 text-red" />
                <span className="text-red text-sm font-semibold">Coming Up Next</span>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {nextProgram.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Starts at {nextProgram.startTime}</span>
                    <span>•</span>
                    <span>{nextProgram.category}</span>
                  </div>
                </div>
                <button className="px-5 py-2 bg-red text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                  Set Reminder
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Featured Videos */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-red rounded-full"></div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Featured Videos
              </h2>
            </div>

            <div className="space-y-3">
              {featuredVideos.map((video) => (
                <div
                  key={video.id}
                  className="group flex gap-3 p-2 bg-white dark:bg-gray-900 rounded-xl hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="relative w-24 h-14 flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-white/50 group-hover:text-red transition-colors" />
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
        </div>
      </div>
    </div>
  );
}