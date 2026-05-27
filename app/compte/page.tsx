"use client";
import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User, Package, LogOut, Save, ChevronRight,
  Phone, MapPin, Mail, AlertCircle, CheckCircle2,
} from "lucide-react";
import {
  getProfile, fetchMe, updateMe, fetchMyOrders, logoutCustomer,
  ShopCustomer, ShopOrder, isLoggedIn,
} from "@/lib/shopAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Tab = "commandes" | "profil";

const STATUS_LABEL: Record<string, string> = {
  pending:    "En attente",
  confirmed:  "Confirmée",
  processing: "En préparation",
  shipped:    "Expédiée",
  delivered:  "Livrée",
  cancelled:  "Annulée",
};

const STATUS_COLOR: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  confirmed:  "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped:    "bg-indigo-100 text-indigo-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

const PAY_LABEL: Record<string, string> = {
  paid:        "Payée",
  pending:     "En attente",
  cod_pending: "Paiement à la livraison",
  failed:      "Échouée",
  expired:     "Expirée",
  cancelled:   "Annulée",
};

function ComptePage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const initialTab   = (searchParams.get("tab") === "profil" ? "profil" : "commandes") as Tab;
  const [tab,      setTab]      = useState<Tab>(initialTab);
  const [customer, setCustomer] = useState<ShopCustomer | null>(null);
  const [orders,   setOrders]   = useState<ShopOrder[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [saveErr,  setSaveErr]  = useState("");
  const [form,     setForm]     = useState<Partial<ShopCustomer>>({});

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/connexion"); return; }

    // Load cached profile instantly, then refresh from API
    const cached = getProfile();
    if (cached) { setCustomer(cached); setForm(cached); }

    Promise.all([fetchMe(), fetchMyOrders()])
      .then(([me, ords]) => {
        setCustomer(me);
        setForm(me);
        setOrders(ords);
      })
      .catch(() => { if (!cached) router.replace("/connexion"); })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await logoutCustomer();
    router.push("/");
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true); setSaved(false); setSaveErr("");
    try {
      const updated = await updateMe({
        first_name: form.first_name,
        last_name:  form.last_name,
        phone:      form.phone ?? undefined,
        whatsapp:   form.whatsapp ?? undefined,
        address:    form.address ?? undefined,
        city:       form.city ?? undefined,
      });
      setCustomer(updated);
      setForm(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setSaveErr(err instanceof Error ? err.message : "Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !customer) {
    return (
      <>
        <Navbar hideSearch />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#2E8B2E] border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar hideSearch />
      <main className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-[#1A2E1A] py-10 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm mb-0.5">Espace client</p>
              <h1 className="text-2xl font-black text-white">
                Bonjour, {customer?.first_name} 👋
              </h1>
              <p className="text-green-200/70 text-sm mt-0.5">{customer?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-8 w-fit">
            <button
              onClick={() => setTab("commandes")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                tab === "commandes"
                  ? "bg-[#2E8B2E] text-white"
                  : "text-slate-600 hover:text-[#2E8B2E]"
              }`}
            >
              <Package className="w-4 h-4" /> Mes commandes
            </button>
            <button
              onClick={() => setTab("profil")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                tab === "profil"
                  ? "bg-[#2E8B2E] text-white"
                  : "text-slate-600 hover:text-[#2E8B2E]"
              }`}
            >
              <User className="w-4 h-4" /> Mon profil
            </button>
          </div>

          {/* ── COMMANDES ───────────────────────────────────────────────── */}
          {tab === "commandes" && (
            <div>
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-semibold">Aucune commande</p>
                  <p className="text-slate-400 text-sm mt-1 mb-6">
                    Vos commandes passées avec cet email apparaîtront ici.
                  </p>
                  <a
                    href="/produits"
                    className="inline-flex items-center gap-2 bg-[#2E8B2E] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#236B23] transition-colors"
                  >
                    Découvrir nos produits <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(o => (
                    <div key={o.order_ref} className="bg-white rounded-2xl border border-slate-200 p-5">
                      {/* Order header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="font-bold text-slate-900">{o.order_ref}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(o.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric", month: "long", year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[o.status] ?? "bg-slate-100 text-slate-600"}`}>
                            {STATUS_LABEL[o.status] ?? o.status}
                          </span>
                          <span className="text-xs text-slate-500">
                            Paiement : {PAY_LABEL[o.payment_status] ?? o.payment_status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 mb-4">
                        {o.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm text-slate-700">
                            <span className="truncate mr-4">{item.name} × {item.qty}</span>
                            <span className="shrink-0 font-semibold">
                              {(item.line_total ?? item.unit_price * item.qty).toLocaleString("fr-FR")} XAF
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                        <span className="text-sm text-slate-500">Total</span>
                        <span className="font-black text-slate-900">
                          {o.subtotal.toLocaleString("fr-FR")} XAF
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PROFIL ──────────────────────────────────────────────────── */}
          {tab === "profil" && (
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg mb-2">Mes informations</h2>

              {saved && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4" /> Profil mis à jour avec succès
                </div>
              )}
              {saveErr && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4" /> {saveErr}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prénom</label>
                  <input
                    type="text" value={form.first_name ?? ""} required
                    onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom</label>
                  <input
                    type="text" value={form.last_name ?? ""} required
                    onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                  />
                </div>
              </div>

              {/* Email — read only */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <Mail className="inline w-3.5 h-3.5 mr-1" />Email
                </label>
                <input
                  type="email" value={customer?.email ?? ""} disabled
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <Phone className="inline w-3.5 h-3.5 mr-1" />Téléphone
                  </label>
                  <input
                    type="tel" value={form.phone ?? ""}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp</label>
                  <input
                    type="tel" value={form.whatsapp ?? ""}
                    onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <MapPin className="inline w-3.5 h-3.5 mr-1" />Ville
                </label>
                <input
                  type="text" value={form.city ?? ""}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="Yaoundé, Douala…"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Adresse de livraison</label>
                <input
                  type="text" value={form.address ?? ""}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Quartier, rue, immeuble…"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit" disabled={saving}
                  className="flex items-center gap-2 bg-[#2E8B2E] hover:bg-[#236B23] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Sauvegarde…" : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ComptePageWrapper() {
  return (
    <Suspense>
      <ComptePage />
    </Suspense>
  );
}
