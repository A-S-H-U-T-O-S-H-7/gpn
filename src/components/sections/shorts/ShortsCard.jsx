"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, Calendar, Play, Volume2, VolumeX } from "lucide-react";

export default function ShortsCard({ short, isDark, onPlay, isVisible }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const observerRef = useRef(null);

  // Auto-play when visible in viewport
  useEffect(() => {
    if (!videoRef.current || !isVisible) return;

    const playVideo = async () => {
      try {
        if (isVisible && isHovered) {
          await videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      } catch (error) {
        console.log("Auto-play prevented:", error);
      }
    };

    playVideo();
  }, [isVisible, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleClick = () => {
    if (onPlay) {
      onPlay(short);
    }
  };

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer group"
      style={{ width: "280px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
        {/* Video Container - 4:5 Aspect Ratio */}
        <div className="relative" style={{ aspectRatio: "4/5" }}>
          {/* Thumbnail / Video */}
          {short.videoId && (
            <iframe
              ref={videoRef}
              src={`https://www.youtube.com/embed/${short.videoId}?autoplay=0&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1`}
              title={short.title}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={false}
            />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play Button Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
              </div>
            </div>
          )}

          {/* Mute/Unmute Button */}
          {isPlaying && (
            <button
              onClick={toggleMute}
              className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3 text-white" />
              ) : (
                <Volume2 className="w-3 h-3 text-white" />
              )}
            </button>
          )}

          {/* Duration Badge */}
          {short.duration && (
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-md">
              {short.duration}
            </div>
          )}

          {/* Video Type Badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 bg-purple-600 text-white text-[9px] font-bold rounded-full uppercase">
              {short.videoType === 'reel' ? 'Reel' : 'Short'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
          <h3 className="text-white text-sm font-semibold line-clamp-2 mb-1">
            {short.title}
          </h3>
          <div className="flex items-center gap-3 text-white/70 text-[10px]">
            <span className="flex items-center gap-1">
              <Eye className="w-2.5 h-2.5" />
              {short.formattedViews}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" />
              {short.formattedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}