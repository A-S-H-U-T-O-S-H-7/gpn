"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { getLatestShorts } from "@/lib/services/videoService";
import ShortsCard from "./ShortsCard";
import ShortsModal from "./ShortsModal";
import ShortsNavigation from "./ShortsNavigation";
import SkeletonNewsCard from "../news-section/SkeletonNewsCard";

export default function ShortsReelsSection() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [selectedShort, setSelectedShort] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState({});
  
  const scrollContainerRef = useRef(null);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);

  // Fetch initial shorts
  const fetchInitialShorts = async () => {
    setLoading(true);
    try {
      const result = await getLatestShorts(10);
      if (result.success) {
        setShorts(result.shorts);
        setHasMore(result.hasMore);
        if (result.lastVisible) setLastDoc(result.lastVisible);
      }
    } catch (err) {
      console.error("Error fetching shorts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load more shorts on scroll
  const loadMoreShorts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const result = await getLatestShorts(10, lastDoc);
      if (result.success && result.shorts.length > 0) {
        setShorts(prev => [...prev, ...result.shorts]);
        setLastDoc(result.lastVisible);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more shorts:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, lastDoc]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading || loadingMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreShorts();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadMoreShorts]);

  // Intersection Observer for auto-play videos
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    const options = {
      root: scrollContainerRef.current,
      threshold: 0.6,
      rootMargin: "0px"
    };
    
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const cardId = entry.target.getAttribute('data-id');
        if (cardId) {
          setVisibleCards(prev => ({
            ...prev,
            [cardId]: entry.isIntersecting
          }));
        }
      });
    }, options);
    
    // Observe all cards
    const cards = scrollContainerRef.current.querySelectorAll('[data-id]');
    cards.forEach(card => observerRef.current.observe(card));
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [shorts]);

  // Scroll navigation - updated for 240px card width
const scrollLeft = () => {
  if (scrollContainerRef.current) {
    scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' }); // Changed from -320 to -260
  }
};

const scrollRight = () => {
  if (scrollContainerRef.current) {
    scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' }); // Changed from 320 to 260
  }
};

 

  const handlePlayShort = (short) => {
    setSelectedShort(short);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShort(null);
  };

  const handleNavigateModal = (newShort) => {
    setSelectedShort(newShort);
  };

  useEffect(() => {
    fetchInitialShorts();
  }, []);

  if (loading && shorts.length === 0) {
    return (
      <section className="py-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-purple-600 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Let's Catch Up</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Loading...</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ width: "280px" }}>
                <SkeletonNewsCard />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (shorts.length === 0) {
    return null; // Don't show section if no shorts
  }

  return (
    <>
      <section className="py-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-purple-600 rounded-full" />
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Let's Catch Up
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Quick bites of entertainment and knowledge
                </p>
              </div>
            </div>
            
            {/* Scroll Indicators (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="relative group">
            <ShortsNavigation
              onPrev={scrollLeft}
              onNext={scrollRight}
              hasPrev={true}
              hasNext={true}
              isDark={false}
            />
            
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {shorts.map((short) => (
                <div key={short.id} data-id={short.id}>
                  <ShortsCard
                    short={short}
                    isDark={false}
                    onPlay={handlePlayShort}
                    isVisible={visibleCards[short.id] || false}
                  />
                </div>
              ))}
              
              {/* Load More Trigger */}
              {hasMore && (
                <div ref={loaderRef} className="flex-shrink-0 w-20 flex items-center justify-center">
                  {loadingMore && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-gray-500">Loading...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {shorts.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {shorts.length}+ short videos • Scroll for more
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedShort && (
        <ShortsModal
          short={selectedShort}
          allShorts={shorts}
          onClose={handleCloseModal}
          onNavigate={handleNavigateModal}
          isDark={false}
        />
      )}
    </>
  );
}