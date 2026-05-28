"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, ArrowLeft, Package, Shield, Star, Loader2, Tag, Weight, Cpu, CheckCircle2, Sparkles, Check, Plus, Minus, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { ShopProduct } from "@/components/ProductCard";
import { addToCart, getCart, cartCount } from "@/lib/cart";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

const CONDITION_MAP: Record<string, { label: string; sub: string; cls: string }> = {
  new:         { label: "Neuf",              sub: "Emballage intact",        cls: "bg-green-50 text-green-700 border-green-200" },
  used_a:      { label: "Occasion Grade A",  sub: "Comme neuf",              cls: "bg-blue-50 text-blue-700 border-blue-200" },
  used_b:      { label: "Occasion Grade B",  sub: "Bon état",                cls: "bg-amber-50 text-amber-700 border-amber-200" },
  used_c:      { label: "Occasion Grade C",  sub: "État correct",            cls: "bg-orange-50 text-orange-700 border-orange-200" },
  refurbished: { label: "Reconditionné",     sub: "Remis à neuf",            cls: "bg-purple-50 text-purple-700 border-purple-200" },
};

function ConditionBadge({ condition }: { condition: string }) {
  const c = CONDITION_MAP[condition] ?? CONDITION_MAP.new;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${c.cls}`}>
      <Sparkles className="w-3 h-3" />
      {c.label}
    </span>
  );
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product,    setProduct]    = useState<ShopProduct | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [notFound,   setNotFound]   = useState(false);
  const [qty,        setQty]        = useState(1);
  const [added,      setAdded]      = useState(false);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [activeImg,  setActiveImg]  = useState(0);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ShopProduct[]>([]);

  const [cartCount_, setCartCount_] = useState(0);
  const refreshCount = useCallback(() => setCartCount_(cartCount(getCart())), []);
  useEffect(() => {
    refreshCount();
    window.addEventListener("cart-updated", refreshCount);
    return () => window.removeEventListener("cart-updated", refreshCount);
  }, [refreshCount]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  useEffect(() => {
    fetch(`${API}/shop/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((p: ShopProduct) => {
        setProduct(p);
        // Fetch related products from same category
        fetch(`${API}/shop/products?category=${encodeURIComponent(p.category)}&per_page=8&page=1`)
          .then(r => r.json())
          .then((data: unknown) => {
            const items: ShopProduct[] = (data as { items?: ShopProduct[] }).items
              ?? (Array.isArray(data) ? data as ShopProduct[] : []);
            setRelatedProducts(items.filter(r => r.id !== p.id && r.stock_available > 0).slice(0, 4));
          })
          .catch(() => {});
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const waLink = product
    ? `https://wa.me/237690768890?text=Bonjour%20TEHTEK%2C%20je%20voudrais%20commander%20%3A%20${encodeURIComponent((product.name_fr ?? product.name) + (product.sku ? " (SKU: " + product.sku + ")" : ""))}`
    : "#";

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        sku: product.sku,
        name: product.name_fr ?? product.name,
        image_url: product.image_url,
        sell_price: product.sell_price,
        brand: product.brand,
      });
    }
    window.dispatchEvent(new Event("open-cart"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  // Render description as bullet list if it contains newlines, otherwise paragraph
  const descLines = product?.description
    ? product.description.split("\n").map(l => l.trim()).filter(Boolean)
    : [];

  return (
    <>
      <Navbar hideSearch />
      <main className="min-h-screen bg-slate-50 pb-24 sm:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#2E8B2E] text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux produits
          </Link>

          {loading && (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 text-[#2E8B2E] animate-spin" />
            </div>
          )}

          {notFound && (
            <div className="text-center py-32">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Produit introuvable</h2>
              <p className="text-slate-500 mb-6">Ce produit n&apos;existe pas ou n&apos;est plus disponible.</p>
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-[#2E8B2E] hover:bg-[#236B23] text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Voir tous les produits
              </Link>
            </div>
          )}

          {product && (
            <div className="space-y-10">
              {/* Main grid: image + info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* ── Image Gallery ── */}
                {(() => {
                  const allImgs = (product.image_urls && product.image_urls.length > 0)
                    ? product.image_urls
                    : product.image_url ? [product.image_url] : [];
                  const mainSrc = allImgs[activeImg] ?? null;

                  return (
                    <div className="space-y-3">
                      {/* Main image */}
                      <div className="relative rounded-3xl border border-slate-200 bg-white aspect-square flex items-center justify-center overflow-hidden shadow-sm">
                        {mainSrc ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              key={mainSrc}
                              src={mainSrc}
                              alt={product.name_fr ?? product.name}
                              className="w-full h-full object-contain p-8 cursor-zoom-in"
                              onClick={() => setLightboxOpen(true)}
                            />
                            <button
                              onClick={() => setLightboxOpen(true)}
                              className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow border border-slate-200 hover:bg-white transition-colors"
                              title="Agrandir"
                            >
                              <ZoomIn className="w-4 h-4 text-slate-500" />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-slate-300">
                            <Package className="w-24 h-24 mb-3" />
                            <span className="text-sm text-slate-400">Aucune image</span>
                          </div>
                        )}

                        {/* Prev / Next arrows (shown only when > 1 image) */}
                        {allImgs.length > 1 && (
                          <>
                            <button
                              onClick={() => setActiveImg(i => (i - 1 + allImgs.length) % allImgs.length)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow border border-slate-200 hover:bg-white transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5 text-slate-600" />
                            </button>
                            <button
                              onClick={() => setActiveImg(i => (i + 1) % allImgs.length)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow border border-slate-200 hover:bg-white transition-colors"
                            >
                              <ChevronRight className="w-5 h-5 text-slate-600" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnails (shown only when > 1 image) */}
                      {allImgs.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {allImgs.map((url, i) => (
                            <button
                              key={url + i}
                              onClick={() => setActiveImg(i)}
                              className={`shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-colors ${
                                i === activeImg
                                  ? "border-[#2E8B2E] shadow-md"
                                  : "border-slate-200 hover:border-[#2E8B2E]/50"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`Vue ${i + 1}`} className="w-full h-full object-contain p-1" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* ── Info panel ── */}
                <div className="py-4 flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    {product.brand && (
                      <p className="text-[#2E8B2E] font-semibold text-sm uppercase tracking-widest">
                        {product.brand}
                      </p>
                    )}
                    <ConditionBadge condition={product.condition} />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 mb-3 leading-tight">
                    {product.name_fr ?? product.name}
                  </h1>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-[#F5C800] text-[#F5C800]" />
                    ))}
                    <span className="text-slate-400 text-sm ml-2">Produit certifié TEHTEK</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-6">
                    {product.sell_price ? (
                      <>
                        <span className="text-4xl font-black text-slate-900">
                          {formatPrice(product.sell_price)}
                        </span>
                        {product.compare_price && product.compare_price > product.sell_price && (
                          <span className="text-xl text-slate-400 line-through">
                            {formatPrice(product.compare_price)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-2xl text-slate-500 font-semibold">Prix sur demande</span>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="mb-6">
                    {product.stock_available > 5 ? (
                      <span className="inline-flex items-center gap-1.5 text-[#2E8B2E] bg-green-50 border border-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-[#2E8B2E] rounded-full" />
                        En stock ({product.stock_available} disponible{product.stock_available > 1 ? "s" : ""})
                      </span>
                    ) : product.stock_available > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-amber-500 rounded-full" />
                        Stock limité — {product.stock_available} restant{product.stock_available > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        Rupture de stock
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {descLines.length > 0 && (
                    <div className="mb-6">
                      {descLines.length === 1 ? (
                        <p className="text-slate-600 leading-relaxed text-sm">{descLines[0]}</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {descLines.map((line, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle2 className="w-4 h-4 text-[#2E8B2E] shrink-0 mt-0.5" />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {product.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.tags.split(",").map((t) => (
                        <span key={t} className="bg-green-50 border border-green-200 text-[#2E8B2E] text-xs px-3 py-1 rounded-full">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Qty + Add to cart */}
                  <div className="mt-auto space-y-3">
                    {/* Qty selector */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500 font-medium">Quantité :</span>
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setQty(q => Math.max(1, q - 1))}
                          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-slate-800">{qty}</span>
                        <button
                          onClick={() => setQty(q => q + 1)}
                          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Add to cart */}
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock_available === 0}
                      className={`w-full flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-2xl transition-all text-base shadow-md ${
                        product.stock_available === 0
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : added
                          ? "bg-green-600 text-white"
                          : "bg-[#2E8B2E] hover:bg-[#236B23] text-white"
                      }`}
                    >
                      {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                      {added ? `Ajouté au panier ✓` : product.stock_available === 0 ? "Rupture de stock" : "Ajouter au panier"}
                    </button>

                    {/* WhatsApp direct */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 border border-[#2E8B2E]/40 text-[#2E8B2E] hover:bg-green-50 font-semibold py-3.5 px-6 rounded-2xl transition-colors text-sm"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Commander directement via WhatsApp
                    </a>
                  </div>

                  {/* Trust badges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                      <Shield className="w-5 h-5 text-[#2E8B2E] shrink-0" />
                      <div>
                        <p className="text-slate-900 text-xs font-semibold">Garantie officielle</p>
                        <p className="text-slate-500 text-xs">{product.warranty_months ? `${product.warranty_months} mois` : "constructeur"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                      <Package className="w-5 h-5 text-[#2E8B2E] shrink-0" />
                      <div>
                        <p className="text-slate-900 text-xs font-semibold">SKU</p>
                        <p className="text-slate-500 text-xs font-mono">{product.sku}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Fiche technique ── */}
              {(product.model_number || product.subcategory || product.weight_kg || product.warranty_months || product.brand) && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-[#1A2E1A]">
                    <h2 className="text-white font-bold text-base flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#F5C800]" />
                      Fiche technique
                    </h2>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {[
                      { label: "Marque", value: product.brand, icon: Tag },
                      { label: "Référence / Modèle", value: product.model_number, icon: Cpu },
                      { label: "État", value: product.condition ? (CONDITION_MAP[product.condition]?.label + " — " + CONDITION_MAP[product.condition]?.sub) : null, icon: Sparkles },
                      { label: "Catégorie", value: product.subcategory?.replace(/_/g, " "), icon: Package },
                      { label: "Garantie", value: product.warranty_months ? `${product.warranty_months} mois` : null, icon: Shield },
                      { label: "Poids", value: product.weight_kg ? `${product.weight_kg} kg` : null, icon: Weight },
                      { label: "SKU", value: product.sku || null, icon: Package },
                    ]
                      .filter(row => row.value)
                      .map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-center px-6 py-3.5 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-2 w-40 shrink-0">
                            <Icon className="w-3.5 h-3.5 text-[#2E8B2E]" />
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
                          </div>
                          <span className="text-sm text-slate-800 font-medium capitalize">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ── Related products ── */}
              {relatedProducts.length > 0 && (
                <div>
                  <h2 className="text-xl font-black text-slate-800 mb-5">Produits similaires</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {relatedProducts.map(p => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Image lightbox ── */}
      {lightboxOpen && product && (() => {
        const allImgs = (product.image_urls && product.image_urls.length > 0)
          ? product.image_urls
          : product.image_url ? [product.image_url] : [];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            {allImgs.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + allImgs.length) % allImgs.length); }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImgs[activeImg]}
              alt={product.name_fr ?? product.name}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={e => e.stopPropagation()}
            />

            {allImgs.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % allImgs.length); }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {allImgs.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImgs.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setActiveImg(i); }}
                    className={`w-2 h-2 rounded-full transition-colors ${i === activeImg ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Sticky mobile bottom CTA bar */}
      {product && !loading && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 pt-3 pb-safe pb-4 flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock_available === 0}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all text-sm ${
              product.stock_available === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : added
                ? "bg-green-600 text-white"
                : "bg-[#2E8B2E] hover:bg-[#236B23] text-white"
            }`}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            {added ? "Ajouté ✓" : product.stock_available === 0 ? "Rupture" : "Ajouter au panier"}
          </button>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border border-[#2E8B2E] text-[#2E8B2E] hover:bg-green-50 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      )}

      <Footer />
    </>
  );
}
