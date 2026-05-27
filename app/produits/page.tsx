"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { ShopProduct } from "@/components/ProductCard";
import { FALLBACK_CATEGORIES, ShopCategory } from "@/lib/categories";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

interface ProductsResponse {
  items: ShopProduct[];
  total: number;
  page: number;
  pages: number;
}

function ProduitsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products,   setProducts]   = useState<ShopProduct[]>([]);
  const [total,      setTotal]      = useState(0);
  const [pages,      setPages]      = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [categories, setCategories] = useState<ShopCategory[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    fetch(`${API}/shop/categories`)
      .then(r => r.json())
      .then((d: unknown) => { if (Array.isArray(d) && d.length > 0) setCategories(d as ShopCategory[]); })
      .catch(() => {});
  }, []);

  const cat = searchParams.get("cat") ?? "";
  const q = searchParams.get("q") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [search, setSearch] = useState(q);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      if (key !== "page") params.delete("page");
      router.push(`/produits?${params.toString()}`);
    },
    [searchParams, router]
  );

  // keep a fresh ref so the debounce always has the latest updateParam
  const updateParamRef = useRef(updateParam);
  useEffect(() => { updateParamRef.current = updateParam; }, [updateParam]);

  // live search — fire 400 ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParamRef.current("q", search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (q) params.set("search", q);
    params.set("page", String(page));
    params.set("per_page", "24");

    fetch(`${API}/shop/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data: ProductsResponse) => {
        setProducts(data.items ?? []);
        setTotal(data.total ?? 0);
        setPages(data.pages ?? 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [cat, q, page]);

  const activeCategory = categories.find((c) => c.key === cat);

  return (
    <>
      <Navbar hideSearch />
      <main className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-[#1A2E1A] py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-white mb-1">
              {activeCategory ? activeCategory.label_fr : "Tous nos produits"}
            </h1>
            <p className="text-green-200/70 text-sm">
              {loading ? "Chargement…" : `${total} produit${total !== 1 ? "s" : ""} disponible${total !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" /> Catégories
              </p>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => updateParam("cat", "")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !cat
                        ? "bg-[#2E8B2E] text-white font-semibold"
                        : "text-slate-600 hover:text-[#2E8B2E] hover:bg-green-50"
                    }`}
                  >
                    Toutes les catégories
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.key}>
                    <button
                      onClick={() => updateParam("cat", c.key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        cat === c.key
                          ? "bg-[#2E8B2E] text-white font-semibold"
                          : "text-slate-600 hover:text-[#2E8B2E] hover:bg-green-50"
                      }`}
                    >
                      <span className="mr-2">{c.icon}</span>
                      {c.label_fr}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && updateParam("q", search)}
                  placeholder="Rechercher un produit…"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E] transition-colors"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(""); updateParam("q", ""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => updateParam("q", search)}
                className="bg-[#2E8B2E] hover:bg-[#236B23] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Rechercher
              </button>
            </div>

            {/* Mobile category pills */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 lg:hidden scrollbar-hide">
              <button
                onClick={() => updateParam("cat", "")}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  !cat ? "bg-[#2E8B2E] text-white" : "bg-white border border-slate-300 text-slate-600"
                }`}
              >
                Tout
              </button>
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => updateParam("cat", c.key)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    cat === c.key
                      ? "bg-[#2E8B2E] text-white"
                      : "bg-white border border-slate-300 text-slate-600"
                  }`}
                >
                  {c.icon} {c.label_fr}
                </button>
              ))}
            </div>

            {/* Products grid */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-[#2E8B2E] animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-slate-500 text-lg mb-2">Aucun produit trouvé</p>
                <p className="text-slate-400 text-sm">Essayez une autre catégorie ou modifiez votre recherche.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => updateParam("page", String(p))}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                          p === page
                            ? "bg-[#2E8B2E] text-white"
                            : "bg-white border border-slate-300 text-slate-600 hover:border-[#2E8B2E] hover:text-[#2E8B2E]"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProduitsPage() {
  return (
    <Suspense>
      <ProduitsInner />
    </Suspense>
  );
}
