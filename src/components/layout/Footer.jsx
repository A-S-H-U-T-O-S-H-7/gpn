"use client";

import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1 - Logo & About */}
          <div className="lg:col-span-1">
            {/* Logo with Text */}
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.webp"
                alt="GPN - Great Post News"
                width={56}
                height={56}
                className="h-14 w-auto"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">GPN</h2>
                <p className="text-xs text-gray-400 -mt-1">Great Post News</p>
              </div>
            </div>
            <p className="text-gray-400 dark:text-gray-500 mb-4 leading-relaxed text-sm">
              Your trusted source for breaking news, in-depth analysis, and engaging stories from around the world.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-800 hover:bg-red hover:text-white flex items-center justify-center transition-all duration-300 group">
                <FaFacebookF className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-800 hover:bg-red hover:text-white flex items-center justify-center transition-all duration-300 group">
                <FaTwitter className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-800 hover:bg-red hover:text-white flex items-center justify-center transition-all duration-300 group">
                <FaInstagram className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-800 hover:bg-red hover:text-white flex items-center justify-center transition-all duration-300 group">
                <FaYoutube className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-800 hover:bg-red hover:text-white flex items-center justify-center transition-all duration-300 group">
                <FaLinkedinIn className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-white dark:text-gray-200 font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Home</a></li>
              <li><a href="/live-tv" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Live TV</a></li>
              <li><a href="/blogs" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Blogs</a></li>
              <li><a href="/about" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">About Us</a></li>
              <li><a href="/subscribe" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Subscribe</a></li>
            </ul>
          </div>

          {/* Column 3 - Categories */}
          <div>
            <h3 className="text-white dark:text-gray-200 font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-3">
              <li><a href="/category/world" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">World</a></li>
              <li><a href="/category/india" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">India</a></li>
              <li><a href="/category/business" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Business</a></li>
              <li><a href="/category/technology" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Technology</a></li>
              <li><a href="/category/sports" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Sports</a></li>
              <li><a href="/category/entertainment" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Entertainment</a></li>
            </ul>
          </div>

          {/* Column 4 - Support */}
          <div>
            <h3 className="text-white dark:text-gray-200 font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="/contact" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Contact Us</a></li>
              <li><a href="/privacy-policy" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Terms of Use</a></li>
              <li><a href="/cookie-policy" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Cookie Policy</a></li>
              <li><a href="/advertise" className="text-gray-400 dark:text-gray-500 hover:text-red hover:translate-x-1 transition-all duration-200 text-sm inline-block">Advertise With Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div className="border-t border-gray-800 dark:border-gray-800 mt-10 pt-6 text-center">
          <p className="text-gray-500 dark:text-gray-600 text-sm">
            © {new Date().getFullYear()} Great Post News. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}