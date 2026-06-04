"use client";

import { useEffect, useRef, useState } from "react";
import {
  Quote,
  Heart,
  Star,
  Rocket,
  Award,
  Calendar,
  Sparkles,
  Users,
  Shield,
  Zap,
  Globe,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

/* ─── Data ──────────────────────────────────────────────────────── */

// Founder — rendered as a featured hero card
const founder = {
  id: 1,
  name: "Manoranjan Mohanty",
  designation: "Founder",
  initials: "MM",
  color: "from-red-500 to-rose-600",
};

// Rest of the team — 6 members
const teamMembers = [
  { id: 2, name: "Manbir Singh Negi", designation: "Senior Cameraman & Video Editor", initials: "MN", color: "from-orange-500 to-amber-600"  },
  { id: 3, name: "Deepak Kumar",      designation: "Animation & Video Editor",         initials: "DK", color: "from-violet-500 to-purple-600" },
  { id: 4, name: "Manish Batra",      designation: "Team Member",                      initials: "MB", color: "from-sky-500    to-blue-600"   },
  { id: 5, name: "Lal Yadav",         designation: "SEO Specialist",                   initials: "LY", color: "from-emerald-500 to-teal-600"  },
  { id: 6, name: "Ankita Mohanty",    designation: "Social Media Handler",             initials: "AM", color: "from-pink-500   to-rose-500"   },
  { id: 7, name: "Reva Solanki",      designation: "Manager",                          initials: "RS", color: "from-indigo-500 to-blue-600"   },
];

const values = [
  {
    id: 1,
    title: "Truth First",
    description: "Every story we publish is rigorously fact-checked. We hold accuracy above speed.",
    icon: Shield,
    accent: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-300 dark:border-red-900/40",
    iconBg: "bg-red-100 dark:bg-red-900/50",
  },
  {
    id: 2,
    title: "Innovation",
    description: "We pioneer video-first journalism, embracing new formats to reach you where you are.",
    icon: Zap,
    accent: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-300 dark:border-amber-900/40",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
  },
  {
    id: 3,
    title: "Integrity",
    description: "Independence from political or commercial influence is non-negotiable at GPN.",
    icon: Heart,
    accent: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-300 dark:border-emerald-900/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
  },
  {
    id: 4,
    title: "Global Reach",
    description: "Millions of readers across the world trust GPN for breaking news and analysis.",
    icon: Globe,
    accent: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-300 dark:border-sky-900/40",
    iconBg: "bg-sky-100 dark:bg-sky-900/50",
  },
];

const stats = [
  { label: "Founded",         value: "2023",  suffix: "" },
  { label: "Monthly Readers", value: "10",    suffix: "M+" },
  { label: "Team Members",    value: "50",    suffix: "+" },
  { label: "Stories Published",value: "25",   suffix: "K+" },
];

/* ─── Intersection-observer fade-in hook ─────────────────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function SectionLabel({ icon: Icon, text, accent = "text-red-500" }) {
  return (
    <div className={`inline-flex items-center gap-2 mb-3 ${accent}`}>
      <Icon className="w-4 h-4" />
      <span className="text-xs font-bold tracking-widest uppercase">{text}</span>
    </div>
  );
}

function FadeSection({ children, delay = 0, className = "" }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">

      {/* ══════════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden">
        {/* Desktop banner */}
        <div className="hidden md:block relative w-full" style={{ aspectRatio: "3/1" }}>
          <Image
            src="/aboutus_d.png"
            alt="Great Post News — About Us"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
        </div>

        {/* Mobile banner */}
        <div className="block md:hidden relative w-full" style={{ aspectRatio: "4/3" }}>
          <Image
            src="/aboutus_m.png"
            alt="Great Post News — About Us"
            fill
            priority
            className="object-contain object-center"
            sizes="90vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20  to-black/10" />
        </div>

        
      </section>

      
      {/* ══════════════════════════════════════════════
          OUR STORY
      ══════════════════════════════════════════════ */}
      <section className="py-10 md:py-12 bg-white dark:bg-slate-950">
        <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

            {/* Story text */}
            <FadeSection>
              <SectionLabel icon={Sparkles} text="Our Story" accent="text-red-500" />
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-5">
                From Vision <br className="hidden sm:block" />
                <span className="text-red-500">to Reality</span>
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                <p>
                  In October 2023,{" "}
                  <span className="font-bold text-gray-900 dark:text-white">Dr. Manoranjan Mohanty</span>{" "}
                  founded Great Post News with a singular vision: to create a news platform that puts video
                  first while maintaining the highest standards of journalistic integrity.
                </p>
                <p>
                  In an era of information overload, GPN emerged as a beacon of reliable, fact-based
                  journalism. Our team works around the clock to bring you breaking news, in-depth analysis,
                  and compelling video content from every corner of the globe.
                </p>
                <p>
                  Today, GPN reaches millions of readers worldwide, serving as a trusted source for those
                  who demand accuracy, speed, and depth in their news consumption.
                </p>
              </div>

              {/* Inline CTA breadcrumb */}
              <div className="flex items-center gap-2 mt-6 text-red-500 text-sm font-semibold group cursor-pointer w-fit">
                <span>Read our editorial charter</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </FadeSection>

            {/* Founder quote card */}
            <FadeSection delay={150}>
              <div className="relative">
                {/* Decorative accent bar */}
                <div className="absolute -left-4 top-6 bottom-6 w-1 bg-gradient-to-b from-red-500 to-red-300 rounded-full hidden lg:block" />

                <div className="bg-gradient-to-br from-gray-50 to-rose-50/60 dark:from-slate-900 dark:to-rose-950/20 rounded-2xl p-7 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                  {/* Large quote mark */}
                  <svg className="w-10 h-10 text-red-200 dark:text-red-900 mb-4" viewBox="0 0 40 32" fill="currentColor">
                    <path d="M0 32V19.2C0 8.533 5.333 2.4 16 0l2.4 3.2C12.267 4.533 9.2 8 9.2 13.6H16V32H0zm24 0V19.2C24 8.533 29.333 2.4 40 0l2.4 3.2C36.267 4.533 33.2 8 33.2 13.6H40V32H24z" />
                  </svg>

                  <p className="text-gray-800 dark:text-gray-100 text-base sm:text-lg font-medium leading-relaxed italic mb-6">
                    "News should inform, inspire, and empower. At GPN, we're building more than a news
                    platform — we're building a movement for truth in journalism."
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-white font-black text-sm">MM</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        Dr. Manoranjan Mohanty
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Founder & Chairman, GPN
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CORE VALUES
      ══════════════════════════════════════════════ */}
      <section className="py-10 md:py-12 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">

          {/* Header */}
          <FadeSection className="text-center mb-12">
            <SectionLabel icon={Star} text="Core Values" accent="text-red-500 flex justify-center" />
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              What We Stand For
            </h2>
            <div className="w-10 h-1 bg-red-500 rounded-full mx-auto mt-4" />
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <FadeSection key={v.id} delay={i * 90}>
                  <div
                    className={`group rounded-2xl p-6 border ${v.bg} ${v.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${v.iconBg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${v.accent}`} />
                    </div>
                    <h3 className={`text-base font-black text-gray-900 dark:text-white mb-2 ${v.accent} group-hover:opacity-80 transition-opacity`}>
                      {v.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </FadeSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TEAM
      ══════════════════════════════════════════════ */}
      <section className="py-10 md:py-12 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

          {/* Header */}
          <FadeSection className="text-center mb-12">
            <SectionLabel icon={Users} text="Our People" accent="text-red-500 flex justify-center" />
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              The Team Behind GPN
            </h2>
            <div className="w-10 h-1 bg-red-500 rounded-full mx-auto mt-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 max-w-md mx-auto leading-relaxed">
              Passionate journalists, editors, and creators dedicated to bringing you the best in news.
            </p>
          </FadeSection>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {teamMembers.map((member, i) => (
              <FadeSection key={member.id} delay={i * 60}>
                <div className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

                  {/* Card top — avatar area */}
                  <div className="relative h-32 sm:h-36 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden">
                    {/* Subtle pattern */}
                    <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
                      style={{
                        backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                        backgroundSize: "18px 18px"
                      }}
                    />
                    {/* Avatar circle */}
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 ring-4 ring-white dark:ring-slate-900`}
                    >
                      <span className="text-white font-black text-sm sm:text-base tracking-wide">
                        {member.initials}
                      </span>
                    </div>
                  </div>

                  {/* Card bottom — text */}
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm leading-tight mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium leading-snug">
                      {member.designation}
                    </p>
                  </div>

                  {/* Bottom accent line on hover */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${member.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MISSION BANNER (full-width CTA strip)
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-red-600 dark:bg-red-700 py-14 md:py-10">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px"
          }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <FadeSection>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 mb-5">
              <Rocket className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-[11px] font-bold tracking-widest uppercase">Our Mission</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight max-w-3xl mx-auto mb-4">
              Delivering Truth,<br />Every Single Day
            </h2>
            <p className="text-red-100 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              From breaking headlines to long-form investigations, GPN is committed to journalism that
              matters — for readers who demand nothing less than the truth.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors shadow-md"
              >
                Read Today's News
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="/blogs"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white font-bold text-sm rounded-xl border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all"
              >
                Explore Our Blogs
              </a>
            </div>
          </FadeSection>
        </div>
      </section>

      
    </div>
  );
}