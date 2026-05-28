"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { ShopProduct } from "./ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

const THEMES = [
  { bg: "from-[#0f2027] via-[#1A2E1A] to-[#2E8B2E]", accent: "#F5C800" },
  { bg: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",  accent: "#00b4d8" },
  { bg: "from-[#4a0000] via-[#7b0000] to-[#c0392b]",  accent: "#F5C800" },
  { bg: "from-[#1a0533] via-[#2d1b69] to-[#553c9a]",  accent: "#f9a8d4" },
];

function fmt(n: number) {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
}

function pad(n: number) { return String(n).padStart(2, "0"); }

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

export default function FlashBanner() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [idx, setIdx]           = useState(0);
  const time                    = useCountdown();

  useEffect(() => {
    fetch(`${API}/shop/products?per_page=60&page=1`)
      .then(r => r.json())
      .then((data: unknown) => {
        const items: ShopProduct[] = (data as { items?: ShopProduct[] }).items
          ?? (Array.isArray(data) ? data as ShopProduct[] : []);
        const featured = items
          .filter(p => p.sell_price && p.compare_price && p.compare_price > p.sell_price && p.image_url && p.stock_available > 0)
          .sort((a, b) => {
            const pA = ((a.compare_price! - a.sell_price!) / a.compare_price!) * 100;
            const pB = ((b.compare_price! - b.sell_price!) / b.compare_price!) * 100;
            return pB - pA;
          })
          .slice(0, 4);
        setProducts(featured);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (products.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % products.length), 6000);
    return () => clearInterval(t);
  }, [products.length]);

  if (products.length === 0) return null;

  const p     = products[idx];
  const theme = THEMES[idx % THEMES.length];
  const pct   = p.compare_price && p.sell_price
    ? Math.round(((p.compare_price - p.sell_price) / p.compare_price) * 100)
    : null;

  return (
    <div className={`relative w-full bg-gradient-to-br ${theme.bg} overflow-hidden`} style={{ minHeight: "220px" }}>

      {/* Decorative circles */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10 bg-white" />
      <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full opacity-10 bg-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-6">

          {/* Left: content */}
          <div className="flex-1 min-w-0">
            {/* Tag */}
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full"
                style={{ backgroundColor: theme.accent, color: "#1A2E1A" }}>
                <Zap className="w-3 h-3" /> OFFRE FLASH
              </span>
              {pct && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  -{pct}%
                </span>
              )}
            </div>

            {/* Brand */}
            {p.brand && (
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: theme.accent }}>
                {p.brand}
              </p>
            )}

            {/* Name */}
            <h2 className="text-white font-black text-xl sm:text-3xl leading-tight mb-1 line-clamp-2">
              {p.name_fr ?? p.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-white font-black text-2xl sm:text-4xl">
                {fmt(p.sell_price!)}
              </span>
              {p.compare_price && p.compare_price > p.sell_price! && (
                <span className="text-white/40 text-base line-through">
                  {fmt(p.compare_price)}
                </span>
              )}
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2 mb-5">
              <Timer className="w-4 h-4" style={{ color: theme.accent }} />
              <span className="text-white/60 text-sm">Expire dans</span>
              <div className="flex items-center gap-1">
                {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="font-mono font-black text-sm px-2 py-0.5 rounded"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)", color: theme.accent }}>
                      {v}
                    </span>
                    {i < 2 && <span className="text-white/40 font-bold text-xs">:</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                href={`/produits/${p.id}`}
                className="font-black text-sm px-6 py-2.5 rounded-full transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: theme.accent, color: "#1A2E1A" }}
              >
                Commander maintenant
              </Link>
              <Link href="/produits?sort=discount"
                className="text-white/60 hover:text-white text-sm transition-colors">
                Voir tout →
              </Link>
            </div>
          </div>

          {/* Right: product image */}
          {p.image_url && (
            <Link href={`/produits/${p.id}`}
              className="shrink-0 w-36 h-36 sm:w-56 sm:h-56 lg:w-64 lg:h-64 relative flex items-center justify-center">
              {/* Glow */}
              <div className="absolute inset-0 rounded-full blur-3xl opacity-30 scale-75"
                style={{ backgroundColor: theme.accent }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image_url}
                alt={p.name_fr ?? p.name}
                className="relative w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </Link>
          )}
        </div>

        {/* Dots + slide count */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex gap-1.5">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? "24px" : "8px",
                  backgroundColor: i === idx ? theme.accent : "rgba(255,255,255,0.3)"
                }}
              />
            ))}
          </div>
          <div className="ml-auto flex gap-1.5">
            <button
              onClick={() => setIdx(i => (i - 1 + products.length) % products.length)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIdx(i => (i + 1) % products.length)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
