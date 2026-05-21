"use client";

import { Clock, Award } from "lucide-react";

const editorsPicks = [
  {
    id: 1,
    title: "SpaceX Launches Next-Gen Satellite Network",
    description: "The Falcon 9 rocket successfully launched 60 satellites, marking a big step toward global internet coverage.",
    category: "Technology",
    timeAgo: "2h ago",
    image: "/images/editors1.jpg",
  },
  {
    id: 2,
    title: "India's New Education Policy 2024: Key Highlights",
    description: "The new policy aims to transform the education system with focus on skills, technology, and research.",
    category: "India",
    timeAgo: "3h ago",
    image: "/images/editors2.jpg",
  },
  {
    id: 3,
    title: "Heavy Rains Cause Flooding in Several Cities",
    description: "IMD warns of more heavy rainfall in upcoming days. Authorities issue safety advisories for residents.",
    category: "World",
    timeAgo: "5h ago",
    image: "/images/editors3.jpg",
  },
//   {
//     id: 4,
//     title: "Revolutionary Quantum Computing Breakthrough",
//     description: "Scientists achieve major milestone in quantum computing, opening new possibilities.",
//     category: "Technology",
//     timeAgo: "6h ago",
//     image: "/images/editors4.jpg",
//   },
];

export default function EditorsPicks() {
  return (
    <div>
      {/* Section Header with Red Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-red rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Editor's Picks
        </h2>
        <Award className="w-5 h-5 text-red" />
      </div>

      {/* Editor's Picks List - Vertical with left thumbnail */}
      <div className="space-y-5">
        {editorsPicks.map((pick) => (
          <div
            key={pick.id}
            className="group flex gap-4 cursor-pointer bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Left Thumbnail */}
            <div className="flex-shrink-0 w-28 h-24 md:w-32 md:h-28 rounded-lg overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Image</span>
            </div>

            {/* Right Content */}
            <div className="flex-1 min-w-0">
              {/* Category */}
              <div className="inline-block px-2 py-0.5 bg-red/10 text-red text-xs font-semibold rounded mb-2">
                {pick.category}
              </div>

              {/* Title */}
              <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-red transition-colors">
                {pick.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {pick.description}
              </p>

              {/* Time */}
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{pick.timeAgo}</span>
                <span>•</span>
                <span>{pick.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}