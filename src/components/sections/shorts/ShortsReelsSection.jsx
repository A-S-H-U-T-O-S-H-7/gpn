"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Eye, Calendar, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { getLatestShorts } from "@/lib/services/videoService";
import ShortsModal from "./ShortsModal";
import Image from "next/image";

export default function ShortsReelsSection() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShort, setSelectedShort] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchShorts();
  }, []);

  const fetchShorts = async () => {
    setLoading(true);
    try {
      const result = await getLatestShorts(20);
      if (result.success) {
        setShorts(result.shorts);
      }
    } catch (err) {
      console.error("Error fetching shorts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (short) => {
    setSelectedShort(short);
    setIsModalOpen(true);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading || shorts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="hidden md:block py-12 bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-8xl mx-auto px-6">
          {/* Section Header - GPN Branding */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 bg-red-600 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Visual Stories
                  <Flame className="w-5 h-5 text-red-600" />
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  News Beyond Headlines
                </p>
              </div>
            </div>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Horizontal Rail */}
          <div className="relative group">
            {/* Navigation Arrows */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            {/* Cards Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {shorts.map((short, index) => {
                const isCenter = index >= 2 && index < shorts.length - 2;
                const scale = isCenter ? 1 : 0.92;
                const opacity = isCenter ? 1 : 0.7;

                return (
                  <div
                    key={short.id}
                    className="flex-shrink-0 cursor-pointer group/card transition-all duration-300 hover:scale-[1.02]"
                    style={{ width: "240px" }}
                    onClick={() => handleCardClick(short)}
                  >
                    <div 
                      className="relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                      style={{ height: "420px" }}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full h-full">
                        {short.thumbnail ? (
                          <img
                            src={short.thumbnail}
                            alt={short.title}
                            className="w-full h-full object-cover"
                          />
                        ) : short.videoId ? (
                          <img
                            src={`https://img.youtube.com/vi/${short.videoId}/hqdefault.jpg`}
                            alt={short.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                            <Play className="w-12 h-12 text-white/30" />
                          </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Play Icon - Shows on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                          </div>
                        </div>

                        {/* Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                            {short.videoType === 'reel' ? 'Reel' : 'Short'}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h4 className="text-white text-sm font-bold leading-snug line-clamp-2 mb-2">
                            {short.title}
                          </h4>
                          <div className="flex items-center gap-3 text-white/70 text-[10px]">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {short.formattedViews || (short.views || 0)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {short.formattedDate || 'Recent'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {shorts.length}+ short videos • Hover to preview • Click to watch
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedShort && (
        <ShortsModal
          short={selectedShort}
          allShorts={shorts}
          onClose={() => setIsModalOpen(false)}
          onNavigate={setSelectedShort}
          isDark={false}
        />
      )}
    </>
  );
}