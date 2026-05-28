"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    tag: "Offre Flash",
    title: "iPhone 15 Pro Max",
    subtitle: "128 Go · Titanium Black · Neuf",
    price: "950 000 XAF",
    oldPrice: "1 150 000 XAF",
    discount: "-17%",
    cta: "Commander",
    href: "/produits?q=iphone+15",
    bg: "from-[#1A2E1A] to-[#2E8B2E]",
    accent: "#F5C800",
    img: null,
  },
  {
    tag: "Promo Semaine",
    title: "Samsung Galaxy S24",
    subtitle: "256 Go · Phantom Black · Neuf",
    price: "680 000 XAF",
    oldPrice: "820 000 XAF",
    discount: "-17%",
    cta: "Voir l'offre",
    href: "/produits?q=samsung+s24",
    bg: "from-[#1a1a2e] to-[#16213e]",
    accent: "#00b4d8",
    img: null,
  },
  {
    tag: "Stock Limité",
    title: "MacBook Air M2",
    subtitle: "8 Go RAM · 256 Go SSD · Space Grey",
    price: "820 000 XAF",
    oldPrice: "980 000 XAF",
    discount: "-16%",
    cta: "Réserver",
    href: "/produits?q=macbook+air",
    bg: "from-[#2d1b69] to-[#11998e]",
    accent: "#F5C800",
    img: null,
  },
];

function useCountdown() {
  const [time, setTime] = useState({ h: 5, m: 59, s: 42 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 5; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function FlashBanner() {
  const [idx, setIdx] = useState(0);
  const time = useCountdown();
  const slide = SLIDES[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`relative w-full bg-gradient-to-r ${slide.bg} transition-all duration-700 overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-4">

          {/* Left: tag + title */}
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <span className="shrink-0 text-xs font-black px-2.5 py-1 rounded-full border"
              style={{ color: slide.accent, borderColor: slide.accent, backgroundColor: `${slide.accent}18` }}>
              {slide.tag}
            </span>
            <div className="min-w-0">
              <p className="text-white font-black text-base sm:text-lg leading-tight truncate">{slide.title}</p>
              <p className="text-white/60 text-xs truncate">{slide.subtitle}</p>
            </div>
          </div>

          {/* Center: price + countdown */}
          <div className="hidden sm:flex flex-col items-center shrink-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-white font-black text-xl">{slide.price}</span>
              <span className="text-white/40 text-sm line-through">{slide.oldPrice}</span>
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">{slide.discount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/70 text-xs">
              <Timer className="w-3.5 h-3.5" style={{ color: slide.accent }} />
              <span>Expire dans</span>
              <span className="font-mono font-bold" style={{ color: slide.accent }}>
                {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
              </span>
            </div>
          </div>

          {/* Right: CTA + nav */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={slide.href}
              className="text-sm font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap"
              style={{ backgroundColor: slide.accent, color: "#1A2E1A" }}
            >
              {slide.cta}
            </Link>
            <div className="flex gap-1">
              <button
                onClick={() => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIdx(i => (i + 1) % SLIDES.length)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="h-1 rounded-full transition-all"
              style={{
                width: i === idx ? "20px" : "6px",
                backgroundColor: i === idx ? slide.accent : "rgba(255,255,255,0.3)"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
