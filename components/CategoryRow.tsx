"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { ShopProduct } from "./ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

interface Props {
  catKey: string;
  label: string;
  emoji: string;
}

export default function CategoryRow({ catKey, label, emoji }: Props) {
  const [products, setProducts] = useState<ShopProduct[]>([]);

  useEffect(() => {
    fetch(`${API}/shop/products?cat=${catKey}&per_page=10&page=1`)
      .then(r => r.json())
      .then((data: unknown) => {
        const items: ShopProduct[] = (data as { items?: ShopProduct[] }).items
          ?? (Array.isArray(data) ? data as ShopProduct[] : []);
        setProducts(
          items.filter(p => p.image_url && p.sell_price && p.stock_available > 0).slice(0, 10)
        );
      })
      .catch(() => {});
  }, [catKey]);

  if (products.length === 0) return null;

  return (
    <section className="py-3 px-3 sm:px-6 lg:px-8 border-b border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
            {emoji} {label}
          </span>
          <Link href={`/produits?cat=${catKey}`}
            className="flex items-center gap-1 text-[#2E8B2E] text-xs font-semibold hover:underline">
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
