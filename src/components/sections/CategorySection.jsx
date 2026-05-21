"use client";

import { useState, useRef } from "react";
import { 
  Globe, 
  IndianRupee, 
  Briefcase, 
  Cpu, 
  Trophy, 
  Clapperboard,
  GraduationCap,
  Heart,
  Leaf,
  Apple,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "World",
    description: "Latest global updates",
    icon: Globe,
    slug: "world",
  },
  {
    id: 2,
    name: "India",
    description: "National news & more",
    icon: IndianRupee,
    slug: "india",
  },
  {
    id: 3,
    name: "Business",
    description: "Market & Economy",
    icon: Briefcase,
    slug: "business",
  },
  {
    id: 4,
    name: "Technology",
    description: "Tech & Innovation",
    icon: Cpu,
    slug: "technology",
  },
  {
    id: 5,
    name: "Sports",
    description: "Live scores & news",
    icon: Trophy,
    slug: "sports",
  },
  {
    id: 6,
    name: "Entertainment",
    description: "Movies & Celebrities",
    icon: Clapperboard,
    slug: "entertainment",
  },
  {
    id: 7,
    name: "Education",
    description: "Learning & Careers",
    icon: GraduationCap,
    slug: "education",
  },
  {
    id: 8,
    name: "Health",
    description: "Wellness & Medicine",
    icon: Heart,
    slug: "health",
  },
  {
    id: 9,
    name: "Lifestyle",
    description: "Fashion & Living",
    icon: Leaf,
    slug: "lifestyle",
  },
  {
    id: 10,
    name: "Food",
    description: "Recipes & Dining",
    icon: Apple,
    slug: "food",
  },
];

export default function CategorySection() {
  const [showAll, setShowAll] = useState(false);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Display first 6 categories in horizontal mode, all in grid mode
  const displayedCategories = showAll ? categories : categories.slice(0, 6);

  // Reusable category card component
  const CategoryCard = ({ category }) => {
    const IconComponent = category.icon;
    return (
      <a
        href={`/category/${category.slug}`}
        className="group flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      >
        {/* Left Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red/10 flex items-center justify-center group-hover:bg-red/20 transition-colors">
          <IconComponent className="w-5 h-5 text-red" />
        </div>
        
        {/* Right Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
            {category.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {category.description}
          </p>
        </div>
      </a>
    );
  };

  return (
    <section className="py-8 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Red Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Red Bar */}
            <div className="w-1 h-7 bg-red rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Explore by Category
            </h2>
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 px-4 py-2 text-sm text-red hover:text-red-600 font-medium rounded-lg hover:bg-red/10 transition-colors"
          >
            {showAll ? "Show Less ↑" : "View All →"}
          </button>
        </div>

        {/* Horizontal Scrollable View (when not expanded) */}
        {!showAll && (
          <div className="relative group">
            {/* Left Scroll Button */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden lg:group-hover:flex items-center justify-center w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-md hover:bg-red hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {displayedCategories.map((category) => (
                <div key={category.id} className="flex-shrink-0 w-64">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden lg:group-hover:flex items-center justify-center w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-md hover:bg-red hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Grid View (when expanded) */}
        {showAll && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}