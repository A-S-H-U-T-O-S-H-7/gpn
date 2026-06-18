"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heart,
  Star,
  Rocket,
  Sparkles,
  Users,
  Shield,
  Zap,
  Globe,
  ChevronRight,
  Crown,
  Camera,
  Palette,
  TrendingUp,
  MessageSquare,
  Settings2,
  PenLine,
  Clapperboard,
  BarChart2,
} from "lucide-react";
import Image from "next/image";

/* ────────────────────────────────────────────────────────────────────
   DATA
──────────────────────────────────────────────────────────────────── */

const teamMembers = [
  {
    id: 2,
    name: "Manbir Singh Negi",
    role: "Sr. Cameraman & Video Editor",
    initials: "MN",
    icon: Camera,
    tag: "VIDEO",
    from: "#f97316",
    to: "#ea580c",
    glow: "rgba(249,115,22,0.45)",
    mesh: "radial-gradient(ellipse at 80% 20%, #fed7aa 0%, #fff7ed 60%, #fff 100%)",
    darkMesh: "radial-gradient(ellipse at 80% 20%, rgba(154,52,18,0.35) 0%, rgba(15,23,42,0.9) 60%)",
  },
  {
    id: 3,
    name: "Deepak Kumar",
    role: "Animation & Video Editor",
    initials: "DK",
    icon: Clapperboard,
    tag: "MOTION",
    from: "#7c3aed",
    to: "#6d28d9",
    glow: "rgba(124,58,237,0.45)",
    mesh: "radial-gradient(ellipse at 80% 20%, #ddd6fe 0%, #f5f3ff 60%, #fff 100%)",
    darkMesh: "radial-gradient(ellipse at 80% 20%, rgba(91,33,182,0.35) 0%, rgba(15,23,42,0.9) 60%)",
  },
  {
    id: 4,
    name: "Manish Batra",
    role: "Graphic Designer",
    initials: "MB",
    icon: Palette,
    tag: "DESIGN",
    from: "#0284c7",
    to: "#0369a1",
    glow: "rgba(2,132,199,0.45)",
    mesh: "radial-gradient(ellipse at 80% 20%, #bae6fd 0%, #f0f9ff 60%, #fff 100%)",
    darkMesh: "radial-gradient(ellipse at 80% 20%, rgba(3,105,161,0.35) 0%, rgba(15,23,42,0.9) 60%)",
  },
  {
    id: 5,
    name: "Lal Yadav",
    role: "SEO Specialist",
    initials: "LY",
    icon: TrendingUp,
    tag: "GROWTH",
    from: "#059669",
    to: "#047857",
    glow: "rgba(5,150,105,0.45)",
    mesh: "radial-gradient(ellipse at 80% 20%, #a7f3d0 0%, #ecfdf5 60%, #fff 100%)",
    darkMesh: "radial-gradient(ellipse at 80% 20%, rgba(4,120,87,0.35) 0%, rgba(15,23,42,0.9) 60%)",
  },
  {
    id: 6,
    name: "Ankita Mohanty",
    role: "Social Media Handler",
    initials: "AM",
    icon: MessageSquare,
    tag: "SOCIAL",
    from: "#db2777",
    to: "#be185d",
    glow: "rgba(219,39,119,0.45)",
    mesh: "radial-gradient(ellipse at 80% 20%, #fbcfe8 0%, #fdf2f8 60%, #fff 100%)",
    darkMesh: "radial-gradient(ellipse at 80% 20%, rgba(157,23,77,0.35) 0%, rgba(15,23,42,0.9) 60%)",
  },
  {
    id: 7,
    name: "Reva Solanki",
    role: "Manager",
    initials: "RS",
    icon: Settings2,
    tag: "OPS",
    from: "#4f46e5",
    to: "#4338ca",
    glow: "rgba(79,70,229,0.45)",
    mesh: "radial-gradient(ellipse at 80% 20%, #c7d2fe 0%, #eef2ff 60%, #fff 100%)",
    darkMesh: "radial-gradient(ellipse at 80% 20%, rgba(55,48,163,0.35) 0%, rgba(15,23,42,0.9) 60%)",
  },
  {
    id: 8,
    name: "Rajneesh Verma",
    role: "Content Writer & Digital Strategist",
    initials: "RV",
    icon: PenLine,
    tag: "CONTENT",
    from: "#65a30d",
    to: "#4d7c0f",
    glow: "rgba(101,163,13,0.45)",
    mesh: "radial-gradient(ellipse at 80% 20%, #d9f99d 0%, #f7fee7 60%, #fff 100%)",
    darkMesh: "radial-gradient(ellipse at 80% 20%, rgba(63,98,18,0.35) 0%, rgba(15,23,42,0.9) 60%)",
  },
  {
  id: 9,  
  name: "Nirmalya Mohanty",
  role: "SEO & SMO Specialist",
  initials: "NM",
  icon: BarChart2,   
  tag: "SEO/SMO",
  from: "#0891b2",
  to: "#0e7490",
  glow: "rgba(8,145,178,0.45)",
  mesh: "radial-gradient(ellipse at 80% 20%, #a5f3fc 0%, #ecfeff 60%, #fff 100%)",
  darkMesh: "radial-gradient(ellipse at 80% 20%, rgba(14,116,144,0.35) 0%, rgba(15,23,42,0.9) 60%)",
},
];

const values = [
  {
    id: 1,
    title: "Truth First",
    description: "Every story we publish is rigorously fact-checked. Accuracy above speed, always.",
    icon: Shield,
    from: "#ef4444",
    to: "#dc2626",
    glow: "rgba(239,68,68,0.3)",
    soft: "rgba(239,68,68,0.06)",
  },
  {
    id: 2,
    title: "Innovation",
    description: "We pioneer video-first journalism, embracing new formats to reach you everywhere.",
    icon: Zap,
    from: "#f59e0b",
    to: "#d97706",
    glow: "rgba(245,158,11,0.3)",
    soft: "rgba(245,158,11,0.06)",
  },
  {
    id: 3,
    title: "Integrity",
    description: "Independence from political or commercial influence is non-negotiable at GPN.",
    icon: Heart,
    from: "#10b981",
    to: "#059669",
    glow: "rgba(16,185,129,0.3)",
    soft: "rgba(16,185,129,0.06)",
  },
  {
    id: 4,
    title: "Global Reach",
    description: "Millions of readers across the world trust GPN for breaking news and analysis.",
    icon: Globe,
    from: "#3b82f6",
    to: "#2563eb",
    glow: "rgba(59,130,246,0.3)",
    soft: "rgba(59,130,246,0.06)",
  },
];

/* ────────────────────────────────────────────────────────────────────
   HOOKS
──────────────────────────────────────────────────────────────────── */

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ────────────────────────────────────────────────────────────────────
   MOTION PRIMITIVES
──────────────────────────────────────────────────────────────────── */

function FadeUp({ children, delay = 0, className = "", distance = 36 }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0px) scale(1)"
          : `translateY(${distance}px) scale(0.96)`,
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   AMBIENT ORB
──────────────────────────────────────────────────────────────────── */

function Orb({ color, size, style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none select-none"
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${Math.round(size * 0.38)}px)`,
        opacity: 0.22,
        ...style,
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────
   SECTION EYEBROW
──────────────────────────────────────────────────────────────────── */

function Eyebrow({ icon: Icon, label, dark = false }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 ${
        dark
          ? "bg-white/10 border border-white/20"
          : "bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50"
      }`}
    >
      <Icon className={`w-3.5 h-3.5 ${dark ? "text-red-400" : "text-red-500"}`} />
      <span
        className={`text-[11px] font-extrabold tracking-[0.14em] uppercase ${
          dark ? "text-red-400" : "text-red-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   TEAM CARD  — glassmorphism + colour-mesh BG + claymorphism avatar
──────────────────────────────────────────────────────────────────── */

function TeamCard({ m, delay }) {
  const [hovered, setHovered] = useState(false);
  const RoleIcon = m.icon;

  return (
    <FadeUp delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative overflow-hidden rounded-2xl cursor-default h-full"
        style={{
          transform: hovered
            ? "translateY(-10px) scale(1.02)"
            : "translateY(0px) scale(1)",
          transition:
            "transform 0.38s cubic-bezier(0.16,1,0.3,1), box-shadow 0.38s ease",
          boxShadow: hovered
            ? `0 24px 48px ${m.glow}, 0 0 0 1px ${m.from}30`
            : `0 4px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)`,
        }}
      >
        {/* Colour-mesh background — light mode */}
        <div className="absolute inset-0 dark:hidden" style={{ background: m.mesh }} />
        {/* Colour-mesh background — dark mode */}
        <div className="absolute inset-0 hidden dark:block" style={{ background: m.darkMesh }} />

        {/* Glassmorphism frost — light */}
        <div
          className="absolute inset-0 dark:hidden"
          style={{ background: "rgba(255,255,255,0.52)", backdropFilter: "blur(2px)" }}
        />
        {/* Glassmorphism frost — dark */}
        <div
          className="absolute inset-0 hidden dark:block"
          style={{ background: "rgba(15,23,42,0.52)", backdropFilter: "blur(2px)" }}
        />

        {/* Animated colour blob */}
        <div
          className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${m.from} 0%, transparent 70%)`,
            opacity: hovered ? 0.28 : 0.12,
            filter: "blur(20px)",
            transition: "opacity 0.4s ease",
            animation: "blobFloat 7s ease-in-out infinite alternate",
          }}
        />

        {/* Tag chip + role icon */}
        <div className="relative z-10 px-4 pt-4 pb-0 flex justify-between items-start">
          <span
            className="text-[9px] font-black tracking-[0.16em] px-2.5 py-1 rounded-md text-white"
            style={{ background: `linear-gradient(135deg, ${m.from}, ${m.to})` }}
          >
            {m.tag}
          </span>
          <RoleIcon className="w-4 h-4 opacity-30" style={{ color: m.from }} />
        </div>

        {/* Claymorphism avatar */}
        <div className="relative z-10 flex justify-center pt-5 pb-3">
          <div
            style={{
              filter: `drop-shadow(0 8px 20px ${m.glow})`,
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.38s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div
              className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-[22px] flex items-center justify-center"
              style={{
                background: `linear-gradient(145deg, ${m.from}, ${m.to})`,
                boxShadow: `
                  inset 0 2px 4px rgba(255,255,255,0.45),
                  inset 0 -2px 4px rgba(0,0,0,0.18),
                  0 10px 28px ${m.glow}
                `,
              }}
            >
              <span className="text-white font-black text-base sm:text-lg tracking-wide select-none">
                {m.initials}
              </span>
            </div>
          </div>
        </div>

        {/* Name + role */}
        <div className="relative z-10 px-4 pb-5 text-center">
          <h3 className="font-black text-gray-900 dark:text-white text-sm leading-tight mb-1">
            {m.name}
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-snug">
            {m.role}
          </p>
        </div>

        {/* Bottom shimmer line on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${m.from}, ${m.to}, transparent)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    </FadeUp>
  );
}

/* ────────────────────────────────────────────────────────────────────
   PAGE
──────────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <>
      <style>{`
        @keyframes blobFloat {
          from { transform: scale(1) translate(0, 0); }
          to   { transform: scale(1.25) translate(6px, -8px); }
        }
        @keyframes driftA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(18px, -22px) scale(1.05); }
        }
        @keyframes driftB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-14px, 18px) scale(1.08); }
        }
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmerSlide {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes founderFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        .shimmer-red {
          background: linear-gradient(90deg, #ef4444 0%, #fb923c 35%, #ef4444 65%, #dc2626 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerSlide 3.5s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased">

        {/* ═══════════════════════════ HERO BANNER ═══════════════════════════ */}
        <section className="relative w-full overflow-hidden">
          <div className="hidden md:block relative w-full" style={{ aspectRatio: "3/1" }}>
            <Image
              src="/aboutus_d.png"
              alt="Great Post News — About Us"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
          </div>
          <div className="block md:hidden relative w-full" style={{ aspectRatio: "4/3" }}>
            <Image
              src="/aboutus_m.png"
              alt="Great Post News — About Us"
              fill
              priority
              className="object-contain object-center"
              sizes="90vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10" />
          </div>
        </section>

        {/* ═══════════════════════════ OUR STORY ═══════════════════════════ */}
        <section className="relative py-16 md:py-20 bg-white dark:bg-slate-950 overflow-hidden">
          <Orb
            color="#ef444480"
            size={480}
            style={{ top: "-15%", left: "-10%", animation: "driftA 12s ease-in-out infinite" }}
          />
          <Orb
            color="#f9731660"
            size={320}
            style={{ bottom: "5%", right: "-8%", animation: "driftB 14s ease-in-out infinite" }}
          />

          <div className="relative max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Story text */}
              <FadeUp>
                <Eyebrow icon={Sparkles} label="Our Story" />
                <h2 className="text-4xl md:text-5xl font-black leading-[1.05] text-gray-900 dark:text-white mb-6">
                  From Vision <br />
                  <span className="shimmer-red">to Reality</span>
                </h2>
                <div className="space-y-4 text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                  <p>
                    In October 2023,{" "}
                    <strong className="font-black text-gray-900 dark:text-white">
                      Dr. Manoranjan Mohanty
                    </strong>{" "}
                    founded Great Post News with a singular vision: to create a news platform that
                    puts video first while maintaining the highest standards of journalistic integrity.
                  </p>
                  <p>
                    In an era of information overload, GPN emerged as a beacon of reliable, fact-based
                    journalism. Our team works around the clock to bring you breaking news, in-depth
                    analysis, and compelling video content from every corner of the globe.
                  </p>
                  <p>
                    Today, GPN reaches millions of readers worldwide, serving as a trusted source for
                    those who demand accuracy, speed, and depth in their news consumption.
                  </p>
                </div>
                <button className="mt-7 flex items-center gap-2 text-red-500 font-bold text-sm group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded">
                  <span>Read our editorial charter</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </FadeUp>

              {/* Founder quote — glassmorphism card */}
              <FadeUp delay={140}>
                <div className="relative">
                  {/* Glow behind card */}
                  <div
                    className="absolute inset-0 -m-6 rounded-3xl"
                    style={{
                      background:
                        "radial-gradient(ellipse, rgba(239,68,68,0.18) 0%, transparent 70%)",
                      filter: "blur(24px)",
                    }}
                  />
                  {/* Glass card — light */}
                  <div
                    className="relative rounded-3xl p-8 dark:hidden"
                    style={{
                      background: "rgba(255,255,255,0.65)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      border: "1px solid rgba(255,255,255,0.85)",
                      boxShadow:
                        "0 20px 60px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                    }}
                  >
                    <QuoteBody />
                  </div>
                  {/* Glass card — dark */}
                  <div
                    className="relative rounded-3xl p-8 hidden dark:block"
                    style={{
                      background: "rgba(15,23,42,0.6)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                    }}
                  >
                    <QuoteBody />
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ CORE VALUES ═══════════════════════════ */}
        <section className="relative py-16 md:py-20 overflow-hidden bg-gray-50 dark:bg-slate-900">
          <Orb
            color="#6366f155"
            size={360}
            style={{ top: "10%", right: "-8%", animation: "driftA 16s ease-in-out infinite" }}
          />

          <div className="relative max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
            <FadeUp className="text-center mb-14">
              <div className="flex justify-center">
                <Eyebrow icon={Star} label="Core Values" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                What We Stand For
              </h2>
              <div
                className="w-14 h-1.5 rounded-full mx-auto mt-4"
                style={{ background: "linear-gradient(90deg, #ef4444, #f97316)" }}
              />
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <FadeUp key={v.id} delay={i * 75}>
                    <ValueCard v={v} Icon={Icon} />
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ TEAM ═══════════════════════════ */}
        <section className="relative py-20 md:py-24 overflow-hidden bg-slate-950">
          {/* Subtle grid lines */}
          <div
            className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <Orb
            color="#ef444455"
            size={600}
            style={{ top: "0%", left: "55%", animation: "driftA 18s ease-in-out infinite" }}
          />
          <Orb
            color="#7c3aed44"
            size={400}
            style={{ bottom: "10%", left: "-5%", animation: "driftB 15s ease-in-out infinite" }}
          />

          <div className="relative max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">

            {/* Header */}
            <FadeUp className="text-center mb-16">
              <div className="flex justify-center">
                <Eyebrow icon={Users} label="Our People" dark />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                The Minds Behind{" "}
                <span className="shimmer-red">GPN</span>
              </h2>
              <div
                className="w-14 h-1.5 rounded-full mx-auto mt-4"
                style={{ background: "linear-gradient(90deg, #ef4444, #f97316)" }}
              />
              <p className="text-slate-400 text-sm mt-5 max-w-sm mx-auto leading-relaxed">
                Journalists, editors, and creators — united by a single mission: the truth.
              </p>
            </FadeUp>

            {/* ── FOUNDER CARD — premium full-width ── */}
            <FadeUp delay={80} className="mb-10">
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(239,68,68,0.08) 0%, transparent 60%)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  boxShadow:
                    "0 0 0 1px rgba(239,68,68,0.08), 0 32px 80px rgba(0,0,0,0.5)",
                  animation: "founderFloat 6s ease-in-out infinite",
                }}
              >
                {/* Inner radial glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 55% 90% at 15% 50%, rgba(239,68,68,0.22) 0%, transparent 70%)",
                  }}
                />
                {/* Dot texture */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />

                <div className="relative flex flex-col md:flex-row items-center">

                  {/* Avatar column */}
                  <div className="flex flex-col items-center justify-center px-10 py-10 md:py-14 md:border-r border-white/10 flex-shrink-0 gap-5">
                    {/* Spinning orbit */}
                    <div className="relative flex items-center justify-center">
                      <div
                        className="absolute rounded-full border border-dashed border-red-500/30"
                        style={{
                          width: 152,
                          height: 152,
                          animation: "spinRing 18s linear infinite",
                        }}
                      />
                      <div
                        className="absolute rounded-full border border-red-500/15"
                        style={{ width: 176, height: 176 }}
                      />
                      {/* Clay avatar */}
                      <div
                        className="w-28 h-28 rounded-[26px] flex items-center justify-center"
                        style={{
                          background: "linear-gradient(145deg, #ef4444, #b91c1c)",
                          boxShadow: `
                            inset 0 3px 6px rgba(255,255,255,0.38),
                            inset 0 -3px 6px rgba(0,0,0,0.24),
                            0 20px 50px rgba(239,68,68,0.55),
                            0 0 0 1px rgba(239,68,68,0.3)
                          `,
                        }}
                      >
                        <span className="text-white font-black text-2xl select-none tracking-wide">
                          MM
                        </span>
                      </div>
                    </div>

                    {/* Crown badge */}
                    <div
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
                      style={{
                        background: "rgba(239,68,68,0.15)",
                        border: "1px solid rgba(239,68,68,0.25)",
                      }}
                    >
                      <Crown className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-[10px] font-extrabold tracking-[0.14em] uppercase text-red-300">
                        Chairman
                      </span>
                    </div>
                  </div>

                  {/* Content column */}
                  <div className="flex flex-col justify-center px-8 md:px-12 py-10 md:py-14 flex-1 text-center md:text-left">
                    <p className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-red-400 mb-2">
                      Founder & Chairman
                    </p>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">
                      Dr. Manoranjan Mohanty
                    </h3>

                    {/* Quote glass pill */}
                    <div
                      className="rounded-2xl px-6 py-5 mb-7"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                      }}
                    >
                      <svg
                        className="w-6 h-6 text-red-500 mb-3"
                        viewBox="0 0 40 32"
                        fill="currentColor"
                      >
                        <path d="M0 32V19.2C0 8.533 5.333 2.4 16 0l2.4 3.2C12.267 4.533 9.2 8 9.2 13.6H16V32H0zm24 0V19.2C24 8.533 29.333 2.4 40 0l2.4 3.2C36.267 4.533 33.2 8 33.2 13.6H40V32H24z" />
                      </svg>
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed italic font-medium">
                        "News should inform, inspire, and empower. At GPN, we're building more than
                        a news platform — we're building a movement for truth in journalism."
                      </p>
                    </div>

                    {/* Stat chips */}
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      {[
                        { val: "2023", label: "Founded" },
                        { val: "10M+", label: "Monthly Readers" },
                        { val: "25K+", label: "Stories Published" },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="px-4 py-2.5 rounded-xl text-center"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <p className="text-lg font-black text-white">{s.val}</p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Team grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {teamMembers.map((m, i) => (
                <TeamCard key={m.id} m={m} delay={i * 55 + 120} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ MISSION BANNER ═══════════════════════════ */}
        <section className="relative overflow-hidden py-8 md:py-4">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #dc2626 0%, #ef4444 40%, #e11d48 70%, #be123c 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <Orb
            color="#fbbf2460"
            size={380}
            style={{ top: "-30%", right: "15%", animation: "driftA 12s ease-in-out infinite" }}
          />
          <Orb
            color="#ffffff25"
            size={260}
            style={{ bottom: "-20%", left: "20%", animation: "driftB 10s ease-in-out infinite" }}
          />

          <div className="relative max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
            <FadeUp>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <Rocket className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-[11px] font-extrabold tracking-[0.14em] uppercase">
                  Our Mission
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight max-w-3xl mx-auto mb-5">
                Delivering Truth,
                <br />
                Every Single Day
              </h2>

              <p className="text-red-100 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-9">
                From breaking headlines to long-form investigations, GPN is committed to journalism
                that matters — for readers who demand nothing less than the truth.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold text-sm rounded-2xl text-red-600 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background: "#fff",
                    boxShadow:
                      "6px 6px 0 rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}
                >
                  Read Today's News
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="/blogs"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold text-sm rounded-2xl text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "2px solid rgba(255,255,255,0.45)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  Explore Our Blogs
                </a>
              </div>
            </FadeUp>
          </div>
        </section>

      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────
   EXTRACTED SUB-COMPONENTS (keeps JSX clean above)
──────────────────────────────────────────────────────────────────── */

function QuoteBody() {
  return (
    <>
      <svg
        className="w-9 h-9 text-red-300 dark:text-red-800 mb-5"
        viewBox="0 0 40 32"
        fill="currentColor"
      >
        <path d="M0 32V19.2C0 8.533 5.333 2.4 16 0l2.4 3.2C12.267 4.533 9.2 8 9.2 13.6H16V32H0zm24 0V19.2C24 8.533 29.333 2.4 40 0l2.4 3.2C36.267 4.533 33.2 8 33.2 13.6H40V32H24z" />
      </svg>
      <p className="text-gray-800 dark:text-gray-100 text-lg font-semibold leading-relaxed italic mb-7">
        "News should inform, inspire, and empower. At GPN, we're building more than a news
        platform — we're building a movement for truth in journalism."
      </p>
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            boxShadow:
              "inset 0 2px 4px rgba(255,255,255,0.35), 0 8px 20px rgba(239,68,68,0.4)",
          }}
        >
          <span className="text-white font-black text-sm select-none">MM</span>
        </div>
        <div>
          <p className="font-black text-gray-900 dark:text-white text-sm">
            Dr. Manoranjan Mohanty
          </p>
          <p className="text-xs text-red-500 font-bold mt-0.5">Founder & Chairman, GPN</p>
        </div>
      </div>
    </>
  );
}

function ValueCard({ v, Icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative rounded-2xl p-6 h-full cursor-default overflow-hidden"
      style={{
        background: "#fff",
        boxShadow: hovered
          ? `10px 12px 0px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1.5px ${v.from}40`
          : "6px 6px 0px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-8px) rotate(-0.5deg)" : "translateY(0) rotate(0deg)",
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Dark mode base */}
      <div
        className="absolute inset-0 rounded-2xl hidden dark:block"
        style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)" }}
      />
      {/* Soft colour tint */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ background: v.soft, opacity: 0.7 }}
      />

      <div className="relative z-10">
        {/* Claymorphism icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{
            background: `linear-gradient(145deg, ${v.from}, ${v.to})`,
            boxShadow: `inset 0 2px 4px rgba(255,255,255,0.4), 0 8px 20px ${v.glow}`,
          }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-sm font-black text-gray-900 dark:text-white mb-2">{v.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {v.description}
        </p>
      </div>
    </div>
  );
}