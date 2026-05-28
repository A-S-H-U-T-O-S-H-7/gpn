"use client";

import { Star } from "lucide-react";
import Image from "next/image";

const STARS = [
  { top: "18%", left: "12%", size: 2, opacity: 0.7 },
  { top: "55%", left: "6%", size: 3, opacity: 0.5 },
  { top: "30%", left: "33%", size: 2, opacity: 0.4 },
  { top: "72%", left: "44%", size: 2, opacity: 0.6 },
  { top: "15%", left: "58%", size: 3, opacity: 0.35 },
  { top: "80%", left: "70%", size: 2, opacity: 0.5 },
  { top: "25%", left: "80%", size: 2, opacity: 0.4 },
];

const CHAT_URL = "https://myastro.org.in/";
const PLAY_URL = "https://play.google.com/store/apps/details?id=com.myastro.user";

export default function MyAstroBanner() {
  return (
    <section className="py-3">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: "linear-gradient(110deg, #1A0B3D 0%, #3B1F8C 45%, #5B2D9E 75%, #7B3DB5 100%)",
            minHeight: "160px",
          }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 280,
              height: 200,
              top: -40,
              right: 160,
              borderRadius: "50%",
              background: "rgba(139,92,246,0.35)",
              filter: "blur(60px)",
            }}
          />

          {/* Stars */}
          {STARS.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{ top: s.top, left: s.left, width: s.size, height: s.size, opacity: s.opacity }}
            />
          ))}

          {/* Mobile layout */}
          <div className="relative z-10 flex md:hidden items-center gap-4 pl-4 pr-0 py-4">
            {/* Mobile left content */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {/* Logo + badge row */}
              <div className="flex items-center gap-2 flex-wrap">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
                  style={{
                    width: 36,
                    height: 36,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Image src="/Myastrologo_w.png" alt="MyAstro" width={28} height={28} className="object-contain" />
                </div>
                <span className="text-white font-bold text-base tracking-tight">MyAstro</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                    color: "#1A0B3D",
                    boxShadow: "0 2px 8px rgba(251,191,36,0.4)",
                  }}
                >
                  ★ 1st Free
                </span>
              </div>

              {/* Headline */}
              <p className="text-white font-semibold text-sm leading-snug">
                Talk to Certified Astrologers 24/7
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(196,181,253,0.9)" }}>
                Love, Career, Finance & More
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs" style={{ color: "rgba(196,181,253,0.8)" }}>4.9 · 50K+</span>
              </div>

              {/* Buttons stacked */}
              <div className="flex flex-col gap-1.5 mt-1">
                <a
                  href={CHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs font-bold transition-colors"
                  style={{ color: "#3B1F8C", whiteSpace: "nowrap" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"
                    style={{ boxShadow: "0 0 5px rgba(34,197,94,0.8)" }}
                  />
                  Chat with Astrologer
                </a>
                <a
                  href={PLAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3.18 1.11C2.77 1.55 2.5 2.23 2.5 3.09v17.82c0 .86.27 1.54.68 1.98l.1.09 9.98-9.98v-.24L3.28 1.02l-.1.09z" fill="#EA4335" />
                    <path d="M16.59 15.34l-3.33-3.33v-.24l3.33-3.33.07.04 3.95 2.24c1.13.64 1.13 1.69 0 2.33l-3.95 2.25-.07.04z" fill="#FBBC04" />
                    <path d="M16.66 15.3L13.26 12 3.18 22.08c.37.39.98.44 1.67.05l11.81-6.83" fill="#34A853" />
                    <path d="M16.66 8.7L4.85 1.87C4.16 1.48 3.55 1.53 3.18 1.92L13.26 12l3.4-3.3z" fill="#EA4335" />
                  </svg>
                  Get on Play Store
                </a>
              </div>
            </div>

            {/* Mobile model image — flush right, bottom-aligned */}
            <div
              className="flex-shrink-0 self-end"
              style={{ width: 130, position: "relative", marginBottom: 0 }}
            >
              <Image
                src="/Astromodel.png"
                alt="Astrologer"
                width={140}
                height={140}
                className="block"
                style={{
                  objectFit: "cover",
                  objectPosition: "top center",
                  mixBlendMode: "luminosity",
                  filter: "contrast(1.05)",
                }}
              />
            </div>
          </div>

          {/* Desktop layout */}
          <div className="relative z-10 hidden md:flex items-center gap-5 pl-6 md:pl-16 pr-0 py-5">

            {/* Left content */}
            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
              {/* Logo row */}
              <div className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
                  style={{
                    width: 44,
                    height: 44,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Image src="/Myastrologo_w.png" alt="MyAstro" width={36} height={36} className="object-contain" />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">MyAstro</span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                    color: "#1A0B3D",
                    boxShadow: "0 2px 8px rgba(251,191,36,0.4)",
                  }}
                >
                  ★ 1st Chat Free
                </span>
              </div>

              {/* Headline */}
              <div>
                <p className="text-white font-semibold text-sm leading-snug">
                  Talk to Certified Astrologers — Anytime, 24/7
                </p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(196,181,253,0.9)" }}>
                  Get personalized predictions • Love, Career, Finance & More
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs" style={{ color: "rgba(196,181,253,0.8)" }}>
                  4.9 · 50K+ Reviews
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <a
                href={CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white rounded-xl text-sm font-bold transition-colors hover:bg-purple-50"
                style={{ color: "#3B1F8C", whiteSpace: "nowrap" }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
                  style={{ boxShadow: "0 0 6px rgba(34,197,94,0.8)" }}
                />
                Chat with Astrologer
              </a>
              <a
                href={PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3.18 1.11C2.77 1.55 2.5 2.23 2.5 3.09v17.82c0 .86.27 1.54.68 1.98l.1.09 9.98-9.98v-.24L3.28 1.02l-.1.09z" fill="#EA4335" />
                  <path d="M16.59 15.34l-3.33-3.33v-.24l3.33-3.33.07.04 3.95 2.24c1.13.64 1.13 1.69 0 2.33l-3.95 2.25-.07.04z" fill="#FBBC04" />
                  <path d="M16.66 15.3L13.26 12 3.18 22.08c.37.39.98.44 1.67.05l11.81-6.83" fill="#34A853" />
                  <path d="M16.66 8.7L4.85 1.87C4.16 1.48 3.55 1.53 3.18 1.92L13.26 12l3.4-3.3z" fill="#EA4335" />
                </svg>
                Get on Play Store
              </a>
            </div>

            {/* Model image — flush right, no padding, bleeds to edges */}
            <div
              className="flex-shrink-0 self-end"
              style={{ width: 200, marginRight: 0 }}
            >
              <Image
                src="/Astromodel.png"
                alt="Astrologer"
                width={200}
                height={190}
                className="absolute bottom-[-40px] right-0 block"
                style={{
                  objectFit: "cover",
                  objectPosition: "top center",
                  display: "absolute",
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}