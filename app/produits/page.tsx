"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, Loader2, ChevronDown, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { ShopProduct } from "@/components/ProductCard";
import { FALLBACK_CATEGORIES, ShopCategory } from "@/lib/categories";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

const TOP_BRANDS = [
  "Samsung","Apple","HP","Lenovo","Dell","Asus","Huawei","Xiaomi",
  "Hikvision","Dahua","Epson","Canon","TP-Link","Eaton","Ubiquiti","Mikrotik",
];

const SORT_OPTIONS = [
  { value: "",           label: "Pertinence" },
  { value: "price_asc",  label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "discount",   label: "Meilleures promos" },
  { value: "featured",   label: "Vedettes d'abord" },
];

const CONDITION_OPTIONS = [
  { value: "",            label: "Tous les états" },
  { value: "new",         label: "Neuf" },
  { value: "used",        label: "Occasion (A/B/C)" },
  { value: "refurbished", label: "Reconditionné" },
];

interface ProductsResponse {
  items: ShopProduct[];
  total: number;
  page: number;
  pages: number;
}

function applyClientFilters(
  items: ShopProduct[],
  { sort, brand, condition, minPrice, maxPrice }: {
    sort: string; brand: string; condition: string;
    minPrice: number | null; maxPrice: number | null;
  }
): ShopProduct[] {
  let out = [...items];
  if (brand)     out = out.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
  if (condition === "new")         out = out.filter(p => p.condition === "new");
  if (condition === "used")        out = out.filter(p => ["used_a","used_b","used_c"].includes(p.condition));
  if (condition === "refurbished") out = out.filter(p => p.condition === "refurbished");
  if (minPrice != null) out = out.filter(p => (p.sell_price ?? 0) >= minPrice);
  if (maxPrice != null) out = out.filter(p => (p.sell_price ?? 0) <= maxPrice);
  if (sort === "price_asc")  out.sort((a, b) => (a.sell_price ?? Infinity) - (b.sell_price ?? Infinity));
  if (sort === "price_desc") out.sort((a, b) => (b.sell_price ?? 0) - (a.sell_price ?? 0));
  if (sort === "discount")   out.sort((a, b) => {
    const pA = a.compare_price && a.sell_price ? (a.compare_price - a.sell_price) / a.compare_price : 0;
    const pB = b.compare_price && b.sell_price ? (b.compare_price - b.sell_price) / b.compare_price : 0;
    return pB - pA;
  });
  if (sort === "featured") out.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  return out;
}

function ProduitsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [rawProducts, setRawProducts] = useState<ShopProduct[]>([]);
  const [total,       setTotal]       = useState(0);
  const [pages,       setPages]       = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [categories,  setCategories]  = useState<ShopCategory[]>(FALLBACK_CATEGORIES);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    fetch(`${API}/shop/categories`)
      .then(r => r.json())
      .then((d: unknown) => { if (Array.isArray(d) && d.length > 0) setCategories(d as ShopCategory[]); })
      .catch(() => {});
  }, []);

  const cat       = searchParams.get("cat")       ?? "";
  const q         = searchParams.get("q")         ?? "";
  const page      = parseInt(searchParams.get("page") ?? "1", 10);
  const sort      = searchParams.get("sort")      ?? "";
  const brand     = searchParams.get("brand")     ?? "";
  const condition = searchParams.get("condition") ?? "";
  const minPrice  = searchParams.get("min_price") ? parseInt(searchParams.get("min_price")!, 10) : null;
  const maxPrice  = searchParams.get("max_price") ? parseInt(searchParams.get("max_price")!, 10) : null;

  const [search,   setSearch]   = useState(q);
  const [minInput, setMinInput] = useState(searchParams.get("min_price") ?? "");
  const [maxInput, setMaxInput] = useState(searchParams.get("max_price") ?? "");

  const updateParam = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      params.delete("page");
      router.push(`/produits?${params.toString()}`);
    },
    [searchParams, router]
  );

  const updateParamRef = useRef(updateParam);
  useEffect(() => { updateParamRef.current = updateParam; }, [updateParam]);

  useEffect(() => {
    const timer = setTimeout(() => updateParamRef.current({ q: search }), 400);
    return () => clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cat)   params.set("category", cat);
    if (q)     params.set("search", q);
    if (brand) params.set("brand", brand);
    if (condition) params.set("condition", condition);
    params.set("page",     String(page));
    params.set("per_page", "48");

    fetch(`${API}/shop/products?${params.toString()}`)
      .then(r => r.json())
      .then((data: ProductsResponse) => {
        setRawProducts(data.items ?? []);
        setTotal(data.total ?? 0);
        setPages(data.pages ?? 1);
      })
      .catch(() => setRawProducts([]))
      .finally(() => setLoading(false));
  }, [cat, q, page, brand, condition]);

  const products = applyClientFilters(rawProducts, { sort, brand, condition, minPrice, maxPrice });

  const activeCategory = categories.find(c => c.key === cat);
  const activeFiltersCount = [brand, condition, minPrice, maxPrice, sort].filter(Boolean).length;

  const FilterPanel = ({ mobile }: { mobile?: boolean }) => (
    <div className={mobile ? "space-y-6" : "space-y-6 sticky top-6"}>
      {/* Categories */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" /> Catégories
        </p>
        <ul className="space-y-1">
          <li>
            <button onClick={() => updateParam({ cat: "" })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!cat ? "bg-[#2E8B2E] text-white font-semibold" : "text-slate-600 hover:text-[#2E8B2E] hover:bg-green-50"}`}>
              Toutes les catégories
            </button>
          </li>
          {categories.map(c => (
            <li key={c.key}>
              <button onClick={() => updateParam({ cat: c.key })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${cat === c.key ? "bg-[#2E8B2E] text-white font-semibold" : "text-slate-600 hover:text-[#2E8B2E] hover:bg-green-50"}`}>
                <span className="mr-2">{c.icon}</span>{c.label_fr}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-slate-100" />

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3" /> Trier par
        </p>
        <div className="space-y-1">
          {SORT_OPTIONS.map(o => (
            <button key={o.value} onClick={() => updateParam({ sort: o.value })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sort === o.value ? "bg-[#2E8B2E] text-white font-semibold" : "text-slate-600 hover:text-[#2E8B2E] hover:bg-green-50"}`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Condition */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">État</p>
        <div className="space-y-1">
          {CONDITION_OPTIONS.map(o => (
            <button key={o.value} onClick={() => updateParam({ condition: o.value })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${condition === o.value ? "bg-[#2E8B2E] text-white font-semibold" : "text-slate-600 hover:text-[#2E8B2E] hover:bg-green-50"}`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Price range */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Prix (XAF)</p>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="Min" value={minInput}
            onChange={e => setMinInput(e.target.value)}
            onBlur={() => updateParam({ min_price: minInput })}
            onKeyDown={e => e.key === "Enter" && updateParam({ min_price: minInput })}
            className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2E8B2E]" />
          <span className="text-slate-400 text-xs shrink-0">—</span>
          <input type="number" placeholder="Max" value={maxInput}
            onChange={e => setMaxInput(e.target.value)}
            onBlur={() => updateParam({ max_price: maxInput })}
            onKeyDown={e => e.key === "Enter" && updateParam({ max_price: maxInput })}
            className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2E8B2E]" />
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Brand */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Marque</p>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => updateParam({ brand: "" })}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${!brand ? "bg-[#2E8B2E] text-white border-[#2E8B2E]" : "border-slate-300 text-slate-600 hover:border-[#2E8B2E] hover:text-[#2E8B2E]"}`}>
            Toutes
          </button>
          {TOP_BRANDS.map(b => (
            <button key={b} onClick={() => updateParam({ brand: brand === b ? "" : b })}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${brand === b ? "bg-[#2E8B2E] text-white border-[#2E8B2E]" : "border-slate-300 text-slate-600 hover:border-[#2E8B2E] hover:text-[#2E8B2E]"}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <>
          <div className="border-t border-slate-100" />
          <button onClick={() => { setMinInput(""); setMaxInput(""); updateParam({ sort: "", brand: "", condition: "", min_price: "", max_price: "" }); }}
            className="w-full text-xs text-red-500 hover:text-red-700 font-semibold flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            <X className="w-3 h-3" /> Réinitialiser les filtres ({activeFiltersCount})
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      <Navbar hideSearch />
      <main className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-[#1A2E1A] py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-white mb-1">
              {brand ? brand : activeCategory ? activeCategory.label_fr : "Tous nos produits"}
            </h1>
            <p className="text-green-200/70 text-sm">
              {loading ? "Chargement…" : `${products.length} produit${products.length !== 1 ? "s" : ""} affiché${products.length !== 1 ? "s" : ""} · ${total} au total`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterPanel />
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && updateParam({ q: search })}
                  placeholder="Rechercher un produit…"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]" />
                {search && (
                  <button onClick={() => { setSearch(""); updateParam({ q: "" }); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort (desktop quick) */}
              <div className="hidden sm:block relative">
                <select value={sort} onChange={e => updateParam({ sort: e.target.value })}
                  className="appearance-none bg-white border border-slate-300 rounded-xl pl-3 pr-8 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] cursor-pointer">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Mobile filter button */}
              <button onClick={() => setMobileFilters(v => !v)}
                className={`lg:hidden flex items-center gap-1.5 border rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${activeFiltersCount > 0 ? "bg-[#2E8B2E] text-white border-[#2E8B2E]" : "bg-white border-slate-300 text-slate-600"}`}>
                <SlidersHorizontal className="w-4 h-4" />
                Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>

              <button onClick={() => updateParam({ q: search })}
                className="bg-[#2E8B2E] hover:bg-[#236B23] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                OK
              </button>
            </div>

            {/* Mobile filter panel */}
            {mobileFilters && (
              <div className="lg:hidden bg-white border border-slate-200 rounded-2xl p-5 mb-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-slate-800">Filtres & Tri</span>
                  <button onClick={() => setMobileFilters(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
                </div>
                <FilterPanel mobile />
              </div>
            )}

            {/* Mobile category pills */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 lg:hidden scrollbar-hide">
              <button onClick={() => updateParam({ cat: "" })}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!cat ? "bg-[#2E8B2E] text-white" : "bg-white border border-slate-300 text-slate-600"}`}>
                Tout
              </button>
              {categories.map(c => (
                <button key={c.key} onClick={() => updateParam({ cat: c.key })}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${cat === c.key ? "bg-[#2E8B2E] text-white" : "bg-white border border-slate-300 text-slate-600"}`}>
                  {c.icon} {c.label_fr}
                </button>
              ))}
            </div>

            {/* Active filter chips */}
            {(brand || condition || minPrice || maxPrice || sort) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {brand && <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-[#2E8B2E] text-xs font-semibold px-3 py-1 rounded-full">
                  {brand} <button onClick={() => updateParam({ brand: "" })}><X className="w-3 h-3" /></button>
                </span>}
                {condition && <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-[#2E8B2E] text-xs font-semibold px-3 py-1 rounded-full">
                  {CONDITION_OPTIONS.find(o => o.value === condition)?.label} <button onClick={() => updateParam({ condition: "" })}><X className="w-3 h-3" /></button>
                </span>}
                {sort && <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-[#2E8B2E] text-xs font-semibold px-3 py-1 rounded-full">
                  {SORT_OPTIONS.find(o => o.value === sort)?.label} <button onClick={() => updateParam({ sort: "" })}><X className="w-3 h-3" /></button>
                </span>}
                {(minPrice || maxPrice) && <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-[#2E8B2E] text-xs font-semibold px-3 py-1 rounded-full">
                  Prix {minPrice ? `≥${minPrice.toLocaleString()}` : ""}{minPrice && maxPrice ? " – " : ""}{maxPrice ? `≤${maxPrice.toLocaleString()}` : ""} XAF
                  <button onClick={() => { setMinInput(""); setMaxInput(""); updateParam({ min_price: "", max_price: "" }); }}><X className="w-3 h-3" /></button>
                </span>}
              </div>
            )}

            {/* Products grid */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-[#2E8B2E] animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-slate-500 text-lg mb-2">Aucun produit trouvé</p>
                <p className="text-slate-400 text-sm">Essayez une autre catégorie ou modifiez vos filtres.</p>
                {activeFiltersCount > 0 && (
                  <button onClick={() => { setMinInput(""); setMaxInput(""); updateParam({ sort: "", brand: "", condition: "", min_price: "", max_price: "" }); }}
                    className="mt-4 text-[#2E8B2E] hover:underline text-sm font-semibold">
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => updateParam({ page: String(p) })}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${p === page ? "bg-[#2E8B2E] text-white" : "bg-white border border-slate-300 text-slate-600 hover:border-[#2E8B2E] hover:text-[#2E8B2E]"}`}>
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
  return <Suspense><ProduitsInner /></Suspense>;
}
