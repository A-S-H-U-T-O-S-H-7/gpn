"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { getActiveCategories, getIconComponent } from "@/lib/services/categoryService";

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const scrollContainerRef = useRef(null);
  const autoScrollInterval = useRef(null);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getActiveCategories();
      if (result.success) {
        setCategories(result.categories);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  // Auto-scroll effect (loop)
  const startAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    
    autoScrollInterval.current = setInterval(() => {
      if (scrollContainerRef.current && !isHovering && !showAll) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }
    }, 3000);
  }, [isHovering, showAll]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  }, []);

  useEffect(() => {
    if (!showAll && categories.length > 0) {
      startAutoScroll();
    }
    return () => stopAutoScroll();
  }, [showAll, categories.length, startAutoScroll, stopAutoScroll]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const displayedCategories = showAll ? categories : categories.slice(0, 6);

  const CategoryCard = ({ category }) => {
    const IconComponent = getIconComponent(category.icon);
    const bgColor = category.backgroundColor || '#ff2b2b';
    
    return (
      <Link
        href={`/category/${category.slug}`}
        className="group flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-800"
      >
        {/* Left Icon - White icon with dynamic background color */}
        <div 
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: bgColor }}
        >
          <IconComponent className="w-5 h-5 text-white" />
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
      </Link>
    );
  };

  if (loading) {
    return (
      <section className="py-8 bg-ghee dark:bg-slate-900/50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-red rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Explore by Category</h2>
          </div>
          <div className="flex gap-4 animate-pulse">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="w-64 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-8 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-red rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Explore by Category
            </h2>
          </div>
          <button
            onClick={() => {
              setShowAll(!showAll);
              if (!showAll) stopAutoScroll();
              else startAutoScroll();
            }}
            className="flex items-center gap-1 px-4 py-2 text-sm text-red hover:text-red-600 font-medium rounded-lg hover:bg-red/10 transition-colors"
          >
            {showAll ? "Show Less ↑" : "View All →"}
          </button>
        </div>

        {/* Horizontal Scrollable View */}
        {!showAll && (
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden lg:group-hover:flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red hover:text-white transition-colors border border-gray-200 dark:border-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

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

            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden lg:group-hover:flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red hover:text-white transition-colors border border-gray-200 dark:border-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Grid View */}
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