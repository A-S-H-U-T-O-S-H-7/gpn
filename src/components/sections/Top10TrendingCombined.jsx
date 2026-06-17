"use client";

import Top10NewsBox from "./Top10NewsBox";
import TrendingSection from "./TrendingSection";

export default function Top10TrendingCombined() {
  return (
    <section className="py-8 bg-rose-50 dark:bg-slate-800/30">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10">

        
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT: Today's Top 10 ── */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-0.5 h-7 bg-red-700 rounded-full flex-shrink-0" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                Today's Top 10
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900 flex-shrink-0">
                🔥 Daily
              </span>
            </div>

            <Top10NewsBox />
          </div>

          {/* ── RIGHT: Trending ── */}
          <div className="flex-1 min-w-0">
            <TrendingSection />
          </div>

        </div>
      </div>
    </section>
  );
}