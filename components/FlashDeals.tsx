"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { ShopProduct } from "./ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

export default function FlashDeals() {
  const [deals, setDeals] = useState<ShopProduct[]>([]);

  useEffect(() => {
    fetch(`${API}/shop/products?per_page=60&page=1`)
      .then(r => r.json())
      .then((data: unknown) => {
        const items: ShopProduct[] = (data as { items?: ShopProduct[] }).items
          ?? (Array.isArray(data) ? data as ShopProduct[] : []);
        const discounted = items
          .filter(p => p.compare_price && p.sell_price && p.compare_price > p.sell_price && p.stock_available > 0)
          .sort((a, b) => {
            const pctA = ((a.compare_price! - a.sell_price!) / a.compare_price!) * 100;
            const pctB = ((b.compare_price! - b.sell_price!) / b.compare_price!) * 100;
            return pctB - pctA;
          });
        setDeals(discounted.slice(0, 8));
      })
      .catch(() => {});
  }, []);

  if (deals.length === 0) return null;

  return (
    <section className="py-3 px-3 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-orange-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-white text-sm">⚡ Offres Flash</span>
          <Link
            href="/produits?sort=discount"
            className="flex items-center gap-1 text-white/80 text-xs font-semibold hover:text-white"
          >
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {deals.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
