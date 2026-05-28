"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Zap, Timer } from "lucide-react";
import { ShopProduct } from "./ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

const THEMES = [
  { bg: "135deg,#0d1f0d,#1A2E1A,#1e4d1e", accent: "#F5C800", glow: "46,139,46" },
  { bg: "135deg,#0a0a1f,#0f1e4a,#1a3a6e", accent: "#38bdf8", glow: "56,189,248" },
  { bg: "135deg,#1f0a0a,#4a0f0f,#7b1f1f", accent: "#fb923c", glow: "251,146,60"  },
  { bg: "135deg,#100a1f,#2d1256,#4c1d95", accent: "#e879f9", glow: "232,121,249" },
  { bg: "135deg,#0a1f1a,#0f3d30,#065f46", accent: "#34d399", glow: "52,211,153"  },
];

function fmt(n: number) {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
}
function pad(n: number) { return String(n).padStart(2, "0"); }

function useCountdown() {
  const [t, setT] = useState({ h: 3, m: 59, s: 50 });
  useEffect(() => {
    const id = setInterval(() => setT(p => {
      let { h, m, s } = p;
      if (--s < 0) { s = 59; if (--m < 0) { m = 59; if (--h < 0) { h = 3; m = 59; s = 59; } } }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const DURATION = 4000;

export default function FlashBanner() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [idx,      setIdx]      = useState(0);
  const [visible,  setVisible]  = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const time = useCountdown();

  useEffect(() => {
    fetch(`${API}/shop/products?per_page=80&page=1`)
      .then(r => r.json())
      .then((data: unknown) => {
        const items: ShopProduct[] = (data as { items?: ShopProduct[] }).items
          ?? (Array.isArray(data) ? data as ShopProduct[] : []);
        setProducts(
          items
            .filter(p => p.sell_price && p.compare_price && p.compare_price > p.sell_price && p.image_url && p.stock_available > 0)
            .sort((a, b) => ((b.compare_price! - b.sell_price!) / b.compare_price!) - ((a.compare_price! - a.sell_price!) / a.compare_price!))
            .slice(0, 5)
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (products.length < 2) return;
    setProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countRef.current) clearInterval(countRef.current);
    let elapsed = 0;
    countRef.current = setInterval(() => { elapsed += 40; setProgress((elapsed / DURATION) * 100); }, 40);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % products.length); setVisible(true); setProgress(0); }, 300);
    }, DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); if (countRef.current) clearInterval(countRef.current); };
  }, [idx, products.length]);

  function goTo(i: number) {
    if (i === idx) return;
    setVisible(false);
    setTimeout(() => { setIdx(i); setVisible(true); }, 280);
  }

  if (products.length === 0) return null;

  const p     = products[idx];
  const theme = THEMES[idx % THEMES.length];
  const pct   = p.compare_price && p.sell_price
    ? Math.round(((p.compare_price - p.sell_price) / p.compare_price) * 100) : null;

  return (
    <div className="relative w-full overflow-hidden" style={{ background: `linear-gradient(${theme.bg})`, transition: "background .5s ease" }}>
      <style>{`
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes slideInL  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInR  { from{opacity:0;transform:translateX(16px) scale(.95)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes shimmer   { 0%{left:-100%} 100%{left:200%} }
        .fb-text { animation: slideInL .32s ease both; }
        .fb-img  { animation: slideInR .36s ease both, floatY 3.5s ease-in-out infinite .4s; }
        .fb-btn::after { content:""; position:absolute; top:0; left:-100%; width:50%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);
          animation:shimmer 2s ease-in-out infinite; }
      `}</style>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 70% 50%, rgba(${theme.glow},0.2) 0%, transparent 65%)`
      }} />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-5">
        <div className="flex items-center gap-3 sm:gap-6" style={{ opacity: visible ? 1 : 0, transition: "opacity .28s ease" }}>

          {/* ── Left: info ── */}
          <div className="flex-1 min-w-0">
            <div className="fb-text" key={`t${idx}`}>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full"
                  style={{ background: theme.accent, color: "#080808" }}>
                  <Zap className="w-2.5 h-2.5" /> FLASH
                </span>
                {pct && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    -{pct}%
                  </span>
                )}
                {p.brand && (
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: theme.accent }}>
                    {p.brand}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-2 mb-2">
                <span className="font-black" style={{ fontSize: "clamp(1.15rem,4vw,2rem)", color: theme.accent }}>
                  {fmt(p.sell_price!)}
                </span>
                {p.compare_price && p.compare_price > p.sell_price! && (
                  <span className="text-white/35 line-through text-xs sm:text-sm">{fmt(p.compare_price)}</span>
                )}
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-1.5 mb-3">
                <Timer className="w-3 h-3 opacity-50" style={{ color: theme.accent }} />
                <span className="text-white/40 text-[10px]">Expire dans</span>
                {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
                  <span key={i} className="flex items-center gap-0.5">
                    <span className="font-mono font-black text-[11px] px-1.5 py-0.5 rounded"
                      style={{ background: `rgba(${theme.glow},0.2)`, color: theme.accent, border: `1px solid rgba(${theme.glow},0.3)` }}>
                      {v}
                    </span>
                    {i < 2 && <span className="text-white/25 text-[10px]">:</span>}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link href={`/produits/${p.id}`}
                className="fb-btn relative overflow-hidden inline-flex items-center gap-1.5 font-black text-xs sm:text-sm px-4 py-2 rounded-full transition-transform hover:scale-105 active:scale-95"
                style={{ background: `linear-gradient(135deg,${theme.accent},${theme.accent}cc)`, color: "#080808" }}>
                <Zap className="w-3 h-3" /> Commander
              </Link>
            </div>
          </div>

          {/* ── Right: big image ── */}
          <div className="shrink-0 flex items-center justify-center"
            style={{ width: "clamp(160px,45vw,320px)", height: "clamp(160px,45vw,320px)" }}>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full blur-3xl opacity-40"
                style={{ background: `radial-gradient(circle, rgba(${theme.glow},0.6) 0%, transparent 70%)` }} />
              {p.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={`i${idx}`} src={p.image_url} alt=""
                  className="fb-img relative w-full h-full object-contain drop-shadow-2xl" />
              )}
            </div>
          </div>
        </div>

        {/* ── Dots progress ── */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex gap-1.5">
            {products.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === idx ? "22px" : "7px", background: "rgba(255,255,255,0.15)" }}>
                {i === idx && (
                  <div className="absolute inset-0 origin-left rounded-full"
                    style={{ background: theme.accent, transform: `scaleX(${progress / 100})`, transition: "transform 40ms linear" }} />
                )}
              </button>
            ))}
          </div>
          <Link href="/produits?sort=discount"
            className="ml-auto text-white/30 hover:text-white/70 text-[10px] font-semibold transition-colors">
            Tout voir →
          </Link>
        </div>
      </div>
    </div>
  );
}
