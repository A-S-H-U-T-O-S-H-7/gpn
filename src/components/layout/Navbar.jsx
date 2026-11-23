"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu, X, Search, Sun, Moon, LogOut, Bell, BellRing, UserCircle, ChevronDown,
  House, Tv, Newspaper, CirclePlay, Smartphone, BookOpen, Info, LayoutGrid, ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/lib/stores/useAuthStore";
import { getSubscriptionStatus } from "@/lib/services/subscriptionService";
import { getActiveCategories } from "@/lib/services/categoryService";
import SubscribeModal from "../subsription/SubscribeModal";
import useThemeStore from "@/lib/stores/useThemeStore";

const navLinks = [
  { name: "Home", href: "/", icon: House },
  { name: "Live TV", href: "/live-tv", icon: Tv, isLive: true },
  { name: "News", href: "/latestNews", icon: Newspaper },
  { name: "Videos", href: "/latestVideos", icon: CirclePlay },
  { name: "Shorts", href: "/visual-stories", icon: Smartphone },
  { name: "Blogs", href: "/blogs", icon: BookOpen },
  { name: "About Us", href: "/aboutus", icon: Info },
];

// Shared button look for the round icon buttons (search, theme, menu)
const iconButton =
  "inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownTimeout = useRef(null);
  const profileTimeout = useRef(null);
  const categoryRef = useRef(null);
  const profileRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Soft shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
    setIsMobileSearchOpen(false);
  }, [pathname]);

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

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));
  const isCategoryActive = pathname?.startsWith("/category/");

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
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

  const userInitial = (user?.name?.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase();

  const renderThemeToggle = () => (
    <button
      onClick={mounted ? toggleTheme : undefined}
      className={iconButton}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {!mounted ? (
        <span className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600" />
      ) : isDarkMode ? (
        <Sun className="w-[18px] h-[18px]" />
      ) : (
        <Moon className="w-[18px] h-[18px]" />
      )}
    </button>
  );

  const renderSubscribeButton = (extra = "") =>
    isAuthenticated && isSubscribed ? (
      <span
        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30 ${extra}`}
      >
        <BellRing className="w-4 h-4" />
        Subscribed
      </span>
    ) : (
      <button
        onClick={() => {
          handleSubscribeClick();
          setIsMenuOpen(false);
        }}
        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red shadow-sm shadow-red-500/30 hover:shadow-md hover:shadow-red-500/40 hover:brightness-105 active:scale-[0.98] transition-all ${extra}`}
      >
        <Bell className="w-4 h-4" />
        Subscribe
      </button>
    );

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-shadow duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 border-b ${
          scrolled
            ? "shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] border-gray-200/80 dark:border-white/10"
            : "border-gray-100 dark:border-white/5"
        }`}
      >
        {/* Brand accent line */}
        <div className="h-[3px] bg-gradient-to-r from-red-700 via-red to-orange-500" />

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ─── Main row ─────────────────────────────────────────── */}
          <div className="flex items-center h-16 gap-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center" aria-label="Great Post News - Home">
              <Image src="/logo.webp" alt="GPN - Great Post News" width={112} height={112} className="h-14 w-14 object-contain" priority />
            </Link>

            <div className="hidden lg:block w-px h-7 bg-gray-200 dark:bg-white/10 mx-1" />

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 whitespace-nowrap">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                if (link.isLive) {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] xl:text-sm font-semibold transition-colors ${
                        active
                          ? "bg-red text-white"
                          : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20"
                      }`}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${active ? "bg-white" : "bg-red"}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? "bg-white" : "bg-red"}`} />
                      </span>
                      {link.name}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`px-3 py-1.5 rounded-full text-[13px] xl:text-sm font-semibold transition-colors ${
                      active
                        ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Categories mega menu */}
              <div
                ref={categoryRef}
                className="relative"
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <button
                  onClick={() => setIsCategoriesOpen((v) => !v)}
                  aria-expanded={isCategoriesOpen}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] xl:text-sm font-semibold transition-colors ${
                    isCategoriesOpen || isCategoryActive
                      ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  Categories
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? "rotate-180" : ""}`} />
                </button>

                {isCategoriesOpen && (
                  // pt-3 instead of a margin keeps the hover area continuous
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                    <div className="w-[620px] rounded-2xl bg-white dark:bg-slate-800 shadow-2xl shadow-black/10 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden animate-slide-down">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/10 bg-gray-50/80 dark:bg-white/5">
                        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          <LayoutGrid className="w-3.5 h-3.5 text-red" />
                          Browse categories
                        </span>
                        <span className="text-xs text-gray-400">{categories.length} topics</span>
                      </div>
                      <div className="p-3">
                        {loadingCategories ? (
                          <div className="grid grid-cols-3 gap-2">
                            {[...Array(9)].map((_, i) => (
                              <div key={i} className="h-10 rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse" />
                            ))}
                          </div>
                        ) : categories.length > 0 ? (
                          <div className="grid grid-cols-3 gap-1">
                            {categories.map((category) => (
                              <Link
                                key={category.id}
                                href={`/category/${category.slug}`}
                                onClick={() => setIsCategoriesOpen(false)}
                                className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                  pathname === `/category/${category.slug}`
                                    ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-red-600 dark:hover:text-red-400"
                                }`}
                              >
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 text-base group-hover:bg-red-50 dark:group-hover:bg-red-500/10 transition-colors">
                                  {category.iconEmoji || "📰"}
                                </span>
                                <span className="truncate">{category.name}</span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-sm text-gray-500">No categories found</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden xl:block relative w-[220px] 2xl:w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news, videos..."
                aria-label="Search"
                className="w-full h-9 pl-10 pr-4 text-sm rounded-full bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-red/40 focus:ring-4 focus:ring-red/10 focus:outline-none transition-all"
              />
            </form>

            {/* Right side */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Search toggle (below xl) */}
              <button
                data-mobile-search
                onClick={() => {
                  setIsMobileSearchOpen((prev) => !prev);
                  setIsMenuOpen(false);
                }}
                className={`xl:hidden ${iconButton}`}
                aria-label="Toggle search"
              >
                {isMobileSearchOpen ? <X className="w-[18px] h-[18px]" /> : <Search className="w-[18px] h-[18px]" />}
              </button>

              {renderThemeToggle()}

              <div className="hidden sm:block">{renderSubscribeButton()}</div>

              {/* Sign up (logged out) */}
              {!isAuthenticated && (
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 ring-1 ring-gray-200 dark:ring-white/15 hover:bg-gray-50 dark:hover:bg-white/5 hover:ring-gray-300 transition-all"
                >
                  <UserCircle className="w-4 h-4" />
                  Sign Up
                </Link>
              )}

              {/* Account (logged in) */}
              {isAuthenticated && (
                <div
                  ref={profileRef}
                  className="relative hidden sm:block"
                  onMouseEnter={handleProfileMouseEnter}
                  onMouseLeave={handleProfileMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((v) => !v)}
                    aria-expanded={isProfileOpen}
                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full ring-1 ring-gray-200 dark:ring-white/15 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                      {userInitial}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[90px] truncate">
                      {user?.name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-full pt-2 z-50">
                      <div className="w-60 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl shadow-black/10 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden animate-slide-down">
                        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-white/10">
                          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {userInitial}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user?.name || "User"}</p>
                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                        <div className="p-1.5">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hamburger (below lg) */}
              <button
                onClick={() => {
                  setIsMenuOpen((prev) => !prev);
                  setIsMobileSearchOpen(false);
                  setMobileSearchQuery("");
                }}
                className={`lg:hidden ${iconButton}`}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar (below xl) */}
          {isMobileSearchOpen && (
            <div data-mobile-search className="xl:hidden pb-3 animate-slide-down">
              <form onSubmit={handleMobileSearch} className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search news, videos..."
                  aria-label="Search"
                  className="w-full h-11 pl-11 pr-20 rounded-full bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-red/40 focus:ring-4 focus:ring-red/10 focus:outline-none transition-all"
                />
                {mobileSearchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMobileSearchQuery("")}
                    className="absolute right-12 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Clear"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={mobileSearchQuery.trim().length < 2}
                  className="absolute right-1.5 w-8 h-8 inline-flex items-center justify-center rounded-full bg-red text-white disabled:opacity-40 transition-opacity"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ─── Mobile menu ─────────────────────────────────────────── */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-white/10 animate-slide-down">
            <div className="max-h-[calc(100vh-4.25rem)] overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors ${
                        active
                          ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                          active ? "bg-red text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300"
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </span>
                      <span className="flex-1">{link.name}</span>
                      {link.isLive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red text-white text-[10px] font-bold tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          LIVE
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Categories */}
              <div className="rounded-2xl ring-1 ring-gray-100 dark:ring-white/10 overflow-hidden">
                <button
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                  aria-expanded={isMobileCategoriesOpen}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-800 dark:text-gray-100 bg-gray-50/80 dark:bg-white/5"
                >
                  <span className="flex items-center gap-2 font-semibold text-[15px]">
                    <LayoutGrid className="w-4 h-4 text-red" />
                    Categories
                    <span className="text-xs font-medium text-gray-400">({categories.length})</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMobileCategoriesOpen ? "rotate-180" : ""}`} />
                </button>

                {isMobileCategoriesOpen && (
                  <div className="p-2 animate-slide-down">
                    {loadingCategories ? (
                      <div className="text-center py-4 text-sm text-gray-500">Loading categories...</div>
                    ) : categories.length > 0 ? (
                      <div className="grid grid-cols-2 gap-1">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors"
                          >
                            <span className="text-base flex-shrink-0">{category.iconEmoji || "📰"}</span>
                            <span className="truncate">{category.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300 flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-sm text-gray-500">No categories found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Account */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 px-1">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    {userInitial}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user?.name || "User"}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pb-1">
                {renderSubscribeButton("flex-1 py-2.5")}
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-red-600 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 ring-1 ring-gray-200 dark:ring-white/15 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <UserCircle className="w-4 h-4" />
                    Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
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
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.18s ease forwards;
        }
      `}</style>
    </>
  );
}
