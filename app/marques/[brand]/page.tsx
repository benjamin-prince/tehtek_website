"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { ShopProduct } from "@/components/ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

export default function BrandPage() {
  const { brand } = useParams<{ brand: string }>();
  const brandName = decodeURIComponent(brand);
  const displayName = brandName.charAt(0).toUpperCase() + brandName.slice(1);

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/shop/products?per_page=48&page=1`)
      .then(r => r.json())
      .then((data: unknown) => {
        const items: ShopProduct[] = (data as { items?: ShopProduct[] }).items
          ?? (Array.isArray(data) ? data as ShopProduct[] : []);
        setProducts(
          items.filter(p => p.brand?.toLowerCase() === brandName.toLowerCase())
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [brandName]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-black text-slate-800 mb-2">
            Produits {displayName}
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            Tous les produits de la marque {displayName} disponibles chez TEHTEK
          </p>

          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-[#2E8B2E] animate-spin" />
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-24">
              <Package className="w-14 h-14 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Aucun produit {displayName} en stock actuellement.</p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
