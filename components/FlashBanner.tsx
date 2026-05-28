"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { ShopProduct } from "./ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

const THEMES = [
  { bg: "linear-gradient(135deg,#0d1f0d 0%,#1A2E1A 45%,#1e4d1e 100%)", accent: "#F5C800", glow: "rgba(46,139,46,0.3)"   },
  { bg: "linear-gradient(135deg,#0a0a1f 0%,#0f1e4a 45%,#1a3a6e 100%)", accent: "#38bdf8", glow: "rgba(56,189,248,0.3)"  },
  { bg: "linear-gradient(135deg,#1f0a0a 0%,#4a0f0f 45%,#7b1f1f 100%)", accent: "#fb923c", glow: "rgba(251,146,60,0.3)"  },
  { bg: "linear-gradient(135deg,#100a1f 0%,#2d1256 45%,#4c1d95 100%)", accent: "#e879f9", glow: "rgba(232,121,249,0.3)" },
  { bg: "linear-gradient(135deg,#0a1f1a 0%,#0f3d30 45%,#065f46 100%)", accent: "#34d399", glow: "rgba(52,211,153,0.3)"  },
  { bg: "linear-gradient(135deg,#1a0f00 0%,#451a03 45%,#78350f 100%)", accent: "#fbbf24", glow: "rgba(251,191,36,0.3)"  },
  { bg: "linear-gradient(135deg,#001f1f 0%,#0f3d3d 45%,#134e4a 100%)", accent: "#2dd4bf", glow: "rgba(45,212,191,0.3)"  },
  { bg: "linear-gradient(135deg,#1f0010 0%,#500724 45%,#881337 100%)", accent: "#fb7185", glow: "rgba(251,113,133,0.3)" },
  { bg: "linear-gradient(135deg,#0f1000 0%,#2d3a00 45%,#3f5800 100%)", accent: "#a3e635", glow: "rgba(163,230,53,0.3)"  },
  { bg: "linear-gradient(135deg,#0a0f1f 0%,#1e2d4f 45%,#1e3a5f 100%)", accent: "#818cf8", glow: "rgba(129,140,248,0.3)" },
];

function fmt(n: number) {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
}
function pad(n: number) { return String(n).padStart(2, "0"); }

function useCountdown() {
  const [t, setT] = useState({ h: 5, m: 59, s: 42 });
  useEffect(() => {
    const id = setInterval(() => setT(p => {
      let { h, m, s } = p;
      if (--s < 0) { s = 59; if (--m < 0) { m = 59; if (--h < 0) { h = 5; m = 59; s = 59; } } }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function FlashBanner() {
  const [products,  setProducts]  = useState<ShopProduct[]>([]);
  const [idx,       setIdx]       = useState(0);
  const [visible,   setVisible]   = useState(true);
  const [progress,  setProgress]  = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const time = useCountdown();

  useEffect(() => {
    fetch(`${API}/shop/products?per_page=60&page=1`)
      .then(r => r.json())
      .then((data: unknown) => {
        const items: ShopProduct[] = (data as { items?: ShopProduct[] }).items
          ?? (Array.isArray(data) ? data as ShopProduct[] : []);
        setProducts(
          items
            .filter(p => p.sell_price && p.compare_price && p.compare_price > p.sell_price && p.image_url && p.stock_available > 0)
            .sort((a, b) => ((b.compare_price! - b.sell_price!) / b.compare_price!) - ((a.compare_price! - a.sell_price!) / a.compare_price!))
            .slice(0, 10)
        );
      })
      .catch(() => {});
  }, []);

  const DURATION = 6000;

  useEffect(() => {
    if (products.length < 2) return;
    setProgress(0);

    if (timerRef.current) clearTimeout(timerRef.current);
    if (countRef.current) clearInterval(countRef.current);

    const step = 50;
    let elapsed = 0;
    countRef.current = setInterval(() => {
      elapsed += step;
      setProgress(elapsed / DURATION * 100);
    }, step);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % products.length);
        setVisible(true);
        setProgress(0);
      }, 400);
    }, DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countRef.current) clearInterval(countRef.current);
    };
  }, [idx, products.length]);

  function goTo(i: number) {
    if (i === idx) return;
    setVisible(false);
    setTimeout(() => { setIdx(i); setVisible(true); }, 350);
  }

  if (products.length === 0) return null;

  const p     = products[idx];
  const theme = THEMES[idx % THEMES.length];
  const pct   = p.compare_price && p.sell_price
    ? Math.round(((p.compare_price - p.sell_price) / p.compare_price) * 100) : null;

  return (
    <div className="relative w-full overflow-hidden" style={{ background: theme.bg, transition: "background 0.6s ease" }}>

      {/* Animated background orbs */}
      <div style={{
        position: "absolute", top: "-40px", right: "8%",
        width: "220px", height: "220px", borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
        animation: "pulse 4s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-30px", left: "3%",
        width: "150px", height: "150px", borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
        animation: "pulse 3s ease-in-out infinite 1.2s",
      }} />

      <style>{`
        @keyframes pulse       { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.25);opacity:1} }
        @keyframes floatY      { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-10px) rotate(1.5deg)} }
        @keyframes shimmer     { 0%{left:-100%} 100%{left:200%} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeImgIn   { from{opacity:0;transform:scale(.88) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .flash-content { animation: fadeSlideIn .4s ease both; }
        .flash-img     { animation: fadeImgIn .45s ease both, floatY 3.5s ease-in-out infinite .4s; }
        .shimmer-btn::after {
          content:""; position:absolute; top:0; left:-100%; width:55%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);
          animation:shimmer 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Full-bleed image background */}
      <div className="relative" style={{ opacity: visible ? 1 : 0, transition: "opacity .4s ease" }}>
        {p.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`img-${idx}`}
            src={p.image_url}
            alt={p.name_fr ?? p.name}
            className="flash-img absolute right-0 top-0 h-full object-contain drop-shadow-2xl pointer-events-none"
            style={{ maxWidth: "55%", bottom: 0 }}
          />
        )}

        {/* Gradient overlay so text is readable */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.05) 100%)`
        }} />

        <div className="relative px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
          <div className="flash-content max-w-[55%]" key={`content-${idx}`}
            style={{ opacity: visible ? 1 : 0, transition: "opacity .35s ease" }}>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ background: theme.accent, color: "#0a0a0a" }}>
                <Zap className="w-2.5 h-2.5" /> FLASH
              </span>
              {pct && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  -{pct}%
                </span>
              )}
            </div>

            {/* Brand */}
            {p.brand && (
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70" style={{ color: theme.accent }}>
                {p.brand}
              </p>
            )}

            {/* Name */}
            <h2 className="text-white font-black leading-tight mb-2 line-clamp-2"
              style={{ fontSize: "clamp(.85rem, 3vw, 1.5rem)" }}>
              {p.name_fr ?? p.name}
            </h2>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2 mb-2">
              <span className="font-black" style={{ fontSize: "clamp(1.1rem, 3.5vw, 2rem)", color: theme.accent }}>
                {fmt(p.sell_price!)}
              </span>
              {p.compare_price && p.compare_price > p.sell_price! && (
                <span className="text-white/40 line-through text-xs">{fmt(p.compare_price)}</span>
              )}
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-1 mb-3">
              <span className="text-white/50 text-[10px]">Expire dans</span>
              {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
                <span key={i} className="flex items-center gap-0.5">
                  <span className="font-mono font-black text-[11px] rounded px-1.5 py-0.5"
                    style={{ background: `${theme.accent}25`, color: theme.accent, border: `1px solid ${theme.accent}40` }}>
                    {v}
                  </span>
                  {i < 2 && <span className="text-white/30 text-[10px]">:</span>}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={`/produits/${p.id}`}
              className="shimmer-btn relative overflow-hidden inline-flex items-center gap-1.5 font-black text-xs px-4 py-2 rounded-full transition-transform hover:scale-105 active:scale-95"
              style={{ background: `linear-gradient(135deg,${theme.accent},${theme.accent}cc)`, color: "#0a0a0a" }}
            >
              <Zap className="w-3 h-3" /> Commander
            </Link>
          </div>

          {/* Dots */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-1.5">
              {products.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                  style={{ width: i === idx ? "24px" : "7px", background: "rgba(255,255,255,0.2)" }}>
                  {i === idx && (
                    <div className="absolute inset-0 rounded-full origin-left"
                      style={{ background: theme.accent, transform: `scaleX(${progress / 100})`, transition: "transform 50ms linear" }} />
                  )}
                </button>
              ))}
            </div>
            <span className="ml-auto text-white/25 text-[10px] font-mono">
              {idx + 1}/{products.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
