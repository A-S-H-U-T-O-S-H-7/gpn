"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, Sun, Moon, LogOut, Bell, UserCircle, ChevronDown } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const router = useRouter();
  const dropdownTimeout = useRef(null);
  const categoryRef = useRef(null);

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

  // Handle category dropdown hover with delay
  const handleCategoryMouseEnter = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setIsCategoriesOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsCategoriesOpen(false);
    }, 200);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout.current) {
        clearTimeout(dropdownTimeout.current);
      }
    };
  }, []);

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
      router.push("/login");
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

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-red dark:hover:text-red transition-colors font-medium"
                >
                  {link.name}
                  {link.hasLiveBadge && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red"></span>
                    </span>
                  )}
                </a>
              ))}

              {/* Categories Dropdown */}
              <div
                ref={categoryRef}
                className="relative"
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <button
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-red dark:hover:text-red transition-colors font-medium group"
                >
                  Categories
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-xl shadow-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-slide-down">
                    <div className="py-2">
                      {loadingCategories ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          Loading...
                        </div>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red transition-colors group"
                            onClick={() => setIsCategoriesOpen(false)}
                          >
                            <span className="text-lg">{category.iconEmoji || "📰"}</span>
                            <span className="font-medium">{category.name}</span>
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          No categories found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search news, videos..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-colors"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-3">
              {/* Search icon for mobile */}
              <button className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              {/* Theme Toggle */}
              {renderThemeToggle()}

              {/* Subscribe Button */}
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

              {/* Login Button */}
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Login</span>
                </Link>
              )}

              {/* User account dropdown */}
              {isAuthenticated && (
                <div
                  className="relative hidden sm:block"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(true)}
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
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-xl border z-50 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-down">
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
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col space-y-3">
                <div className="relative w-full mb-2">
                  <input
                    type="text"
                    placeholder="Search news, videos..."
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                    {link.hasLiveBadge && (
                      <span className="text-xs text-red font-semibold">LIVE</span>
                    )}
                  </a>
                ))}

                {/* Categories Section in Mobile Menu */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {loadingCategories ? (
                      <div className="col-span-2 text-center py-2 text-sm text-gray-500">Loading...</div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-base">{category.iconEmoji || "📰"}</span>
                          <span>{category.name}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-2 text-sm text-gray-500">
                        No categories found
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
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
                      onClick={handleSubscribeClick}
                      className="flex-1 px-4 py-2 bg-red text-white rounded-lg font-medium text-sm"
                    >
                      Subscribe
                    </button>
                  )}
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-sm text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
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

      {/* Add animation CSS for dropdown */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.2s ease forwards;
        }
      `}</style>
    </>
  );
}
