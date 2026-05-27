"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

interface Category {
  key: string;
  label_fr: string;
  icon: string | null;
  description_fr: string | null;
  count: number;
}

export default function Categories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/shop/categories`)
      .then(r => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setCats(data as Category[]);
      })
      .catch(() => setCats([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex justify-center py-8">
          <Loader2 className="w-7 h-7 text-[#2E8B2E] animate-spin" />
        </div>
      </section>
    );
  }

  if (cats.length === 0) return null;

  return (
    <section className="bg-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Toutes nos catégories</h2>
            <p className="text-slate-500 text-sm mt-1">
              De l&apos;électronique grand public aux équipements professionnels
            </p>
          </div>
          <Link href="/produits" className="text-[#2E8B2E] text-sm font-semibold hover:underline">
            Voir tout →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {cats.map((cat) => (
            <Link
              key={cat.key}
              href={`/produits?cat=${cat.key}`}
              className="flex flex-col items-center text-center p-4 rounded-2xl border-2 border-green-200 bg-green-50 hover:border-[#2E8B2E] transition-all group"
            >
              {cat.icon && <span className="text-3xl mb-2">{cat.icon}</span>}
              <span className="text-xs font-semibold text-slate-700 group-hover:text-[#2E8B2E] leading-tight">
                {cat.label_fr}
              </span>
              {cat.count > 0 && (
                <span className="mt-1 text-[10px] text-slate-400">{cat.count} produit{cat.count > 1 ? "s" : ""}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
