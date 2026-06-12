"use client";

import dynamic from 'next/dynamic';

const ShortsReelsSection = dynamic(
  () => import('@/components/sections/shorts/ShortsReelsSection'),
  { ssr: false }
);

const ShortsCarousel = dynamic(
  () => import('@/components/sections/shorts/ShortsCarousel'),
  { ssr: false }
);

export default function ShortsWrapper() {
  return (
    <>
      {/* Desktop: Horizontal Scroll with left/right arrows */}
      <div className="hidden md:block">
        <ShortsReelsSection />
      </div>
      
      {/* Mobile: Carousel with dots */}
      <div className="block md:hidden">
        <ShortsCarousel />
      </div>
    </>
  );
}