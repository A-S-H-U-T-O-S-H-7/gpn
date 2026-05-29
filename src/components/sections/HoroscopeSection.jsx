"use client";

import { useState, useEffect } from "react";
import { Sparkles, Palette, Hash, Star, Moon, Sun, Wind } from "lucide-react";
import { zodiacSigns, getHoroscopeForHomepage } from "@/lib/services/horoscopeService";

/* ─── Element config ───────────────────────────────────────────── */
const elementConfig = {
  Fire:  { gradient: "from-orange-500/20 to-red-500/20",    badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",   icon: <Sun className="w-3.5 h-3.5" /> },
  Earth: { gradient: "from-emerald-500/20 to-green-500/20", badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", icon: <Wind className="w-3.5 h-3.5" /> },
  Air:   { gradient: "from-sky-500/20 to-blue-500/20",      badge: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",               icon: <Wind className="w-3.5 h-3.5" /> },
  Water: { gradient: "from-violet-500/20 to-indigo-500/20", badge: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",   icon: <Moon className="w-3.5 h-3.5" /> },
};

/* ─── Stat chip ─────────────────────────────────────────────────── */
function StatChip({ icon, label, value, bg, iconColor }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl px-4 py-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

/* ─── Skeleton ──────────────────────────────────────────────────── */
function PredictionSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-5/6" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-4/6" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/6 mt-2" />
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────── */
export default function HoroscopeSection() {
  const [selectedSign, setSelectedSign] = useState("aries");
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getHoroscopeForHomepage(selectedSign);
      if (result.success) setHoroscopeData(result.horoscope);
      setLoading(false);
    })();
  }, [selectedSign]);

  const selectedZodiac = zodiacSigns.find((s) => s.id === selectedSign);
  const elCfg = elementConfig[selectedZodiac?.element] || elementConfig.Fire;

  return (
    <section className="py-12 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-red-600 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Daily Horoscope
            </h2>
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-full">
              <Sparkles className="w-3 h-3 text-red-500" />
              <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">Today's Reading</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {/* ── Main content card ── */}
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/60 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* LEFT — Zodiac identity ─────────────────────────────── */}
            <div className={`lg:col-span-2 relative bg-gradient-to-br ${elCfg.gradient} p-7 xl:p-10 flex flex-col items-center justify-center text-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-700/60`}>

              {/* Decorative ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 dark:opacity-5">
                <div className="w-72 h-72 rounded-full border-2 border-current" />
                <div className="absolute w-52 h-52 rounded-full border border-current" />
              </div>

              {/* Symbol */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-white/80 dark:border-slate-700 shadow-lg" />
                <span className="relative text-5xl" role="img" aria-label={selectedZodiac?.name}>
                  {selectedZodiac?.symbol}
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                  {selectedZodiac?.name}
                </h3>
              </div>

              {/* Element badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-current/20 ${elCfg.badge}`}>
                {elCfg.icon}
                {selectedZodiac?.element} Sign
              </span>

              {/* Compatibility */}
              {horoscopeData?.compatibility && (
                <div className="w-full bg-white/50 dark:bg-slate-900/40 rounded-2xl px-4 py-3 border border-white/70 dark:border-slate-700/50">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Compatible with</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{horoscopeData.compatibility}</p>
                </div>
              )}
            </div>

            {/* RIGHT — Prediction ──────────────────────────────────── */}
            <div className="lg:col-span-3 p-7 xl:p-10 flex flex-col gap-6">

              {/* Prediction text */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Today's Prediction</span>
                </div>

                {loading ? (
                  <PredictionSkeleton />
                ) : horoscopeData ? (
                  <p className="text-slate-700 dark:text-slate-300 text-base lg:text-[17px] leading-relaxed">
                    "{horoscopeData.prediction}"
                  </p>
                ) : (
                  <p className="text-slate-400 italic">Unable to load today's prediction.</p>
                )}
              </div>

              {/* Stat chips — Lucky Color & Lucky Number */}
              {!loading && horoscopeData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatChip
                    icon={<Palette className="w-4 h-4" />}
                    label="Lucky Color"
                    value={horoscopeData.luckyColor}
                    bg="bg-yellow-100 dark:bg-yellow-900/30"
                    iconColor="text-yellow-600 dark:text-yellow-400"
                  />
                  <StatChip
                    icon={<Hash className="w-4 h-4" />}
                    label="Lucky Number"
                    value={horoscopeData.luckyNumber}
                    bg="bg-violet-100 dark:bg-violet-900/30"
                    iconColor="text-violet-600 dark:text-violet-400"
                  />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── All zodiac signs grid ── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-5 bg-red-600 rounded-full" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">Select Your Sign</h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2.5">
            {zodiacSigns.map((sign) => {
              const active = selectedSign === sign.id;
              return (
                <button
                  key={sign.id}
                  onClick={() => setSelectedSign(sign.id)}
                  className={[
                    "group relative flex flex-col items-center justify-center gap-1 rounded-2xl py-3 px-2 text-center transition-all duration-200 border",
                    active
                      ? "bg-red-600 border-red-500 shadow-lg shadow-red-500/25 scale-105"
                      : "bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/60 hover:border-red-300 dark:hover:border-red-700 hover:scale-105 hover:shadow-md",
                  ].join(" ")}
                  title={`${sign.name} — ${sign.date}`}
                >
                  {active && (
                    <div className="absolute inset-0 rounded-2xl bg-red-400/20 blur-md -z-10" />
                  )}
                  <span className="text-2xl leading-none">{sign.symbol}</span>
                  <span className={`text-[10px] font-bold leading-tight ${active ? "text-white" : "text-slate-700 dark:text-slate-200"}`}>
                    {sign.name}
                  </span>
                  {/* <span className={`text-[9px] leading-none hidden sm:block ${active ? "text-white/70" : "text-slate-400 dark:text-slate-500"}`}>
                    {sign.date?.split(" ")[0]} {sign.date?.split(" ")[1]}
                  </span> */}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}