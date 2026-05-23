"use client";

import { 
  Quote, 
  Heart, 
  Star, 
  Rocket, 
  Award,
  Calendar,
  Sparkles,
  Users,
  ArrowRight
} from "lucide-react";

// Team Members
const teamMembers = [
  { id: 1, name: "Dr. Manoranjan Mohanty", designation: "Founder & Chairman" },
  { id: 2, name: "Rajesh Khanna", designation: "Chief Executive Officer" },
  { id: 3, name: "Priya Mehta", designation: "Senior Editor" },
  { id: 4, name: "Amit Sharma", designation: "Managing Editor" },
  { id: 5, name: "Neha Verma", designation: "Content Director" },
  { id: 6, name: "Vikram Singh", designation: "News Director" },
  { id: 7, name: "Anjali Kapoor", designation: "Social Media Director" },
  { id: 8, name: "Saurav Das", designation: "Tech Lead" },
];

// Core Values
const values = [
  { id: 1, title: "Truth First", description: "Uncompromising commitment to factual reporting", icon: Star },
  { id: 2, title: "Innovation", description: "Embracing cutting-edge tech for storytelling", icon: Rocket },
  { id: 3, title: "Integrity", description: "Ethical journalism above everything", icon: Heart },
  { id: 4, title: "Excellence", description: "Highest standards in every story", icon: Award },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900/50">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-white dark:from-slate-900 dark:via-red-950/20 dark:to-slate-900">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            {/* Founding Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red/10 dark:bg-red-500/20 rounded-full mb-5">
              <Calendar className="w-3.5 h-3.5 text-red" />
              <span className="text-red text-xs font-semibold">Founded October 2023</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 leading-[1.1] tracking-tight">
              Great Post
              <br />
              <span className="text-red">News</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
              A video-first news platform built on trust, speed, and uncompromising journalistic standards.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-12 bg-white dark:bg-slate-900/50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Story Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-8 h-0.5 bg-red"></div>
                <span className="text-red text-xs font-semibold tracking-wide">OUR STORY</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                From Vision to Reality
              </h2>
              <div className="space-y-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                <p>
                  In October 2023, <span className="text-red font-semibold">Dr. Manoranjan Mohanty</span> founded 
                  Great Post News with a singular vision: to create a news platform that puts video first 
                  while maintaining the highest standards of journalistic integrity.
                </p>
                <p>
                  In an era of information overload, GPN emerged as a beacon of reliable, fact-based journalism. 
                  Our team works around the clock to bring you breaking news, in-depth analysis, and compelling 
                  video content from every corner of the globe.
                </p>
                <p>
                  Today, GPN reaches millions of readers worldwide, serving as a trusted source for those who 
                  demand accuracy, speed, and depth in their news consumption.
                </p>
              </div>
            </div>

            {/* Quote Card */}
            <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-6 border border-rose-100 dark:border-rose-900/30">
              <Quote className="w-8 h-8 text-rose-400 dark:text-rose-500/60 mb-3" />
              <p className="text-lg md:text-xl font-serif italic text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                "News should inform, inspire, and empower. At GPN, we're building more than a news platform — 
                we're building a movement for truth in journalism."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Dr. Manoranjan Mohanty</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Founder & Chairman, GPN</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section - Sky Blue */}
      <div className="py-12 bg-gradient-to-br from-sky-50 via-blue-50 to-white dark:from-sky-950/30 dark:via-blue-950/20 dark:to-slate-900">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-sky-600 dark:text-sky-400 text-xs font-semibold tracking-wide">CORE VALUES</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              What We Stand For
            </h2>
            <div className="w-12 h-0.5 bg-sky-400 dark:bg-sky-500 mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.id}
                  className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-5 border border-sky-100 dark:border-sky-800/50 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section - Emerald */}
      <div className="py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-900">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide">OUR PEOPLE</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              The Team Behind GPN
            </h2>
            <div className="w-12 h-0.5 bg-emerald-400 dark:bg-emerald-500 mx-auto mt-3"></div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 max-w-xl mx-auto">
              Passionate journalists, editors, and creators dedicated to bringing you the best in news.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-emerald-100 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-300"
              >
                <div className="h-40 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <span className="text-lg text-white font-bold">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">{member.designation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestone Footer */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/30 border-t border-amber-100 dark:border-amber-900/30">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              <span className="text-gray-600 dark:text-gray-400 text-xs">Founded October 2023</span>
            </div>
            <div className="hidden sm:block w-px h-3 bg-amber-200 dark:bg-amber-800"></div>
            <p className="text-gray-500 dark:text-gray-500 text-xs">
              From vision to reality — delivering truth every day
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}