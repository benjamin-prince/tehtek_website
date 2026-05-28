"use client";
import Link from "next/link";
import { ArrowRight, Shield, Truck, Clock, CheckCircle } from "lucide-react";

const QUICK_LINKS = [
  { label: "Téléphones",  href: "/produits?cat=electronics",        emoji: "📱" },
  { label: "Ordinateurs", href: "/produits?cat=it_equipment",       emoji: "💻" },
  { label: "Imprimantes", href: "/produits?cat=printer",            emoji: "🖨️" },
  { label: "Réseau",      href: "/produits?cat=network_equipment",  emoji: "📡" },
  { label: "Sécurité",    href: "/produits?cat=security_equipment", emoji: "🔒" },
  { label: "Solaire",     href: "/produits?cat=solar_equipment",    emoji: "☀️" },
  { label: "Stockage",    href: "/produits?cat=storage",            emoji: "💾" },
  { label: "TV & Audio",  href: "/produits?cat=tv_av",              emoji: "📺" },
  { label: "Accessoires", href: "/produits?cat=accessories",        emoji: "🎧" },
];

export default function Hero() {
  return (
    <>
      {/* Main hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1A2E1A 0%, #1E3A1E 50%, #0F1F0F 100%)" }}>
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Yellow accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5C800]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 border border-[#F5C800]/40 bg-[#F5C800]/10 text-[#F5C800] text-xs font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-[#F5C800] animate-pulse" />
                Importateur officiel certifié · Cameroun
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
                L&apos;équipement tech<br />
                <span className="text-[#F5C800]">qu&apos;il vous faut,</span><br />
                livré chez vous.
              </h1>

              <p className="text-green-100 text-lg leading-relaxed mb-8 max-w-lg">
                Téléphones, ordinateurs, sécurité, solaire — produits authentiques
                avec garantie officielle. Commandez en 30 secondes via WhatsApp.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <a
                  href="https://wa.me/237690768890?text=Bonjour%20TEHTEK%2C%20je%20voudrais%20passer%20une%20commande"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#2E8B2E] hover:bg-[#3AA03A] text-white font-bold px-7 py-3.5 rounded-full transition-colors shadow-lg text-base"
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Commander via WhatsApp
                </a>
                <Link
                  href="/produits"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-base"
                >
                  Voir le catalogue <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap gap-5">
                {[
                  { icon: Shield,      text: "Garantie officielle" },
                  { icon: Truck,       text: "Livraison 24-48h" },
                  { icon: Clock,       text: "Réponse en 15 min" },
                  { icon: CheckCircle, text: "Agréé & certifié" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-green-200">
                    <Icon className="w-4 h-4 text-[#F5C800] shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — category grid */}
            <div>
              <p className="text-xs font-bold text-[#F5C800] uppercase tracking-widest mb-4">
                Parcourir par catégorie
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {QUICK_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-[#F5C800]/40 transition-all group"
                  >
                    <span className="text-2xl">{l.emoji}</span>
                    <span className="text-xs font-semibold text-white/80 group-hover:text-white text-center leading-tight">
                      {l.label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Stats bar */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { n: "500+",  label: "Produits" },
                  { n: "24h",   label: "Livraison" },
                  { n: "5 ans", label: "Expérience" },
                ].map(({ n, label }) => (
                  <div key={label} className="text-center bg-white/8 rounded-xl py-3 border border-[#F5C800]/20">
                    <p className="text-2xl font-black text-[#F5C800]">{n}</p>
                    <p className="text-green-200 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brands strip */}
      <div className="bg-slate-50 border-b border-slate-200 py-4 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0">
            Nos marques
          </span>
          <div className="w-px h-4 bg-slate-300 shrink-0" />
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {[
              "Samsung","Apple","HP","Lenovo","Huawei","Hikvision",
              "Dahua","Eaton","Xiaomi","Epson","Canon","TP-Link",
              "Ubiquiti","Mikrotik","Dell","Asus",
            ].map((brand) => (
              <Link
                key={brand}
                href={`/produits?q=${encodeURIComponent(brand)}`}
                className="text-sm font-bold text-slate-500 hover:text-[#2E8B2E] whitespace-nowrap transition-colors"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
