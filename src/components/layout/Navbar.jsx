"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Live TV", href: "/live-tv", hasLiveBadge: true },
    { name: "Blogs", href: "/blogs" },
    { name: "About Us", href: "/about" },
  ];

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
            <button className="hidden sm:block px-4 py-2 bg-red text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm">
              Subscribe
            </button>

            {/* Login Button */}
            <button className="hidden sm:block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red dark:hover:text-red transition-colors font-medium text-sm">
              Login
            </button>

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
              {/* Search input in mobile */}
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
                <button className="flex-1 px-4 py-2 bg-red text-white rounded-lg font-medium text-sm">
                  Subscribe
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-sm">
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}