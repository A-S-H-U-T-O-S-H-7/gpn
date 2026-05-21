"use client";

import { useState } from "react";
import { Sparkles, Star, Palette, Hash, ChevronRight } from "lucide-react";

// Zodiac signs data
const zodiacSigns = [
  { id: 1, name: "Aries", symbol: "♈", date: "Mar 21 - Apr 19", element: "Fire" },
  { id: 2, name: "Taurus", symbol: "♉", date: "Apr 20 - May 20", element: "Earth" },
  { id: 3, name: "Gemini", symbol: "♊", date: "May 21 - Jun 20", element: "Air" },
  { id: 4, name: "Cancer", symbol: "♋", date: "Jun 21 - Jul 22", element: "Water" },
  { id: 5, name: "Leo", symbol: "♌", date: "Jul 23 - Aug 22", element: "Fire" },
  { id: 6, name: "Virgo", symbol: "♍", date: "Aug 23 - Sep 22", element: "Earth" },
  { id: 7, name: "Libra", symbol: "♎", date: "Sep 23 - Oct 22", element: "Air" },
  { id: 8, name: "Scorpio", symbol: "♏", date: "Oct 23 - Nov 21", element: "Water" },
  { id: 9, name: "Sagittarius", symbol: "♐", date: "Nov 22 - Dec 21", element: "Fire" },
  { id: 10, name: "Capricorn", symbol: "♑", date: "Dec 22 - Jan 19", element: "Earth" },
  { id: 11, name: "Aquarius", symbol: "♒", date: "Jan 20 - Feb 18", element: "Air" },
  { id: 12, name: "Pisces", symbol: "♓", date: "Feb 19 - Mar 20", element: "Water" },
];

// Mock horoscope data (will be replaced with API)
const getHoroscopeData = (signName) => {
  // This will be replaced with actual API call
  const horoscopes = {
    Aries: { prediction: "Your energy is high today. Take on new challenges!", luckyColor: "Red", luckyNumber: "7" },
    Taurus: { prediction: "Financial opportunities are coming your way.", luckyColor: "Green", luckyNumber: "3" },
    Gemini: { prediction: "Communication brings positive changes.", luckyColor: "Yellow", luckyNumber: "5" },
    Cancer: { prediction: "Family matters bring you joy today.", luckyColor: "White", luckyNumber: "2" },
    Leo: { prediction: "Your creativity shines brightly.", luckyColor: "Orange", luckyNumber: "9" },
    Virgo: { prediction: "Organization leads to success.", luckyColor: "Brown", luckyNumber: "4" },
    Libra: { prediction: "Balance brings harmony to relationships.", luckyColor: "Pink", luckyNumber: "6" },
    Scorpio: { prediction: "Deep insights reveal hidden truths.", luckyColor: "Black", luckyNumber: "8" },
    Sagittarius: { prediction: "Adventure calls your name today.", luckyColor: "Purple", luckyNumber: "1" },
    Capricorn: { prediction: "Hard work pays off significantly.", luckyColor: "Grey", luckyNumber: "5" },
    Aquarius: { prediction: "Innovative ideas flow freely.", luckyColor: "Blue", luckyNumber: "3" },
    Pisces: { prediction: "Intuition guides you correctly.", luckyColor: "Sea Green", luckyNumber: "7" },
  };
  return horoscopes[signName] || { prediction: "Today brings positive energy your way.", luckyColor: "Gold", luckyNumber: "9" };
};

export default function HoroscopeSection() {
  const [selectedSign, setSelectedSign] = useState("Aries");
  const [showDetails, setShowDetails] = useState(false);
  
  const selectedData = getHoroscopeData(selectedSign);
  const selectedZodiac = zodiacSigns.find(s => s.name === selectedSign);

  return (
    <section className="py-10 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Red Bar */}
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
                {selectedSign}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedZodiac?.date}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-red/20 text-red text-xs font-semibold rounded-full">
                {selectedZodiac?.element} Sign
              </span>
            </div>

            {/* Center - Horoscope Prediction */}
            <div className="lg:col-span-2 p-6 lg:p-8">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                "{selectedData.prediction}"
              </p>
              
              {/* Lucky Info Row */}
              <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Lucky Color</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedData.luckyColor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Hash className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Lucky Number</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedData.luckyNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Element</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedZodiac?.element}</p>
                  </div>
                </div>
              </div>
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
                onClick={() => setSelectedSign(sign.name)}
                className={`group p-3 rounded-xl text-center transition-all duration-300 ${
                  selectedSign === sign.name
                    ? "bg-red text-white shadow-lg scale-105"
                    : "bg-white dark:bg-slate-900 hover:bg-red/10 hover:scale-105 shadow-sm"
                }`}
              >
                <div className="text-3xl mb-1">{sign.symbol}</div>
                <div className={`font-semibold text-sm ${
                  selectedSign === sign.name
                    ? "text-white"
                    : "text-gray-900 dark:text-white"
                }`}>
                  {sign.name}
                </div>
                {showDetails && (
                  <div className={`text-xs mt-1 ${
                    selectedSign === sign.name
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