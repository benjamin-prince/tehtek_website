import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const LINKS = {
  shop: [
    { label: "Téléphones & Tablettes", href: "/produits?cat=electronics" },
    { label: "Informatique", href: "/produits?cat=it_equipment" },
    { label: "Solaire & Énergie", href: "/produits?cat=solar_equipment" },
    { label: "Sécurité", href: "/produits?cat=security_equipment" },
    { label: "Produits d'occasion", href: "/occasion" },
    { label: "Mes favoris", href: "/wishlist" },
  ],
  company: [
    { label: "À propos", href: "/a-propos" },
    { label: "Cargo & Expédition", href: "/cargo" },
    { label: "Infrastructures", href: "/services" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
};

const SOCIALS = [
  {
    name: "Facebook",
    href: "https://facebook.com/tehtek",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/tehtek",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@tehtek",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@tehtek",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <>
      {/* ── Main footer ── */}
      <footer className="border-t border-[#2E8B2E]/20 bg-[#1A2E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">

            {/* Contact — full width on mobile, col 1 on desktop */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[#F5C800] font-semibold text-sm uppercase tracking-widest mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-green-200/70">
                <a href="tel:+237690768890" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-[#F5C800]" />
                  +237 690 76 88 90
                </a>
                <a href="mailto:info@tehtek.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-[#F5C800]" />
                  info@tehtek.com
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#F5C800]" />
                  Douala &amp; Yaoundé, Cameroun
                </span>
              </div>
            </div>

            {/* Shop links */}
            <div>
              <h4 className="text-[#F5C800] font-semibold text-sm uppercase tracking-widest mb-4">Boutique</h4>
              <ul className="space-y-2">
                {LINKS.shop.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-green-200/70 hover:text-white text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className="text-[#F5C800] font-semibold text-sm uppercase tracking-widest mb-4">Entreprise</h4>
              <ul className="space-y-2">
                {LINKS.company.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-green-200/70 hover:text-white text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* WhatsApp — full width on mobile, col 4 on desktop */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[#F5C800] font-semibold text-sm uppercase tracking-widest mb-4">Commander</h4>
              <p className="text-green-200/70 text-sm mb-4">
                La façon la plus rapide de passer commande : WhatsApp.
                Réponse garantie sous 15 minutes en heures ouvrables.
              </p>
              <a
                href="https://wa.me/237690768890?text=Bonjour%20TEHTEK%2C%20je%20voudrais%20passer%20une%20commande"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#2E8B2E] hover:bg-[#236B23] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* ── About + Social + App download strip ── */}
      <div className="bg-[#0d1a0d] border-t border-[#2E8B2E]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* About TEHTEK */}
          <div className="mb-8 max-w-3xl">
            <h3 className="text-[#F5C800] font-black text-lg mb-3">Bienvenue chez TEHTEK — Votre boutique tech au Cameroun</h3>
            <p className="text-green-200/60 text-sm leading-relaxed">
              TEHTEK est votre partenaire technologique de confiance au Cameroun, 100 % camerounais.
              Notre mission : explorer le marché national et international pour rassembler des produits de qualité
              répondant aux besoins quotidiens de la population camerounaise. Nous proposons des appareils
              de marques réputées — Samsung, Apple, HP, Lenovo, Huawei, Hikvision, TP-Link, Epson et bien d&apos;autres —
              avec garantie officielle, service après-vente local et livraison à Douala &amp; Yaoundé.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">

            {/* Follow us */}
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Suivez-nous sur</p>
              <div className="flex items-center gap-3">
                {SOCIALS.map(s => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    title={s.name}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-[#2E8B2E]/30 text-green-200/50 hover:border-[#F5C800] hover:text-[#F5C800] transition-colors">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Download app */}
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Téléchargez notre application</p>
              <div className="flex items-center gap-3">
                {/* Google Play */}
                <a href="#" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F5C800]/40 rounded-xl px-3 py-2 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/70 shrink-0">
                    <path d="M3.18 23.76c.37.2.8.22 1.21.04l12.29-6.87-2.65-2.65-10.85 9.48zM.5 1.56C.19 1.96 0 2.5 0 3.14v17.72c0 .64.19 1.18.5 1.58l.08.08 9.92-9.92v-.23L.58 1.48.5 1.56zM20.23 10.3l-2.64-1.48-2.96 2.96 2.96 2.96 2.65-1.48c.76-.43.76-1.53-.01-1.96zM4.39.2L16.68 7.07l-2.65 2.65L3.18.24C3.6.06 4.02.08 4.39.2z"/>
                  </svg>
                  <div>
                    <p className="text-white/30 text-[9px] leading-none">Disponible sur</p>
                    <p className="text-white font-bold text-xs leading-tight">Google Play</p>
                  </div>
                </a>

                {/* App Store */}
                <a href="#" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F5C800]/40 rounded-xl px-3 py-2 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/70 shrink-0">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <p className="text-white/30 text-[9px] leading-none">Télécharger sur</p>
                    <p className="text-white font-bold text-xs leading-tight">App Store</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#2E8B2E]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-green-200/40">
            <span>© {new Date().getFullYear()} TEHTEK. Tous droits réservés.</span>
            <span>Made with ♥ in Cameroun</span>
          </div>
        </div>
      </div>
    </>
  );
}
