"use client";

import Image from "next/image";
import { Shield, Clock, CheckCircle, ArrowRight } from "lucide-react";

const APPLY_URL = "https://atdmoney.com/loans.php";
const PLAY_URL = "https://play.google.com/store/apps/details?id=com.atdmoney.quick";

const DOTS = [
  { top: "20%", left: "8%", size: 2, opacity: 0.6 },
  { top: "60%", left: "4%", size: 3, opacity: 0.4 },
  { top: "35%", left: "30%", size: 2, opacity: 0.35 },
  { top: "75%", left: "48%", size: 2, opacity: 0.5 },
  { top: "15%", left: "55%", size: 3, opacity: 0.3 },
  { top: "80%", left: "68%", size: 2, opacity: 0.45 },
  { top: "28%", left: "78%", size: 2, opacity: 0.35 },
];

export default function AtdMoneyBanner() {
  return (
    <section className="py-2">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: "linear-gradient(110deg, #052e16 0%, #14532d 40%, #166534 70%, #15803d 100%)",
            minHeight: "160px",
          }}
        >
          {/* Diagonal stripe pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 28px)",
            }}
          />

          {/* Glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 260,
              height: 180,
              bottom: -40,
              left: 120,
              borderRadius: "50%",
              background: "rgba(34,197,94,0.25)",
              filter: "blur(55px)",
            }}
          />

          {/* Star dots */}
          {DOTS.map((d, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{ top: d.top, left: d.left, width: d.size, height: d.size, opacity: d.opacity }}
            />
          ))}

          {/* ── MOBILE layout ── */}
          <div className="relative z-10 flex md:hidden items-center gap-3 pl-4 pr-0 py-4">

            <div className="flex flex-col gap-2 flex-1 min-w-0">

              {/* Logo + name + badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <div
                  className="flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center shadow-md"
                  style={{ width: 36, height: 36, background: "#fff", padding: 2 }}
                >
                  <Image src="/atdlogo.png" alt="ATD Money" width={32} height={32} className="object-contain" />
                </div>
                <span className="text-white font-bold text-base tracking-tight">ATD Money</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #fde047, #facc15)",
                    color: "#14532d",
                    boxShadow: "0 2px 8px rgba(250,204,21,0.4)",
                  }}
                >
                  ⚡ Instant Loan
                </span>
              </div>

              {/* Loan range */}
              <div>
                <p className="text-white font-bold text-base leading-tight">
                  ₹3,000 – ₹50,000
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(187,247,208,0.9)" }}>
                  Payday Loan • Quick Approval
                </p>
              </div>

              {/* Trust */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-300" />
                  <span className="text-xs text-green-100">No Hidden Charges</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-300" />
                  <span className="text-xs text-green-100">100% Secure</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-1 flex-wrap">
                <a
                  href={APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                  style={{ background: "#fff", color: "#14532d" }}
                >
                  Apply Now
                  <ArrowRight className="w-3 h-3" />
                </a>
                <a
                  href={PLAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Image src="/playstore.png" alt="Play Store" width={12} height={12} className="object-contain" />
                  Get App
                </a>
              </div>
            </div>

            {/* Mobile model */}
            <div className="flex-shrink-0 self-end" style={{ width: 110 }}>
              <Image
                src="/atdmodel.png"
                alt="ATD Money"
                width={110}
                height={140}
                className="block object-cover object-top"
              />
            </div>
          </div>

          {/* ── DESKTOP layout ── */}
          <div className="relative z-10 hidden md:flex items-center gap-5 pl-16 pr-10 py-2">

            {/* Left content */}
            <div className="flex flex-col gap-3 flex-1 min-w-0">

              {/* Logo + name + badge */}
              <div className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center shadow-md"
                  style={{ width: 48, height: 48, background: "#fff", padding: 3 }}
                >
                  <Image src="/atdlogo.png" alt="ATD Money" width={42} height={42} className="object-contain" />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">ATD Money</span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #fde047, #facc15)",
                    color: "#14532d",
                    boxShadow: "0 2px 8px rgba(250,204,21,0.45)",
                  }}
                >
                  ⚡ Instant Disbursal
                </span>
              </div>

              {/* Headline */}
              <div>
                <p className="text-white font-bold text-lg leading-snug">
                  Payday Loan from ₹3,000 to ₹50,000
                </p>
                <p className="text-sm mt-0.5" style={{ color: "rgba(187,247,208,0.9)" }}>
                  Quick approval • Low interest • Minimal documentation
                </p>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-300" />
                  <span className="text-xs text-green-100">No Hidden Charges</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-green-300" />
                  <span className="text-xs text-green-100">100% Secure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-green-300" />
                  <span className="text-xs text-green-100">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Buttons column */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 shadow-lg whitespace-nowrap"
                style={{ background: "#fff", color: "#14532d" }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
                  style={{ boxShadow: "0 0 6px rgba(34,197,94,0.9)" }}
                />
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-80 active:scale-95 whitespace-nowrap"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Image src="/playstore.png" alt="Play Store" width={14} height={14} className="object-contain" />
                Get on Play Store
              </a>
            </div>

            {/* Model image — flush right bottom */}
            <div className="flex-shrink-0 self-end" style={{ width: 160, marginRight: 0 }}>
              <Image
                src="/atdmodel.png"
                alt="ATD Money"
                width={160}
                height={190}
                className="block object-cover object-top"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}