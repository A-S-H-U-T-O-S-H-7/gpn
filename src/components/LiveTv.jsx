"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Play, 
  Clock, 
  Eye, 
  Tv, 
  Volume2, 
  VolumeX,
  Maximize2,
  AlertCircle,
  Timer,
  Calendar
} from "lucide-react";
import { getCurrentLiveStream, getTodaysSchedule } from "@/lib/services/liveTvService";
import { getFeaturedVideos } from "@/lib/services/videoService";

function formatViews(views) {
  if (!views) return '0';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000000).toFixed(1) + 'K';
  return views.toString();
}

function formatDate(date) {
  if (!date) return '';
  const now = new Date();
  const diff = Math.floor((now - date) / 1000 / 60 / 60);
  if (diff < 1) return 'Just now';
  if (diff < 24) return `${diff} hours ago`;
  return `${Math.floor(diff / 24)} days ago`;
}

export default function LiveTVPage() {
  const [liveStream, setLiveStream] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch live stream data
        const streamResult = await getCurrentLiveStream();
        if (streamResult.success) {
          setIsLive(streamResult.isLive);
          setLiveStream(streamResult.live);
        }

        // Fetch today's schedule
        const scheduleResult = await getTodaysSchedule();
        if (scheduleResult.success) {
          setSchedule(scheduleResult.schedule);
        }

        // Fetch featured videos for sidebar
        const videosResult = await getFeaturedVideos(4);
        if (videosResult.success) {
          setFeaturedVideos(videosResult.videos);
        }
      } catch (error) {
        console.error("Error fetching live TV data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getNextProgram = () => {
    if (!schedule || schedule.length === 0) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Find next program
    for (let program of schedule) {
      const [startHour, startMinute] = program.startTime.split(':').map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;
      if (startTimeInMinutes > currentTime) {
        return program;
      }
    }
    // If no program found, return first program of tomorrow
    return schedule[0];
  };

  const nextProgram = getNextProgram();

  if (loading) {
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

  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-900/50">
      
      {/* Live Player Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Live Stream Player */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            {/* Video Player Area */}
            <div className="relative aspect-video md:aspect-[21/9] bg-black">
              
              {isLive && liveStream?.videoId ? (
                // LIVE STREAM CONTENT - YouTube Embed
                <>
                  <iframe
                    src={`https://www.youtube.com/embed/${liveStream.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
                    title={liveStream.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />

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
                      <button 
                        onClick={() => {
                          const elem = document.querySelector('iframe');
                          if (elem && elem.requestFullscreen) {
                            elem.requestFullscreen();
                          }
                        }} 
                        className="text-white hover:text-red transition-colors"
                      >
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
                      <span className="text-white text-[10px]">1080p</span>
                    </div>
                  </div>
                </>
              ) : (
                // NO LIVE COVERAGE STATE
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                      <Tv className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Live Coverage</h3>
                    <p className="text-gray-400 text-sm">Check back later for live broadcasts</p>
                    {nextProgram && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500">Next Program</p>
                        <p className="text-sm text-white font-medium mt-1">{nextProgram.title}</p>
                        <p className="text-xs text-gray-400 mt-1">Starting at {nextProgram.startTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Stream Info */}
            <div className="bg-white dark:bg-gray-900 p-5">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {liveStream?.title || "GPN Live News"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {liveStream?.description || "Live coverage of breaking news and events from around the world."}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{liveStream?.viewers || "0"} watching now</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Tv className="w-4 h-4" />
                  <span>GPN News Channel</span>
                </div>
                {isLive && liveStream?.videoId && (
                  <div className="flex items-center gap-1 text-red">
                    <span className="w-1.5 h-1.5 bg-red rounded-full animate-pulse"></span>
                    <span className="text-xs font-semibold">LIVE NOW</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Program & Featured Section */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Schedule & Next Program */}
          <div className="lg:col-span-2">
            {/* Next Program Card */}
            {nextProgram && (
              <div className="bg-gradient-to-r from-red/5 to-transparent rounded-xl p-5 border-l-4 border-red mb-6">
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
                      {nextProgram.endTime && (
                        <>
                          <span>•</span>
                          <span>Ends at {nextProgram.endTime}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{nextProgram.category}</span>
                    </div>
                  </div>
                  <button className="px-5 py-2 bg-red text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                    Set Reminder
                  </button>
                </div>
              </div>
            )}

            {/* Full Schedule */}
            {schedule.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-red" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today's Schedule</h3>
                </div>
                <div className="space-y-3">
                  {schedule.map((program, index) => (
                    <div key={program.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-16 text-sm font-semibold text-red">
                          {program.startTime}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {program.title}
                          </h4>
                          {program.category && (
                            <span className="text-xs text-gray-500">{program.category}</span>
                          )}
                        </div>
                      </div>
                      {program.isLive && (
                        <span className="text-xs bg-red/10 text-red px-2 py-0.5 rounded-full">LIVE</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              {featuredVideos.length > 0 ? (
                featuredVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/video/${video.slug}`}
                    className="group flex gap-3 p-2 bg-white dark:bg-gray-900 rounded-xl hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="relative w-24 h-14 flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden">
                      {video.thumbnail ? (
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-5 h-5 text-white/50 group-hover:text-red transition-colors" />
                        </div>
                      )}
                      {video.duration && (
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                          {video.duration}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatViews(video.views)} views</span>
                        <span>•</span>
                        <span>{formatDate(video.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No featured videos</p>
                </div>
              )}
            </div>

            <Link href="/videos" className="block w-full mt-4 text-center text-red text-sm font-medium hover:text-red-600">
              View All Videos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}