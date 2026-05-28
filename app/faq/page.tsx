"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQS = [
  {
    category: "Livraison",
    items: [
      {
        q: "Livrez-vous dans toutes les villes du Cameroun ?",
        a: "Nous livrons principalement à Douala et Yaoundé. Pour les autres villes, contactez-nous via WhatsApp pour convenir des modalités.",
      },
      {
        q: "Quel est le délai de livraison ?",
        a: "La livraison à Douala et Yaoundé se fait généralement en 24 à 48h après confirmation de commande. Les délais peuvent varier selon les stocks.",
      },
      {
        q: "La livraison est-elle payante ?",
        a: "Les frais de livraison dépendent de votre localisation et du poids de la commande. Contactez-nous pour un devis précis.",
      },
    ],
  },
  {
    category: "Paiement",
    items: [
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons le paiement Mobile Money (MTN MoMo, Orange Money), le virement bancaire, et le paiement cash à la livraison pour certaines zones.",
      },
      {
        q: "Peut-on payer en plusieurs fois ?",
        a: "Oui, le paiement en plusieurs fois est possible pour certains produits. Contactez-nous sur WhatsApp pour en discuter.",
      },
    ],
  },
  {
    category: "Garantie & SAV",
    items: [
      {
        q: "Tous vos produits sont-ils garantis ?",
        a: "Oui, tous nos produits neufs bénéficient d'une garantie constructeur (durée indiquée sur la fiche produit). Les produits d'occasion ont une garantie TEHTEK de 3 mois.",
      },
      {
        q: "Que faire si mon produit tombe en panne ?",
        a: "Contactez notre service après-vente via WhatsApp (+237 690 768 890) ou par email. Nous prendrons en charge le produit sous garantie.",
      },
      {
        q: "Peut-on retourner un produit ?",
        a: "Les retours sont acceptés dans les 48h après réception si le produit est défectueux ou ne correspond pas à la description. Le produit doit être dans son emballage d'origine.",
      },
    ],
  },
  {
    category: "Produits",
    items: [
      {
        q: "Vos produits sont-ils originaux ?",
        a: "Oui, tous nos produits neufs sont 100 % originaux avec garantie constructeur. Les produits d'occasion et reconditionnés sont clairement identifiés.",
      },
      {
        q: "Puis-je commander un produit qui n'est pas en stock ?",
        a: "Oui, via notre service cargo. Contactez-nous sur WhatsApp et nous pouvons commander le produit depuis l'étranger pour vous.",
      },
      {
        q: "Comment différencier les grades des produits d'occasion ?",
        a: "Grade A = comme neuf (aucune trace d'utilisation visible). Grade B = bon état (légères traces d'utilisation). Grade C = état correct (traces visibles mais fonctionnel). Reconditionné = remis à neuf par un technicien.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="text-sm text-slate-600 leading-relaxed pb-4">{a}</p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-black text-slate-800 mb-2">Questions fréquentes</h1>
          <p className="text-slate-500 mb-10">Tout ce que vous devez savoir pour commander chez TEHTEK.</p>

          <div className="space-y-8">
            {FAQS.map(section => (
              <div key={section.category} className="bg-white rounded-2xl border border-slate-200 px-6 overflow-hidden">
                <h2 className="text-[#2E8B2E] font-bold text-xs uppercase tracking-widest pt-5 pb-1">
                  {section.category}
                </h2>
                {section.items.map(item => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[#1A2E1A] rounded-2xl p-6 text-center">
            <p className="text-white font-semibold mb-2">Vous n&apos;avez pas trouvé votre réponse ?</p>
            <p className="text-green-200/70 text-sm mb-4">Notre équipe répond en moins de 15 minutes en heures ouvrables.</p>
            <a
              href="https://wa.me/237690768890?text=Bonjour%20TEHTEK%2C%20j%27ai%20une%20question"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2E8B2E] hover:bg-[#236B23] text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contacter sur WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
