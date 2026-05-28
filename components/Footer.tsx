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

export default function Footer() {
  return (
    <footer className="border-t border-[#2E8B2E]/20 bg-[#1A2E1A] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="TEHTEK" className="h-9 w-auto" />
            </Link>
            <p className="text-green-200/70 text-sm leading-relaxed mb-6">
              Votre partenaire technologique de confiance au Cameroun. Produits
              certifiés, garantie officielle, service après-vente local.
            </p>
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
                Douala & Yaoundé, Cameroun
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

          {/* WhatsApp */}
          <div>
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

        <div className="mt-12 pt-8 border-t border-[#2E8B2E]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-green-200/40">
          <span>© {new Date().getFullYear()} TEHTEK. Tous droits réservés.</span>
          <span>Made with ♥ in Cameroun</span>
        </div>
      </div>
    </footer>
  );
}
