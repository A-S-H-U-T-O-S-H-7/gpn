"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Share2, Eye, Calendar, Heart, Volume2, VolumeX, Link as LinkIcon } from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 z-20"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Main Video Container - 4:5 Aspect Ratio */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/5" }}>
          {/* YouTube Player */}
          {currentShort.videoId && (
            <iframe
              src={`https://www.youtube.com/embed/${currentShort.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&showinfo=0&playsinline=1`}
              title={currentShort.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {/* Navigation Arrows - Only show if more than one video */}
          {totalCount > 1 && (
            <>
              {currentIndex > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              
              {currentIndex < totalCount && (
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </>
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
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
              <span className="text-white text-xs font-medium">
                {currentIndex} / {totalCount}
              </span>
            </div>
          )}
        </div>

        {/* Video Info Panel */}
        <div className="mt-4 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-white text-lg font-semibold mb-2">
              {currentShort.title}
            </h2>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {currentShort.formattedViews}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {currentShort.formattedDate}
              </span>
              {currentShort.duration && (
                <span className="text-white/60 text-sm">
                  Duration: {currentShort.duration}
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
              <Share2 className="w-5 h-5 text-white" />
            </button>

            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-xl overflow-hidden z-30 animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaFacebook className="w-4 h-4 text-blue-600" />
                  Facebook
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaTwitter className="w-4 h-4 text-blue-400" />
                  Twitter
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaLinkedin className="w-4 h-4 text-blue-700" />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700"
                >
                  <LinkIcon className="w-4 h-4" />
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