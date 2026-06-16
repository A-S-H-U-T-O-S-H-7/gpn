"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

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
    <Suspense fallback={
      <div className="py-8 bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center h-[480px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    }>
      {/* Desktop: Horizontal Rail with left/right arrows */}
      <div className="hidden md:block">
        <ShortsReelsSection />
      </div>
      
      {/* Mobile: Stacked Cards with vertical swipe */}
      <div className="block md:hidden">
        <ShortsCarousel />
      </div>
    </Suspense>
  );
}