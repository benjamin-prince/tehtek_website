"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Package, Trash2, ShoppingCart, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WishlistItem, getWishlist, removeFromWishlist } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";

function fmt(n: number) {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [added, setAdded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setItems(getWishlist());
    function onUpdate() { setItems(getWishlist()); }
    window.addEventListener("wishlist-updated", onUpdate);
    return () => window.removeEventListener("wishlist-updated", onUpdate);
  }, []);

  function handleRemove(id: number) {
    removeFromWishlist(id);
  }

  function handleAdd(item: WishlistItem) {
    addToCart({
      id: item.id, sku: item.sku, name: item.name,
      image_url: item.image_url, sell_price: item.sell_price, brand: item.brand,
    });
    window.dispatchEvent(new Event("open-cart"));
    setAdded(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [item.id]: false })), 1500);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <h1 className="text-2xl font-black text-slate-800">Mes favoris</h1>
            {items.length > 0 && (
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-600 mb-2">Aucun favori pour l&apos;instant</h2>
              <p className="text-slate-400 mb-8 text-sm">Cliquez sur le ♥ sur n&apos;importe quel produit pour l&apos;ajouter ici.</p>
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-[#2E8B2E] hover:bg-[#236B23] text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Parcourir les produits
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(item => {
                const discountPct = item.compare_price && item.sell_price && item.compare_price > item.sell_price
                  ? Math.round(((item.compare_price - item.sell_price) / item.compare_price) * 100)
                  : null;

                return (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <Link href={`/produits/${item.id}`} className="relative aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-contain p-4" />
                      ) : (
                        <Package className="w-10 h-10 text-slate-300" />
                      )}
                      {discountPct && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                          -{discountPct}%
                        </span>
                      )}
                    </Link>

                    <div className="p-4 flex flex-col flex-1">
                      {item.brand && (
                        <p className="text-xs text-[#2E8B2E] font-semibold uppercase tracking-wide mb-0.5">{item.brand}</p>
                      )}
                      <Link href={`/produits/${item.id}`} className="hover:text-[#2E8B2E] transition-colors">
                        <h3 className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2 mb-2">{item.name}</h3>
                      </Link>

                      <div className="flex items-baseline gap-2 mb-4">
                        {item.sell_price ? (
                          <>
                            <span className="text-base font-black text-slate-900">{fmt(item.sell_price)}</span>
                            {item.compare_price && item.compare_price > item.sell_price && (
                              <span className="text-xs text-slate-400 line-through">{fmt(item.compare_price)}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-slate-500 italic">Prix sur demande</span>
                        )}
                      </div>

                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() => handleAdd(item)}
                          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl transition-all ${
                            added[item.id]
                              ? "bg-green-600 text-white"
                              : "bg-[#2E8B2E] hover:bg-[#236B23] text-white"
                          }`}
                        >
                          {added[item.id] ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                          {added[item.id] ? "Ajouté ✓" : "Panier"}
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          title="Retirer des favoris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
