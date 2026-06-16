"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Eye, Calendar, Flame, ChevronRight } from "lucide-react";
import { getLatestShorts } from "@/lib/services/videoService";
import ShortsModal from "./ShortsModal";

export default function ShortsCarousel() {
  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedShort, setSelectedShort] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const goToNext = useCallback(() => {
    if (isTransitioning || shorts.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % shorts.length);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [shorts.length, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || shorts.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + shorts.length) % shorts.length);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [shorts.length, isTransitioning]);

  const handleCardClick = (short) => {
    setSelectedShort(short);
    setIsModalOpen(true);
  };

  // Touch handlers for vertical swipe
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setOffsetY(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    setOffsetY(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (offsetY < -60) {
      goToNext();
    } else if (offsetY > 60) {
      goToPrev();
    } else {
      setOffsetY(0);
    }
  };

  // Auto-play every 5 seconds
  useEffect(() => {
    if (shorts.length === 0 || isModalOpen) return;
    const timer = setInterval(() => {
      if (!isDragging) {
        goToNext();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [shorts.length, isDragging, isModalOpen, goToNext]);

  if (loading) {
    return (
      <div className="block md:hidden bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="flex items-center justify-center h-[480px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (shorts.length === 0) {
    return null;
  }

  // Get visible cards with stacking effect
  const getVisibleCards = () => {
    const total = shorts.length;
    const visible = [];
    const cardsToShow = 3;

    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % total;
      const isActive = i === 0;
      
      let translateX = 0;
      let scale = 1;
      let translateY = 0;
      let opacity = 1;
      let zIndex = 30 - i * 10;

      if (i === 0) {
        translateX = 0;
        scale = 1;
        translateY = 0;
        opacity = 1;
        zIndex = 30;
      } else if (i === 1) {
        translateX = 25;
        scale = 0.92;
        translateY = 20;
        opacity = 0.85;
        zIndex = 20;
      } else if (i === 2) {
        translateX = 45;
        scale = 0.85;
        translateY = 40;
        opacity = 0.7;
        zIndex = 10;
      }

      visible.push({
        ...shorts[index],
        index,
        isActive,
        translateX,
        scale,
        translateY,
        opacity,
        zIndex,
      });
    }

    return visible;
  };

  const visibleCards = getVisibleCards();

  return (
    <>
      <div className="block md:hidden bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        {/* Section Header - GPN Branding */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 bg-red-600 rounded-full" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Visual Stories
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Watch the story unfold
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentIndex + 1}/{shorts.length}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Carousel Container - Stacked Cards */}
        <div 
          className="relative mx-auto"
          style={{ height: "480px", maxWidth: "400px" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full">
            {visibleCards.map((card, idx) => (
              <div
                key={`${card.id}-${idx}`}
                className="absolute w-full h-full cursor-pointer"
                style={{
                  transform: `translateX(${card.translateX}px) scale(${card.scale}) translateY(${card.translateY}px)`,
                  opacity: card.opacity,
                  zIndex: card.zIndex,
                  transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onClick={() => card.isActive && handleCardClick(card)}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  {/* Thumbnail */}
                  <div className="relative w-full h-full">
                    {card.thumbnail ? (
                      <img
                        src={card.thumbnail}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    ) : card.videoId ? (
                      <img
                        src={`https://img.youtube.com/vi/${card.videoId}/hqdefault.jpg`}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white/30" />
                      </div>
                    )}

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Play Button - Only on active card */}
                    {card.isActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                    )}

                    {/* Badge - Red accent */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                        {card.videoType === 'reel' ? 'Reel' : 'Short'}
                      </span>
                    </div>

                    {/* Content at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h4 className="text-white text-base font-bold leading-snug line-clamp-2 mb-2">
                        {card.title}
                      </h4>
                      <div className="flex items-center gap-3 text-white/70 text-[10px]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {card.formattedViews || (card.views || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {card.formattedDate || 'Recent'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Swipe Hint - Vertical */}
          <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-center">
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              ↕ Swipe up for next story
            </p>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {shorts.slice(0, 6).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(idx);
                  setTimeout(() => setIsTransitioning(false), 400);
                }
              }}
              className={`rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? "w-8 h-2 bg-red-600" 
                  : "w-2 h-2 bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
          {shorts.length > 6 && (
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1 flex items-center">
              +{shorts.length - 6}
            </span>
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