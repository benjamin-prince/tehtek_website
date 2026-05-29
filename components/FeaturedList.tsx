"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShopProduct } from "./ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

function fmt(n: number) {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
}

export default function FeaturedList() {
  const [products, setProducts] = useState<ShopProduct[]>([]);

  useEffect(() => {
    fetch(`${API}/shop/featured`)
      .then(r => r.json())
      .then((data: unknown) => {
        const items: ShopProduct[] = Array.isArray(data)
          ? (data as ShopProduct[])
          : (data as { items?: ShopProduct[] }).items ?? [];
        setProducts(items.filter(p => p.image_url && p.sell_price).slice(0, 12));
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bg-white border-b border-slate-100 py-3">
      <div className="max-w-7xl mx-auto">
        {/* scroll hint label */}
        <div className="flex items-center justify-between px-3 sm:px-6 lg:px-8 mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">⭐ Vedette</span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">Glisser →</span>
        </div>

        {/* scrollable row with right fade */}
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide pl-3 sm:pl-6 lg:pl-8 pr-8">
            {products.map(p => {
              const pct = p.compare_price && p.sell_price && p.compare_price > p.sell_price
                ? Math.round(((p.compare_price - p.sell_price) / p.compare_price) * 100) : null;
              return (
                <Link key={p.id} href={`/produits/${p.id}`}
                  className="flex flex-col shrink-0 w-[42vw] max-w-[180px] rounded-xl border border-slate-100 hover:border-[#2E8B2E] bg-slate-50 overflow-hidden transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image_url!} alt={p.name}
                    className="w-full h-40 object-contain bg-white p-2" />
                  <div className="p-2">
                    <p className="text-xs text-slate-600 font-semibold leading-tight line-clamp-2 mb-1">{p.name}</p>
                    <p className="text-sm font-black text-[#2E8B2E]">{fmt(p.sell_price!)}</p>
                    {pct && (
                      <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">-{pct}%</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          {/* right fade gradient */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}
