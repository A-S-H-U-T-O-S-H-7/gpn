"use client";

import { useState, useEffect } from "react";
import { Sparkles, Star, Palette, Hash, Clock, ChevronRight } from "lucide-react";
import { zodiacSigns, getHoroscopeForHomepage } from "@/lib/services/horoscopeService";

export default function HoroscopeSection() {
  const [selectedSign, setSelectedSign] = useState("aries");
  const [showDetails, setShowDetails] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHoroscope = async () => {
      setLoading(true);
      const result = await getHoroscopeForHomepage(selectedSign);
      if (result.success) {
        setHoroscopeData(result.horoscope);
      }
      setLoading(false);
    };
    fetchHoroscope();
  }, [selectedSign]);

  const selectedZodiac = zodiacSigns.find(s => s.id === selectedSign);

  return (
    <section className="py-12 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-7 bg-red rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Daily Horoscope
          </h2>
          <Sparkles className="w-5 h-5 text-red" />
        </div>

        {/* Main Horoscope Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left - Selected Zodiac Info */}
            <div className="bg-gradient-to-br from-red/10 to-red/5 p-6 lg:p-8 text-center">
              <div className="text-6xl mb-3">{selectedZodiac?.symbol}</div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {selectedZodiac?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedZodiac?.date}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-red/20 text-red text-xs font-semibold rounded-full">
                {selectedZodiac?.element} Sign
              </span>
            </div>

            {/* Center - Horoscope Prediction */}
            <div className="lg:col-span-2 p-6 lg:p-8">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-red border-t-transparent rounded-full animate-spin" />
                </div>
              ) : horoscopeData ? (
                <>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                    "{horoscopeData.prediction}"
                  </p>
                  
                  <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Lucky Color</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{horoscopeData.luckyColor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Hash className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Lucky Number</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{horoscopeData.luckyNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Lucky Time</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{horoscopeData.luckyTime || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Mood</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{horoscopeData.mood || "—"}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">Unable to load horoscope</p>
              )}
            </div>
          </div>
        </div>

        {/* All Zodiac Signs Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Zodiac Signs
            </h3>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-red hover:text-red-600 font-medium flex items-center gap-1"
            >
              {showDetails ? "Show Less ↑" : "Show Details ↓"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.id}
                onClick={() => setSelectedSign(sign.id)}
                className={`group p-3 rounded-xl text-center transition-all duration-300 ${
                  selectedSign === sign.id
                    ? "bg-red text-white shadow-lg scale-105"
                    : "bg-white dark:bg-slate-900 hover:bg-red/10 hover:scale-105 shadow-sm"
                }`}
              >
                <div className="text-3xl mb-1">{sign.symbol}</div>
                <div className={`font-semibold text-sm ${
                  selectedSign === sign.id
                    ? "text-white"
                    : "text-gray-900 dark:text-white"
                }`}>
                  {sign.name}
                </div>
                {showDetails && (
                  <div className={`text-xs mt-1 ${
                    selectedSign === sign.id
                      ? "text-white/80"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {sign.date.split(" - ")[0]}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

       
      </div>
    </section>
  );
}