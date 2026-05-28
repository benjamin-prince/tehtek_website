"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Zap, Timer } from "lucide-react";
import { ShopProduct } from "./ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

function fmt(n: number) {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
}
function pad(n: number) { return String(n).padStart(2, "0"); }

function useCountdown() {
  const [t, setT] = useState({ h: 4, m: 59, s: 30 });
  useEffect(() => {
    const id = setInterval(() => setT(p => {
      let { h, m, s } = p;
      if (--s < 0) { s = 59; if (--m < 0) { m = 59; if (--h < 0) { h = 4; m = 59; s = 59; } } }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const PER_PAGE = 5;

export default function FlashBanner() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [page,     setPage]     = useState(0);
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
            .slice(0, 20)
        );
      })
      .catch(() => {});
  }, []);

  const totalPages = Math.ceil(products.length / PER_PAGE);

  useEffect(() => {
    if (totalPages < 2) return;
    setProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countRef.current) clearInterval(countRef.current);

    let elapsed = 0;
    const DURATION = 5000;
    const STEP = 50;
    countRef.current = setInterval(() => {
      elapsed += STEP;
      setProgress((elapsed / DURATION) * 100);
    }, STEP);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setPage(p => (p + 1) % totalPages);
        setVisible(true);
        setProgress(0);
      }, 350);
    }, DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countRef.current) clearInterval(countRef.current);
    };
  }, [page, totalPages]);

  if (products.length === 0) return null;

  const slice = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div className="w-full bg-[#0d1a0d] border-b border-[#2E8B2E]/20">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
        .fb-card { animation: fadeUp .35s ease both; }
        .fb-card:nth-child(1){animation-delay:.0s}
        .fb-card:nth-child(2){animation-delay:.05s}
        .fb-card:nth-child(3){animation-delay:.1s}
        .fb-card:nth-child(4){animation-delay:.15s}
        .fb-card:nth-child(5){animation-delay:.2s}
        .fb-shimmer::after{content:"";position:absolute;top:0;left:-100%;width:50%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
          animation:shimmer 2s ease-in-out infinite;}
      `}</style>

      {/* Header strip */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2E8B2E]/20">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-[#F5C800] text-[#0d1a0d] text-[10px] font-black px-2.5 py-0.5 rounded-full">
            <Zap className="w-2.5 h-2.5" /> OFFRES FLASH
          </span>
          <div className="flex items-center gap-1 text-[10px] text-white/50">
            <Timer className="w-3 h-3 text-[#F5C800]" />
            <span className="font-mono font-bold text-[#F5C800]">
              {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
            </span>
          </div>
        </div>
        <Link href="/produits?sort=discount" className="text-[10px] text-white/40 hover:text-[#F5C800] transition-colors font-semibold">
          Tout voir →
        </Link>
      </div>

      {/* Cards */}
      <div
        className="grid px-1 py-2"
        style={{
          gridTemplateColumns: `repeat(${PER_PAGE}, 1fr)`,
          gap: "4px",
          opacity: visible ? 1 : 0,
          transition: "opacity .3s ease",
        }}
      >
        {slice.map((p, i) => {
          const pct = p.compare_price && p.sell_price
            ? Math.round(((p.compare_price - p.sell_price) / p.compare_price) * 100) : null;
          return (
            <Link
              key={`${page}-${i}`}
              href={`/produits/${p.id}`}
              className="fb-card fb-shimmer relative flex flex-col items-center rounded-xl overflow-hidden bg-[#111d11] border border-[#2E8B2E]/20 hover:border-[#F5C800]/50 transition-colors"
            >
              {/* Discount badge */}
              {pct && (
                <span className="absolute top-1.5 left-1.5 z-10 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                  -{pct}%
                </span>
              )}

              {/* Image */}
              <div className="w-full aspect-square flex items-center justify-center p-2 bg-[#0d1a0d]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image_url!}
                  alt=""
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Price only */}
              <div className="w-full px-1.5 py-1.5 text-center">
                <p className="text-[#F5C800] font-black text-[11px] leading-tight truncate">
                  {fmt(p.sell_price!)}
                </p>
                {p.compare_price && p.compare_price > p.sell_price! && (
                  <p className="text-white/30 line-through text-[9px] leading-tight">
                    {fmt(p.compare_price)}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Progress dots */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pb-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setVisible(false); setTimeout(() => { setPage(i); setVisible(true); }, 300); }}
              className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === page ? "20px" : "6px", background: "rgba(255,255,255,0.15)" }}
            >
              {i === page && (
                <div className="absolute inset-0 origin-left rounded-full bg-[#F5C800]"
                  style={{ transform: `scaleX(${progress / 100})`, transition: "transform 50ms linear" }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
