"use client";

import { Star, Sparkles, MessageCircle, Heart, ExternalLink, Download } from "lucide-react";
import Image from "next/image";

export default function MyAstroBanner() {
  return (
    <section className="py-3 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner - Purple Theme */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 shadow-xl">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          {/* Stars Decoration */}
          <div className="absolute top-4 right-8 opacity-30">
            <Star className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="absolute bottom-6 left-12 opacity-20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="absolute top-12 left-24 opacity-25">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
          
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Left Side - Logo & Info */}
              <div className="flex items-center gap-4 md:gap-6">
                {/* Logo */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                  <Image
                    src="/Myastrologo_w.png"
                    alt="MyAstro"
                    width={60}
                    height={60}
                    className="w-12 h-12 md:w-16 md:h-16 object-contain"
                  />
                </div>
                
                {/* Text Content */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      MyAstro
                    </h3>
                    <Heart className="w-5 h-5 text-pink-300 fill-pink-300" />
                  </div>
                  <p className="text-purple-100 text-sm md:text-base max-w-md">
                    Talk to Certified Astrologers • Get Personalized Predictions • 24/7 Available
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </div>
                    <span className="text-purple-200 text-xs">4.9 • 50K+ Reviews</span>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Website Button */}
                <a
                  href="https://myastro.org.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-300 group"
                >
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Visit Website
                </a>
                
                {/* Play Store Button */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.myastro.user"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-purple-700 hover:bg-gray-100 rounded-xl font-semibold transition-all duration-300 group shadow-lg"
                >
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Get App on Play Store
                </a>
              </div>
            </div>
            
            {/* Quick Features Row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-200" />
                <span className="text-purple-100 text-xs">Chat with Astrologers</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span className="text-purple-100 text-xs">Daily Horoscope</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-purple-200" />
                <span className="text-purple-100 text-xs">100% Private & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-200" />
                <span className="text-purple-100 text-xs">Certified Experts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}