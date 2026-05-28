"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search, Sun, Moon, User, LogOut, Bell, BellOff, UserCircle } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/stores/useAuthStore";
import { getSubscriptionStatus } from "@/lib/services/subscriptionService";
import SubscribeModal from "../subsription/SubscribeModal";
import useThemeStore from "@/lib/stores/useThemeStore";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
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
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {theme === "dark" ? (
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

              {/* Login/Logout Button */}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Login</span>
                </Link>
              )}

              {/* User Avatar (only when logged in) - Optional, shows name */}
              {isAuthenticated && (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-7 h-7 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                </button>
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
                <div className="flex gap-3 pt-2">
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

      {/* Profile Dropdown */}
      {isProfileOpen && isAuthenticated && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsProfileOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl border z-50 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" style={{ top: "60px", right: "20px" }}>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {user?.email}
              </p>
            </div>
            <div className="py-2">
              <Link
                href="/profile"
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                onClick={() => setIsProfileOpen(false)}
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Subscribe Modal */}
      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        onSuccess={handleSubscribeSuccess}
        isDark={isDarkMode}
      />
    </>
  );
}