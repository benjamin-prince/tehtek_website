"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard, { ShopProduct } from "./ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(`${API}/shop/featured`)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setProducts(data as ShopProduct[]);
        else if (data && typeof data === "object" && "items" in data)
          setProducts((data as { items: ShopProduct[] }).items ?? []);
        else setProducts([]);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Loader2 className="w-8 h-8 text-[#2E8B2E] animate-spin" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-slate-50 py-14 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Produits en vedette</h2>
            <p className="text-slate-500 text-sm mt-1">Notre sélection du moment</p>
          </div>
          <Link
            href="/produits"
            className="flex items-center gap-1.5 text-[#2E8B2E] hover:underline text-sm font-semibold"
          >
            Voir tout le catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
