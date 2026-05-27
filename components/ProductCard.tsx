"use client";
import { useState } from "react";
import Link from "next/link";
import { Package, ShoppingCart, Check } from "lucide-react";
import { addToCart } from "@/lib/cart";

export interface ShopProduct {
  id: number;
  sku: string;
  name: string;
  name_fr: string | null;
  description: string | null;
  brand: string | null;
  category: string;
  subcategory: string | null;
  model_number: string | null;
  condition: string;
  tags: string | null;
  weight_kg: number | null;
  sell_price: number | null;
  compare_price: number | null;
  warranty_months: number | null;
  image_url: string | null;
  image_urls: string[] | null;
  is_featured: boolean;
  stock_available: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat("fr-CM", {
    style: "currency", currency: "XAF", maximumFractionDigits: 0,
  }).format(n);
}

export default function ProductCard({ product }: { product: ShopProduct }) {
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addToCart({
      id: product.id,
      sku: product.sku,
      name: product.name_fr ?? product.name,
      image_url: product.image_url,
      sell_price: product.sell_price,
      brand: product.brand,
    });
    window.dispatchEvent(new Event("open-cart"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const discountPct =
    product.compare_price && product.sell_price && product.compare_price > product.sell_price
      ? Math.round(((product.compare_price - product.sell_price) / product.compare_price) * 100)
      : null;

  const waLink = `https://wa.me/237690768890?text=Bonjour%20TEHTEK%2C%20je%20voudrais%20commander%20%3A%20${encodeURIComponent(product.name)}%20(${product.sku})`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-[#2E8B2E] hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/produits/${product.id}`} className="relative block aspect-square bg-slate-50 overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <Package className="w-10 h-10" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPct && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
              -{discountPct}%
            </span>
          )}
          {product.is_featured && (
            <span className="bg-[#F5C800] text-[#1A2E1A] text-xs font-bold px-2 py-0.5 rounded-md">
              Vedette
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {product.stock_available === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              Rupture de stock
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {product.brand && (
          <p className="text-xs text-[#2E8B2E] font-semibold uppercase tracking-wide mb-0.5">{product.brand}</p>
        )}
        <Link href={`/produits/${product.id}`} className="hover:text-[#2E8B2E] transition-colors">
          <h3 className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">
            {product.name_fr ?? product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          {product.sell_price ? (
            <>
              <span className="text-base font-black text-slate-900">{fmt(product.sell_price)}</span>
              {product.compare_price && product.compare_price > product.sell_price && (
                <span className="text-xs text-slate-400 line-through">{fmt(product.compare_price)}</span>
              )}
            </>
          ) : (
            <span className="text-sm text-slate-500 italic">Prix sur demande</span>
          )}
        </div>

        {/* Stock label */}
        <p className={`text-xs mt-1 font-medium ${
          product.stock_available > 5 ? "text-green-600"
          : product.stock_available > 0 ? "text-amber-600"
          : "text-red-500"
        }`}>
          {product.stock_available > 5
            ? "En stock"
            : product.stock_available > 0
            ? `Plus que ${product.stock_available} en stock`
            : "Rupture"}
        </p>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={product.stock_available === 0}
          className={`mt-3 flex items-center justify-center gap-1.5 w-full text-xs font-bold py-2 rounded-xl transition-all ${
            product.stock_available === 0
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : added
              ? "bg-green-600 text-white"
              : "bg-[#2E8B2E] hover:bg-[#236B23] text-white"
          }`}
        >
          {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          {added ? "Ajouté ✓" : product.stock_available === 0 ? "Rupture" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
