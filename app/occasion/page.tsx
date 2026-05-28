"use client";
import { useState, useEffect } from "react";
import { Loader2, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { ShopProduct } from "@/components/ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

const CONDITIONS = [
  { key: "all",         label: "Tous" },
  { key: "used_a",      label: "Grade A — Comme neuf" },
  { key: "used_b",      label: "Grade B — Bon état" },
  { key: "used_c",      label: "Grade C — État correct" },
  { key: "refurbished", label: "Reconditionné" },
];

export default function OccasionPage() {
  const [products,  setProducts]  = useState<ShopProduct[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [condition, setCondition] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/shop/products?per_page=60&page=1`)
      .then(r => r.json())
      .then((data: unknown) => {
        const items: ShopProduct[] = (data as { items?: ShopProduct[] }).items
          ?? (Array.isArray(data) ? data as ShopProduct[] : []);
        setProducts(items.filter(p => p.condition !== "new"));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = condition === "all"
    ? products
    : products.filter(p => p.condition === condition);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-black text-slate-800 mb-1">Produits d&apos;occasion</h1>
          <p className="text-slate-500 text-sm mb-8">
            Téléphones, PC, et accessoires reconditionnés ou d&apos;occasion — vérifiés et garantis par TEHTEK.
          </p>

          {/* Condition filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CONDITIONS.map(c => (
              <button
                key={c.key}
                onClick={() => setCondition(c.key)}
                className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                  condition === c.key
                    ? "bg-[#2E8B2E] border-[#2E8B2E] text-white"
                    : "border-slate-200 text-slate-600 hover:border-[#2E8B2E] hover:text-[#2E8B2E] bg-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-[#2E8B2E] animate-spin" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-24">
              <Package className="w-14 h-14 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Aucun produit dans cette catégorie actuellement.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              <p className="text-sm text-slate-500 mb-4">{filtered.length} produit{filtered.length > 1 ? "s" : ""}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
