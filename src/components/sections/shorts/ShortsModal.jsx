"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Share2, Eye, Calendar, Volume2, VolumeX, Link as LinkIcon } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function ShortsModal({ short, allShorts, onClose, onNavigate, isDark }) {
  const [currentShort, setCurrentShort] = useState(short);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const index = allShorts.findIndex(s => s.id === short.id);
    setCurrentIndex(index + 1);
    setTotalCount(allShorts.length);
    setCurrentShort(short);
  }, [short, allShorts]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allShorts]);

  // Touch swipe for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext();
    }
    if (touchStart - touchEnd < -50) {
      handlePrev();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handlePrev = () => {
    if (currentIndex > 1) {
      const prevShort = allShorts[currentIndex - 2];
      setCurrentShort(prevShort);
      setCurrentIndex(currentIndex - 1);
      if (onNavigate) onNavigate(prevShort);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalCount) {
      const nextShort = allShorts[currentIndex];
      setCurrentShort(nextShort);
      setCurrentIndex(currentIndex + 1);
      if (onNavigate) onNavigate(nextShort);
    }
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close Button - Made more visible and accessible */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-12 md:top-0 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 z-20 border border-white/20"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Main Video Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
          {/* YouTube Player */}
          {currentShort.videoId && (
            <iframe
              src={`https://www.youtube.com/embed/${currentShort.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&showinfo=0&playsinline=1`}
              title={currentShort.title}
              className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {/* Navigation Arrows - Desktop */}
          {totalCount > 1 && (
            <>
              <button
                onClick={handlePrev}
                className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20 ${
                  currentIndex <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={currentIndex <= 1}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <button
                onClick={handleNext}
                className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20 ${
                  currentIndex >= totalCount ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={currentIndex >= totalCount}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Mobile Navigation Arrows (Smaller, at bottom) */}
          {totalCount > 1 && (
            <div className="md:hidden absolute bottom-20 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={handlePrev}
                className={`w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200 border border-white/20 ${
                  currentIndex <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={currentIndex <= 1}
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleNext}
                className={`w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200 border border-white/20 ${
                  currentIndex >= totalCount ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={currentIndex >= totalCount}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Progress Indicator */}
          {totalCount > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm">
              <span className="text-white text-xs font-medium">
                {currentIndex} / {totalCount}
              </span>
            </div>
          )}

          {/* Swipe Hint for Mobile */}
          <div className="md:hidden absolute bottom-28 left-1/2 -translate-x-1/2 text-white/40 text-[10px]">
            ← Swipe to navigate →
          </div>
        </div>

        {/* Video Info Panel */}
        <div className="mt-4 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-white text-sm md:text-base font-semibold mb-2 line-clamp-2">
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
              {currentShort.duration && (
                <span className="text-white/60 text-xs">
                  {currentShort.duration}
                </span>
              )}
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
              <div className="absolute right-0 mt-2 w-44 rounded-lg bg-white dark:bg-gray-800 shadow-xl overflow-hidden z-30 animate-in slide-in-from-top-2 duration-200">
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
  );
}