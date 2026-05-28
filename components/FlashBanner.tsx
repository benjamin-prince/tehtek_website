"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { ShopProduct } from "./ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

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
            .slice(0, 5)
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

  const p   = products[idx];
  const pct = p.compare_price && p.sell_price
    ? Math.round(((p.compare_price - p.sell_price) / p.compare_price) * 100) : null;

  return (
    <div className="relative w-full overflow-hidden" style={{
      background: "linear-gradient(135deg, #0d1f0d 0%, #1A2E1A 40%, #1e4d1e 70%, #0d1f0d 100%)",
      minHeight: "260px",
    }}>

      {/* Animated background orbs */}
      <div style={{
        position: "absolute", top: "-60px", right: "10%",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(46,139,46,0.25) 0%, transparent 70%)",
        animation: "pulse 4s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-40px", left: "5%",
        width: "200px", height: "200px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,200,0,0.12) 0%, transparent 70%)",
        animation: "pulse 3s ease-in-out infinite 1s",
      }} />

      <style>{`
        @keyframes pulse   { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.2);opacity:1} }
        @keyframes floatY  { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
        @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeSlideImg { from{opacity:0;transform:scale(.9) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .flash-content { animation: fadeSlideIn .45s ease both; }
        .flash-img     { animation: fadeSlideImg .5s ease both, floatY 4s ease-in-out infinite .5s; }
        .shimmer-btn::after {
          content:""; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent);
          animation:shimmer 2.4s ease-in-out infinite;
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-7 sm:py-10">
        <div className="flex items-center gap-4 sm:gap-10">

          {/* ── Left content ── */}
          <div className="flex-1 min-w-0" style={{ opacity: visible ? 1 : 0, transition: "opacity .35s ease" }}>
            <div className="flash-content" key={`content-${idx}`}>

              {/* Badge row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full"
                  style={{ background: "#F5C800", color: "#1A2E1A" }}>
                  <Zap className="w-3 h-3" /> OFFRE FLASH
                </span>
                {pct && (
                  <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full animate-pulse">
                    -{pct}% OFF
                  </span>
                )}
                {p.brand && (
                  <span className="text-xs font-bold uppercase tracking-widest text-[#F5C800]/70">
                    {p.brand}
                  </span>
                )}
              </div>

              {/* Name */}
              <h2 className="text-white font-black leading-tight mb-2 line-clamp-2"
                style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                {p.name_fr ?? p.name}
              </h2>

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-3 mb-4">
                <span className="font-black text-[#F5C800]" style={{ fontSize: "clamp(1.4rem, 4vw, 2.4rem)" }}>
                  {fmt(p.sell_price!)}
                </span>
                {p.compare_price && p.compare_price > p.sell_price! && (
                  <span className="text-white/35 line-through" style={{ fontSize: "clamp(.9rem, 2vw, 1.2rem)" }}>
                    {fmt(p.compare_price)}
                  </span>
                )}
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-white/50 text-xs font-semibold">Expire dans</span>
                {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="font-mono font-black text-sm rounded px-2 py-0.5"
                      style={{ background: "rgba(245,200,0,0.15)", color: "#F5C800", border: "1px solid rgba(245,200,0,0.3)" }}>
                      {v}
                    </span>
                    {i < 2 && <span className="text-white/30 text-xs font-bold">:</span>}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4">
                <Link
                  href={`/produits/${p.id}`}
                  className="shimmer-btn relative overflow-hidden inline-flex items-center gap-2 font-black text-sm px-6 py-3 rounded-full transition-transform hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg,#F5C800,#e6b800)", color: "#1A2E1A" }}
                >
                  <Zap className="w-4 h-4" />
                  Commander maintenant
                </Link>
                <Link href="/produits?sort=discount"
                  className="text-white/50 hover:text-white text-sm font-semibold transition-colors">
                  Voir toutes les offres →
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right: product image ── */}
          <div className="shrink-0 relative flex items-center justify-center"
            style={{ width: "clamp(130px,25vw,260px)", height: "clamp(130px,25vw,260px)",
              opacity: visible ? 1 : 0, transition: "opacity .35s ease" }}>
            {/* Glow ring */}
            <div className="absolute inset-4 rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(245,200,0,0.3) 0%, transparent 70%)" }} />
            {/* Image */}
            {p.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`img-${idx}`}
                src={p.image_url}
                alt={p.name_fr ?? p.name}
                className="flash-img relative w-full h-full object-contain drop-shadow-2xl"
              />
            )}
          </div>
        </div>

        {/* ── Bottom: dots + progress ── */}
        <div className="flex items-center gap-3 mt-5">
          <div className="flex gap-2">
            {products.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === idx ? "40px" : "10px", background: "rgba(255,255,255,0.2)" }}>
                {i === idx && (
                  <div className="absolute inset-0 rounded-full origin-left"
                    style={{ background: "#F5C800", transform: `scaleX(${progress / 100})`, transition: "transform 50ms linear" }} />
                )}
              </button>
            ))}
          </div>
          <span className="ml-auto text-white/30 text-xs font-mono">
            {String(idx + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
