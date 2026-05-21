"use client";

import { Tv, Clock, Radio, AlertCircle } from "lucide-react";

// This data would come from your backend/API
const liveSchedule = {
  isLive: false, // Set to true when there's a live event
  current: {
    title: "Global News Live Updates",
    timeRange: "10:00 AM - 12:00 PM",
  },
  upcoming: [
    {
      id: 1,
      title: "Business Today",
      timeRange: "12:00 PM - 01:00 PM",
    },
    {
      id: 2,
      title: "Sports Live",
      timeRange: "01:00 PM - 02:00 PM",
    },
    {
      id: 3,
      title: "Tech Talks",
      timeRange: "02:00 PM - 03:00 PM",
    },
    {
      id: 4,
      title: "World Brief",
      timeRange: "03:00 PM - 04:00 PM",
    },
  ],
};

export default function LiveTvSchedule() {
  const { isLive, current, upcoming } = liveSchedule;

  return (
    <section className="py-10 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN - Live TV Status */}
          <div>
            {/* Section Header with Red Bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 bg-red rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Live TV
              </h2>
              <Tv className="w-5 h-5 text-red" />
            </div>

            {/* Live Status Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
              {isLive ? (
                // When LIVE event is happening
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red rounded-full animate-pulse"></span>
                      <span className="text-red text-sm font-bold">LIVE</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">ON AIR NOW</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {current.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{current.timeRange}</span>
                  </div>
                  <button className="mt-6 px-6 py-2 bg-red text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
                    Watch Live →
                  </button>
                </>
              ) : (
                // When NO LIVE event
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No Live Events Currently
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Check back later for live broadcasts,<br />
                    or explore our latest videos below.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Upcoming Schedule */}
          <div>
            {/* Section Header with Red Bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 bg-red rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Today's Schedule
              </h2>
              <Radio className="w-5 h-5 text-red" />
            </div>

            {/* Schedule List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
              <div className="space-y-4">
                {upcoming.map((show) => (
                  <div
                    key={show.id}
                    className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {show.title}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{show.timeRange}</span>
                      </div>
                    </div>
                    <button className="text-red text-sm font-medium hover:text-red-600 transition-colors">
                      Remind
                    </button>
                  </div>
                ))}
              </div>

              {/* View Full Schedule Link */}
              <div className="mt-6 pt-4 text-center">
                <button className="text-red hover:text-red-600 font-medium text-sm inline-flex items-center gap-1">
                  View Full Schedule
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}