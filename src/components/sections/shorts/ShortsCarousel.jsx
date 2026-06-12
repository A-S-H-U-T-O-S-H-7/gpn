"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, Eye, Calendar } from "lucide-react";
import { getLatestShorts } from "@/lib/services/videoService";
import ShortsModal from "./ShortsModal";

export default function ShortsCarousel() {
  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedShort, setSelectedShort] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % shorts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + shorts.length) % shorts.length);
  };

  const handleCardClick = (short) => {
    setSelectedShort(short);
    setIsModalOpen(true);
  };

  // Touch swipe support
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right
      prevSlide();
    }
  };

  if (loading || shorts.length === 0) return null;

  const currentShort = shorts[currentIndex];

  return (
    <>
      <div className="md:hidden relative px-4 py-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        {/* Section Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-purple-600 rounded-full" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Shorts & Reels</h3>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-center">
            {/* Card */}
            <div 
              className="w-64 cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => handleCardClick(currentShort)}
            >
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <div className="relative" style={{ aspectRatio: "4/5" }}>
                  {currentShort.thumbnail ? (
                    <img
                      src={currentShort.thumbnail}
                      alt={currentShort.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-700 to-pink-700 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                  
                  {/* Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-purple-600 text-white text-[9px] font-bold rounded-full uppercase">
                      {currentShort.videoType === 'reel' ? 'Reel' : 'Short'}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <h4 className="text-white text-xs font-semibold line-clamp-2 mb-1">
                    {currentShort.title}
                  </h4>
                  <div className="flex items-center gap-2 text-white/60 text-[9px]">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-2 h-2" />
                      {currentShort.formattedViews}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="w-2 h-2" />
                      {currentShort.formattedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {shorts.slice(0, 5).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                idx === currentIndex 
                  ? "w-6 bg-purple-600" 
                  : "w-1.5 bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
          {shorts.length > 5 && (
            <span className="text-xs text-gray-400">+{shorts.length - 5}</span>
          )}
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