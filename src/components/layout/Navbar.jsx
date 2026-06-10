"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, Sun, Moon, LogOut, Bell, UserCircle, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/stores/useAuthStore";
import { getSubscriptionStatus } from "@/lib/services/subscriptionService";
import { getActiveCategories } from "@/lib/services/categoryService";
import SubscribeModal from "../subsription/SubscribeModal";
import useThemeStore from "@/lib/stores/useThemeStore";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const router = useRouter();
  const dropdownTimeout = useRef(null);
  const profileTimeout = useRef(null);
  const categoryRef = useRef(null);
  const profileRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const result = await getActiveCategories();
        if (result.success) {
          setCategories(result.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Check subscription status when user is authenticated
  useEffect(() => {
    const checkSubscription = async () => {
      if (isAuthenticated && user?.email) {
        const result = await getSubscriptionStatus(user?.uid, user?.email);
        if (result.success) {
          setIsSubscribed(result.isSubscribed);
        }
      } else {
        setIsSubscribed(false);
      }
    };
    checkSubscription();
  }, [isAuthenticated, user]);

  // Auto-focus mobile search input when opened
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  // Close mobile search on outside click
  useEffect(() => {
    if (!isMobileSearchOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-mobile-search]")) {
        setIsMobileSearchOpen(false);
        setMobileSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileSearchOpen]);

  // Handle category dropdown hover with delay (Desktop Mega Menu)
  const handleCategoryMouseEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setIsCategoriesOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsCategoriesOpen(false);
    }, 200);
  };

  // Handle profile dropdown with proper delay to prevent gap issues
  const handleProfileMouseEnter = () => {
    if (profileTimeout.current) clearTimeout(profileTimeout.current);
    setIsProfileOpen(true);
  };

  const handleProfileMouseLeave = () => {
    profileTimeout.current = setTimeout(() => {
      setIsProfileOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
      if (profileTimeout.current) clearTimeout(profileTimeout.current);
    };
  }, []);

  // Handle desktop search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // Handle mobile search submission
  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchQuery("");
      setIsMobileSearchOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Live TV", href: "/live-tv", hasLiveBadge: true },
    { name: "Blogs", href: "/blogs" },
    { name: "About Us", href: "/aboutus" },
  ];

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    router.push("/");
  };

  const handleSubscribeClick = () => {
    if (!isAuthenticated) {
      router.push("/signup");
    } else {
      setIsSubscribeModalOpen(true);
    }
  };

  const handleSubscribeSuccess = () => {
    setIsSubscribed(true);
    setIsSubscribeModalOpen(false);
  };

  const renderThemeToggle = () => {
    if (!mounted) {
      return (
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </button>
      );
    }
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-gray-300" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>
    );
  };

  // Split categories into 3 columns for mega menu
  const categoryColumns = [[], [], []];
  categories.forEach((category, index) => {
    categoryColumns[index % 3].push(category);
  });

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ─── Main nav row ─────────────────────────────────────────── */}
          <div className="flex items-center h-16 gap-2">

            {/* LEFT: Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center">
                <Image
                  src="/logo.webp"
                  alt="GPN - Great Post News"
                  width={100}
                  height={50}
                  className="h-16 w-23"
                  priority
                />
              </a>
            </div>

            {/* LEFT: Desktop nav links */}
            <div className="hidden md:flex items-center space-x-6 ml-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-red dark:hover:text-red transition-colors font-medium"
                >
                  {link.name}
                  {link.hasLiveBadge && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red" />
                    </span>
                  )}
                </a>
              ))}

              {/* Categories Dropdown - Mega Menu */}
              <div
                ref={categoryRef}
                className="relative"
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <button className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-red dark:hover:text-red transition-colors font-medium">
                  Categories
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mega Menu Dropdown */}
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[600px] rounded-xl shadow-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-slide-down">
                    <div className="p-6">
                      {loadingCategories ? (
                        <div className="text-center py-8 text-gray-500">Loading categories...</div>
                      ) : categories.length > 0 ? (
                        <div className="grid grid-cols-3 gap-6">
                          {categoryColumns.map((column, colIndex) => (
                            <div key={colIndex} className="space-y-2">
                              {column.map((category) => (
                                <Link
                                  key={category.id}
                                  href={`/category/${category.slug}`}
                                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red rounded-lg transition-colors group"
                                  onClick={() => setIsCategoriesOpen(false)}
                                >
                                  <span className="text-xl">{category.iconEmoji || "📰"}</span>
                                  <span className="font-medium">{category.name}</span>
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">No categories found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CENTER: Desktop Search Bar */}
            <div className="hidden lg:flex w-full max-w-sm xl:max-w-md mx-6">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news, videos..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-colors"
                />
                <button type="submit" className="absolute left-3 top-2.5">
                  <Search className="w-4 h-4 text-gray-400" />
                </button>
              </form>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right-side icon strip */}
            <div className="flex items-center gap-1 flex-shrink-0">

              {/* Mobile search toggle */}
              <button
                data-mobile-search
                onClick={() => {
                  setIsMobileSearchOpen((prev) => !prev);
                  setIsMenuOpen(false);
                }}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle search"
              >
                {isMobileSearchOpen
                  ? <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  : <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                }
              </button>

              {/* Theme toggle */}
              {renderThemeToggle()}

              {/* Subscribe button */}
              {isAuthenticated && isSubscribed ? (
                <button
                  disabled
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm cursor-default"
                >
                  <Bell className="w-4 h-4" />
                  Subscribed
                </button>
              ) : (
                <button
                  onClick={handleSubscribeClick}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                >
                  <Bell className="w-4 h-4" />
                  Subscribe
                </button>
              )}

              {/* Login button for non-authenticated users */}
              {!isAuthenticated && (
                <Link
                  href="/signup"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sign Up</span>
                </Link>
              )}

              {/* User account dropdown - FIXED GAP ISSUE */}
              {isAuthenticated && (
                <div
                  ref={profileRef}
                  className="relative hidden sm:block"
                  onMouseEnter={handleProfileMouseEnter}
                  onMouseLeave={handleProfileMouseLeave}
                >
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    <div className="w-7 h-7 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 rounded-xl shadow-xl border z-50 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-down">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {user?.name || "User"}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => {
                  setIsMenuOpen((prev) => !prev);
                  setIsMobileSearchOpen(false);
                  setMobileSearchQuery("");
                }}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen
                  ? <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  : <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                }
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div data-mobile-search className="lg:hidden pb-3 pt-1 animate-slide-down">
              <form onSubmit={handleMobileSearch} className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search news, videos..."
                  className="w-full py-2.5 pl-9 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-colors"
                />
                {mobileSearchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMobileSearchQuery("")}
                    className="absolute right-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Clear"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={mobileSearchQuery.trim().length < 2}
                  className="absolute right-2 p-1.5 rounded-md bg-red text-white disabled:opacity-40 transition-opacity"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors py-2.5 px-3 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                    {link.hasLiveBadge && (
                      <span className="text-xs text-red font-semibold tracking-wide">LIVE</span>
                    )}
                  </a>
                ))}

                {/* Mobile Categories Section - Expandable/Collapsible with 2 columns */}
                <div className="pt-3">
                  <button
                    onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📂</span>
                      <span className="font-medium">Categories</span>
                      <span className="text-xs text-gray-400">({categories.length})</span>
                    </div>
                    {isMobileCategoriesOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isMobileCategoriesOpen && (
                    <div className="mt-2 px-2 animate-slide-down">
                      {loadingCategories ? (
                        <div className="text-center py-4 text-sm text-gray-500">Loading categories...</div>
                      ) : categories.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/category/${category.slug}`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red rounded-lg transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="text-base flex-shrink-0">{category.iconEmoji || "📰"}</span>
                              <span className="truncate">{category.name}</span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-sm text-gray-500">No categories found</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Auth / Subscribe row */}
                <div className="flex gap-3 pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
                  {isAuthenticated && isSubscribed ? (
                    <button
                      disabled
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm cursor-default flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      Subscribed
                    </button>
                  ) : (
                    <button
                      onClick={() => { handleSubscribeClick(); setIsMenuOpen(false); }}
                      className="flex-1 px-4 py-2 bg-red text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      Subscribe
                    </button>
                  )}
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/signup"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-sm text-center flex items-center justify-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircle className="w-4 h-4" />
                      Sign Up
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Subscribe Modal */}
      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        onSuccess={handleSubscribeSuccess}
        isDark={isDarkMode}
      />

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.18s ease forwards;
        }
      `}</style>
    </>
  );
}