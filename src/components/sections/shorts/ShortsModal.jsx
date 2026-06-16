"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  X, Share2, Eye, Calendar, 
  Volume2, VolumeX, Link as LinkIcon,
  ChevronUp, ChevronDown
} from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ShortsModal({ short, allShorts, onClose, onNavigate, isDark }) {
  const [currentShort, setCurrentShort] = useState(short);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Changed to false by default
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [direction, setDirection] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchCurrentY, setTouchCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const index = allShorts.findIndex(s => s.id === short.id);
    setCurrentIndex(index + 1);
    setTotalCount(allShorts.length);
    setCurrentShort(short);
    // Reset mute state when short changes
    setIsMuted(false);
  }, [short, allShorts]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  // Auto-unmute after user interaction
  useEffect(() => {
    if (hasUserInteracted && iframeRef.current) {
      // Reload iframe with unmuted
      const src = iframeRef.current.src;
      const newSrc = src.replace(/mute=\d/, 'mute=0');
      iframeRef.current.src = newSrc;
    }
  }, [hasUserInteracted]);

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
      setIsMuted(false);
      if (onNavigate) onNavigate(prevShort);
    }
  }, [currentIndex, allShorts, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalCount) {
      const nextShort = allShorts[currentIndex];
      setCurrentShort(nextShort);
      setCurrentIndex(currentIndex + 1);
      setDirection(1);
      setIsMuted(false);
      if (onNavigate) onNavigate(nextShort);
    }
  }, [currentIndex, totalCount, allShorts, onNavigate]);

  // Handle user interaction to unmute
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      setIsMuted(false);
    }
  }, [hasUserInteracted]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
  }, [isMuted, hasUserInteracted]);

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

  // Touch handlers for smooth swipe
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setTouchStartY(e.touches[0].clientY);
    setTouchCurrentY(e.touches[0].clientY);
    // User touched the screen - unmute
    handleUserInteraction();
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setTouchCurrentY(e.touches[0].clientY);
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = touchStartY - touchCurrentY;
    const threshold = 80;
    
    if (diff < -threshold) {
      handlePrev();
    } else if (diff > threshold) {
      handleNext();
    }
    
    setTouchStartY(0);
    setTouchCurrentY(0);
  };

  // Calculate drag progress for animation
  const getDragProgress = () => {
    if (!isDragging || touchStartY === 0) return 0;
    const diff = touchStartY - touchCurrentY;
    const maxDrag = 200;
    return Math.max(-1, Math.min(1, diff / maxDrag));
  };

  const dragProgress = getDragProgress();

  const variants = {
    enter: (direction) => ({
      y: direction > 0 ? '100%' : '-100%',
      scale: 0.95,
      opacity: 0,
    }),
    center: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.32, 0.72, 0, 1],
      }
    },
    exit: (direction) => ({
      y: direction > 0 ? '-100%' : '100%',
      scale: 0.95,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.32, 0.72, 0, 1],
      }
    })
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      style={{ 
        touchAction: 'none',
        padding: '8px'
      }}
      onClick={handleUserInteraction}
    >
      <div 
        className="relative w-full h-full max-w-md mx-auto flex flex-col bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ maxHeight: 'calc(100vh - 16px)' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUserInteraction();
            onClose();
          }}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-all duration-200 border border-white/20 backdrop-blur-sm"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Progress Indicator */}
        {totalCount > 1 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
            <span className="text-white text-[10px] font-medium">
              {currentIndex} / {totalCount}
            </span>
          </div>
        )}

        {/* Video Container */}
        <div className="flex-1 relative bg-black overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentShort.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
              style={{
                y: isDragging ? dragProgress * 80 : 0,
                scale: isDragging ? 1 - Math.abs(dragProgress) * 0.05 : 1,
              }}
              onClick={handleUserInteraction}
            >
              {currentShort.videoId && (
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${currentShort.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1`}
                  title={currentShort.title}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Info at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h2 className="text-white text-sm font-semibold mb-1.5 line-clamp-2">
                  {currentShort.title}
                </h2>
                <div className="flex items-center gap-3 text-white/60 text-[10px]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {currentShort.formattedViews || (currentShort.views || 0)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {currentShort.formattedDate || 'Recent'}
                  </span>
                </div>
              </div>

              {/* Mute/Unmute Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="absolute bottom-20 right-3 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 backdrop-blur-sm border border-white/10"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Share Button */}
          <div className="absolute bottom-20 left-3 z-20">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserInteraction();
                  setShowShareMenu(!showShareMenu);
                }}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 backdrop-blur-sm border border-white/10"
              >
                <Share2 className="w-3.5 h-3.5 text-white" />
              </button>

              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-40 rounded-lg bg-white dark:bg-gray-800 shadow-xl overflow-hidden z-30">
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

        {/* Swipe Indicator - Bottom */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 md:hidden">
          <div className="flex items-center gap-2 text-white/20">
            <ChevronUp className="w-3 h-3" />
            <span className="text-[8px]">Swipe</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}