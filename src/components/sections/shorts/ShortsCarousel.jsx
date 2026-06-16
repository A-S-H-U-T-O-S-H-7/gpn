"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Play, Eye, Calendar, Flame, ChevronRight } from "lucide-react";
import { getLatestShorts } from "@/lib/services/videoService";
import ShortsModal from "./ShortsModal";

export default function ShortsCarousel() {
  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedShort, setSelectedShort] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);

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
    if (shorts.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % shorts.length);
  }, [shorts.length]);

  const goToPrev = useCallback(() => {
    if (shorts.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + shorts.length) % shorts.length);
  }, [shorts.length]);

  const handleCardClick = (short) => {
    setSelectedShort(short);
    setIsModalOpen(true);
  };

  // Handle drag end - Tinder style
  const handleDragEnd = (event, info) => {
    const threshold = 80;
    const offset = info.offset.x;
    
    if (offset < -threshold) {
      // Swipe left - next card
      goToNext();
    } else if (offset > threshold) {
      // Swipe right - previous card
      goToPrev();
    }
    setIsDragging(false);
  };

  // Get card position in stack
  const getCardPosition = (index) => {
    const diff = (index - currentIndex + shorts.length) % shorts.length;
    
    // Only show current, next, and previous card
    if (diff === 0) return 'active';
    if (diff === 1 || diff === -(shorts.length - 1)) return 'next';
    if (diff === shorts.length - 1 || diff === -1) return 'prev';
    return 'hidden';
  };

  // Auto-play
  useEffect(() => {
    if (shorts.length === 0 || isModalOpen || isDragging) return;
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [shorts.length, isModalOpen, isDragging, goToNext]);

  if (loading) {
    return (
      <div className="block md:hidden bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="flex items-center justify-center h-[480px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (shorts.length === 0) return null;

  // Get active card and background cards
  const activeCard = shorts[currentIndex];
  const nextCard = shorts[(currentIndex + 1) % shorts.length];
  const prevCard = shorts[(currentIndex - 1 + shorts.length) % shorts.length];

  const cardVariants = {
    active: {
      scale: 1,
      x: 0,
      y: 0,
      opacity: 1,
      zIndex: 30,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    next: {
      scale: 0.88,
      x: 55,
      y: 18,
      opacity: 0.75,
      zIndex: 20,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    prev: {
      scale: 0.78,
      x: -55,
      y: 18,
      opacity: 0.75,
      zIndex: 20,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    hidden: {
      scale: 0.7,
      x: 0,
      y: 0,
      opacity: 0,
      zIndex: 0,
      transition: { duration: 0.3 }
    }
  };

  // Render a card
  const renderCard = (card, position, isActive = false) => {
    if (!card) return null;
    
    return (
      <motion.div
        key={card.id}
        className="absolute w-full h-full cursor-pointer"
        variants={cardVariants}
        initial={position === 'active' ? 'active' : position === 'next' ? 'next' : position === 'prev' ? 'prev' : 'hidden'}
        animate={position === 'active' ? 'active' : position === 'next' ? 'next' : position === 'prev' ? 'prev' : 'hidden'}
        drag={position === 'active' ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ touchAction: 'none' }}
        onClick={() => isActive && handleCardClick(card)}
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50">
          {/* Thumbnail */}
          <div className="relative w-full h-full">
            <img
              src={card.thumbnail || `https://img.youtube.com/vi/${card.videoId}/hqdefault.jpg`}
              alt={card.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Play Button - Only active card */}
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                </div>
              </div>
            )}

            {/* Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-bold rounded-full uppercase shadow-lg">
                Short
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="text-white text-sm font-bold leading-snug line-clamp-2 mb-1.5">
                {card.title}
              </h4>
              <div className="flex items-center gap-3 text-white/70 text-[9px]">
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
      </motion.div>
    );
  };

  return (
    <>
      <div className="block md:hidden bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800 py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-red-600 rounded-full" />
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                Visual Stories
                <Flame className="w-4 h-4 text-red-600" />
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Watch the story unfold</p>
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {currentIndex + 1}/{shorts.length}
          </span>
        </div>

        {/* Carousel */}
        <div 
          ref={containerRef}
          className="relative mx-auto"
          style={{ height: "460px", maxWidth: "380px" }}
        >
          <div className="relative w-full h-full">
            {/* Previous Card (behind left) */}
            {renderCard(prevCard, 'prev')}
            
            {/* Next Card (behind right) */}
            {renderCard(nextCard, 'next')}
            
            {/* Active Card (on top, draggable) */}
            {renderCard(activeCard, 'active', true)}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {shorts.slice(0, 6).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? "w-6 h-1.5 bg-red-600" 
                  : "w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
          {shorts.length > 6 && (
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1 flex items-center">
              +{shorts.length - 6}
            </span>
          )}
        </div>

        {/* Swipe Hint */}
        <p className="text-center text-[9px] text-gray-400 dark:text-gray-500 mt-3">
          ← Swipe to explore stories →
        </p>
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