"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  X, Share2, Eye, Calendar, 
  Volume2, VolumeX, Link as LinkIcon,
  ChevronUp, ChevronDown
} from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion, PanInfo } from "framer-motion";

export default function ShortsModal({ short, allShorts, onClose, onNavigate, isDark }) {
  const [currentShort, setCurrentShort] = useState(short);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [direction, setDirection] = useState(0);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const index = allShorts.findIndex(s => s.id === short.id);
    setCurrentIndex(index + 1);
    setTotalCount(allShorts.length);
    setCurrentShort(short);
  }, [short, allShorts]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allShorts]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 1) {
      const prevShort = allShorts[currentIndex - 2];
      setCurrentShort(prevShort);
      setCurrentIndex(currentIndex - 1);
      setDirection(-1);
      if (onNavigate) onNavigate(prevShort);
    }
  }, [currentIndex, allShorts, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalCount) {
      const nextShort = allShorts[currentIndex];
      setCurrentShort(nextShort);
      setCurrentIndex(currentIndex + 1);
      setDirection(1);
      if (onNavigate) onNavigate(nextShort);
    }
  }, [currentIndex, totalCount, allShorts, onNavigate]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = currentShort.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        setShowShareMenu(false);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  // Handle vertical drag for swipe up/down
  const handleDragEnd = (event, info) => {
    const threshold = 80;
    const offset = info.offset.y;
    
    if (offset < -threshold) {
      // Swipe up - next
      handleNext();
    } else if (offset > threshold) {
      // Swipe down - prev
      handlePrev();
    }
    setIsDragging(false);
  };

  const variants = {
    enter: (direction) => ({
      y: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: (direction) => ({
      y: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.25,
        ease: "easeIn"
      }
    })
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      <div className="relative w-full h-full max-w-2xl mx-auto flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 border border-white/20"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Progress Indicator */}
        {totalCount > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm">
            <span className="text-white text-xs font-medium">
              {currentIndex} / {totalCount}
            </span>
          </div>
        )}

        {/* Swipe Hint - Desktop */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-2">
          <button onClick={handlePrev} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
            <ChevronUp className="w-5 h-5 text-white/60" />
          </button>
          <span className="text-[8px] text-white/40 tracking-widest uppercase">Swipe</span>
          <button onClick={handleNext} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
            <ChevronDown className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Video Container with Drag */}
        <motion.div 
          className="flex-1 relative bg-black overflow-hidden cursor-grab active:cursor-grabbing"
          custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          variants={variants}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.3}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ touchAction: 'none' }}
        >
          {currentShort.videoId && (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${currentShort.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1`}
              title={currentShort.title}
              className="w-full h-full object-contain"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {/* Swipe Hint Overlay - Mobile */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 md:hidden">
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-2 text-white/20">
                <ChevronUp className="w-4 h-4" />
                <ChevronDown className="w-4 h-4" />
              </div>
              <span className="text-[8px] text-white/20">Swipe to navigate</span>
            </div>
          </div>

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        </motion.div>

        {/* Info Panel */}
        <div className="bg-gradient-to-t from-black/90 to-transparent px-4 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-white text-sm md:text-base font-semibold mb-1 line-clamp-2">
                {currentShort.title}
              </h2>
              <div className="flex items-center gap-3 text-white/60 text-xs">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {currentShort.formattedViews}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {currentShort.formattedDate}
                </span>
              </div>
            </div>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                <Share2 className="w-4 h-4 text-white" />
              </button>

              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-44 rounded-lg bg-white dark:bg-gray-800 shadow-xl overflow-hidden z-30">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaFacebook className="w-3.5 h-3.5 text-blue-600" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaTwitter className="w-3.5 h-3.5 text-blue-400" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaLinkedin className="w-3.5 h-3.5 text-blue-700" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}