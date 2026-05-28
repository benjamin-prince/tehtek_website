import Link from "next/link";

const BRANDS = [
  { name: "Samsung",   emoji: "📱" },
  { name: "Apple",     emoji: "🍎" },
  { name: "HP",        emoji: "💻" },
  { name: "Lenovo",    emoji: "💻" },
  { name: "Dell",      emoji: "🖥️" },
  { name: "Asus",      emoji: "💻" },
  { name: "Huawei",    emoji: "📱" },
  { name: "Xiaomi",    emoji: "📱" },
  { name: "Hikvision", emoji: "📷" },
  { name: "Dahua",     emoji: "📷" },
  { name: "Epson",     emoji: "🖨️" },
  { name: "Canon",     emoji: "📠" },
  { name: "TP-Link",   emoji: "🌐" },
  { name: "Eaton",     emoji: "🔋" },
];

export default function BrandsSection() {
  return (
    <section className="bg-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-slate-800">Nos marques partenaires</h2>
          <Link href="/produits" className="text-[#2E8B2E] hover:underline text-sm font-semibold">
            Tous les produits →
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {BRANDS.map(b => (
            <Link
              key={b.name}
              href={`/marques/${encodeURIComponent(b.name.toLowerCase())}`}
              className="flex items-center gap-2 bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-[#2E8B2E] text-slate-700 hover:text-[#2E8B2E] text-sm font-semibold px-4 py-2 rounded-full transition-all"
            >
              <span>{b.emoji}</span>
              {b.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
