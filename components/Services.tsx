import { Truck, ShieldCheck, Headphones, RefreshCw, CreditCard, Award } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Livraison rapide",
    desc: "24-48h à Douala et Yaoundé. Expédition nationale disponible.",
    color: "text-[#2E8B2E]",
    bg: "bg-green-50",
    border: "border-green-100",
    iconBg: "bg-green-100",
  },
  {
    icon: ShieldCheck,
    title: "Garantie officielle",
    desc: "Tous nos produits sont authentiques avec garantie constructeur.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    iconBg: "bg-emerald-100",
  },
  {
    icon: Headphones,
    title: "Support local",
    desc: "Équipe basée à Douala. Réponse WhatsApp en 15 minutes.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    iconBg: "bg-violet-100",
  },
  {
    icon: RefreshCw,
    title: "Retours faciles",
    desc: "Produit défectueux ? Nous vous remboursons ou échangeons.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    iconBg: "bg-amber-100",
  },
  {
    icon: CreditCard,
    title: "Paiement flexible",
    desc: "MTN Money, Orange Money, espèces, virement bancaire.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
    iconBg: "bg-rose-100",
  },
  {
    icon: Award,
    title: "Certifié & agréé",
    desc: "Importateur officiel avec agrément douanier et fiscal.",
    color: "text-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-100",
    iconBg: "bg-slate-100",
  },
];

export default function Services() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Pourquoi choisir TEHTEK ?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Bien plus qu&apos;une boutique — un partenaire technologique de confiance au Cameroun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map(({ icon: Icon, title, desc, color, bg, border, iconBg }) => (
            <div
              key={title}
              className={`rounded-2xl border p-6 flex items-start gap-4 ${bg} ${border}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-sm mb-1">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
