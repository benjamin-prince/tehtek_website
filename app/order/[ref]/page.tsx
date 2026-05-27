"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2, Clock, XCircle, Truck, ShoppingBag,
  Package, ArrowRight, Loader2, Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { clearCart } from "@/lib/cart";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

function fmt(n: number) {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
}

interface OrderData {
  order_ref:      string;
  status:         string;
  payment_status: string;
  payment_method: string;
  subtotal:       number;
  customer_name:  string;
  customer_city:  string | null;
  items:          { id: number; name: string; qty: number; unit_price: number; line_total: number }[];
  created_at:     string;
}

const METHOD_LABELS: Record<string, string> = {
  fapshi: "Carte / Orange Money / MTN MoMo",
  paypal: "PayPal",
  cod:    "Paiement à la livraison",
};

const PAYMENT_STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string; bg: string }> = {
  paid:        { icon: CheckCircle2, color: "text-[#2E8B2E]", label: "Paiement confirmé",          bg: "bg-green-50 border-green-200" },
  cod_pending: { icon: Truck,        color: "text-blue-600",   label: "Paiement à la livraison",    bg: "bg-blue-50 border-blue-200"  },
  pending:     { icon: Clock,        color: "text-amber-600",  label: "En attente de paiement",      bg: "bg-amber-50 border-amber-200"},
  failed:      { icon: XCircle,      color: "text-red-600",    label: "Paiement échoué",             bg: "bg-red-50 border-red-200"    },
  expired:     { icon: XCircle,      color: "text-slate-500",  label: "Paiement expiré",             bg: "bg-slate-50 border-slate-200"},
};

export default function OrderStatusPage() {
  const { ref }         = useParams<{ ref: string }>();
  const searchParams    = useSearchParams();
  const initialStatus   = searchParams.get("status");

  const [order,   setOrder]   = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [polls,   setPolls]   = useState(0);

  const fetchOrder = useCallback(async () => {
    try {
      const r = await fetch(`${API}/shop/orders/${ref}`);
      if (r.status === 404) { setNotFound(true); setLoading(false); return; }
      const d: OrderData = await r.json();
      setOrder(d);
    } catch {
      // keep previous state, retry
    } finally {
      setLoading(false);
    }
  }, [ref]);

  // Initial fetch
  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  // Poll every 4s while payment is pending (up to 30s)
  useEffect(() => {
    if (!order) return;
    if (order.payment_status !== "pending" && order.payment_status !== "processing") return;
    if (polls >= 8) return;
    const t = setTimeout(() => { fetchOrder(); setPolls(p => p + 1); }, 4000);
    return () => clearTimeout(t);
  }, [order, polls, fetchOrder]);

  // Clear cart only when payment is confirmed (handles Fapshi redirect + webhook delay)
  useEffect(() => {
    if (order?.payment_status === "paid") {
      clearCart();
    }
  }, [order?.payment_status]);

  if (loading) {
    return (
      <>
        <Navbar hideSearch />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#2E8B2E] animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <Navbar hideSearch />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Commande introuvable</h2>
            <p className="text-slate-500 text-sm mb-6">La référence {ref} n&apos;existe pas.</p>
            <Link href="/produits" className="bg-[#2E8B2E] text-white px-6 py-2.5 rounded-full font-semibold text-sm">
              Retour aux produits
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const ps = order!.payment_status;
  const cfg = PAYMENT_STATUS_CONFIG[ps] ?? PAYMENT_STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const isPaid  = ps === "paid";
  const isCod   = ps === "cod_pending";
  const isGood  = isPaid || isCod;
  const waMsg   = encodeURIComponent(`Bonjour TEHTEK, je voudrais suivre ma commande ${order!.order_ref}`);

  // If Fapshi redirect came back with status in URL but DB not yet updated (webhook latency)
  const showSuccessHint = initialStatus === "paid" && ps === "pending";

  return (
    <>
      <Navbar hideSearch />
      <main className="min-h-screen bg-slate-50">
        {/* Header banner */}
        <div className={`py-12 px-4 ${isGood ? "bg-[#1A2E1A]" : "bg-slate-700"}`}>
          <div className="max-w-2xl mx-auto text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isGood ? "bg-green-500/20" : "bg-white/10"}`}>
              {isGood
                ? <CheckCircle2 className="w-8 h-8 text-[#F5C800]" />
                : <Icon className={`w-8 h-8 ${cfg.color}`} />
              }
            </div>
            <h1 className="text-2xl font-black text-white mb-1">
              {isPaid  ? "Paiement confirmé !" : isCod ? "Commande enregistrée !" : cfg.label}
            </h1>
            <p className="text-green-200/70 text-sm">
              Référence : <span className="font-mono font-bold text-white">{order!.order_ref}</span>
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

          {/* Pending webhook latency hint */}
          {showSuccessHint && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
              <Loader2 className="w-4 h-4 shrink-0 mt-0.5 animate-spin" />
              Confirmation de paiement en cours de traitement — cette page se mettra à jour automatiquement.
            </div>
          )}

          {/* Status card */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border ${cfg.bg}`}>
            <Icon className={`w-6 h-6 shrink-0 ${cfg.color}`} />
            <div>
              <p className={`font-semibold text-sm ${cfg.color}`}>{cfg.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Via {METHOD_LABELS[order!.payment_method] ?? order!.payment_method}
              </p>
            </div>
          </div>

          {/* COD message */}
          {isCod && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 space-y-1">
              <p className="font-semibold">Comment ça marche ?</p>
              <p>Notre équipe vous contactera pour confirmer la livraison. Vous paierez en espèces à la réception.</p>
            </div>
          )}

          {/* Order items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#1A2E1A] px-5 py-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#F5C800]" />
              <h2 className="text-white font-bold text-sm">Détail de la commande</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {order!.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <Package className="w-4 h-4 text-slate-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400">× {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900 shrink-0">{fmt(item.line_total)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 px-5 py-4 flex items-center justify-between">
              <span className="font-bold text-slate-900">Total</span>
              <span className="text-lg font-black text-[#2E8B2E]">{fmt(order!.subtotal)}</span>
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-sm space-y-2">
            <p className="font-semibold text-slate-900">{order!.customer_name}</p>
            {order!.customer_city && <p className="text-slate-500">{order!.customer_city}</p>}
            <p className="text-xs text-slate-400">
              Commande passée le {new Date(order!.created_at).toLocaleString("fr-FR")}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/237690768890?text=${waMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#2E8B2E] hover:bg-[#236B23] text-white font-bold py-3.5 px-6 rounded-2xl transition-colors flex-1 text-sm"
            >
              <Phone className="w-4 h-4" />
              Suivre sur WhatsApp
            </a>
            <Link
              href="/produits"
              className="flex items-center justify-center gap-2 border border-[#2E8B2E] text-[#2E8B2E] hover:bg-green-50 font-semibold py-3.5 px-6 rounded-2xl transition-colors flex-1 text-sm"
            >
              Continuer les achats <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Failed — retry options */}
          {(ps === "failed" || ps === "expired") && (
            <div className="text-center">
              <Link href="/checkout" className="text-sm text-[#2E8B2E] underline font-semibold">
                Réessayer le paiement
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
