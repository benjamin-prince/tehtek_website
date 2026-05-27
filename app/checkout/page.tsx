"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ShoppingBag, User, Phone, Mail, MapPin,
  CreditCard, Truck, Loader2, CheckCircle, AlertCircle,
  ChevronRight, Package,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCart, clearCart, cartTotal, CartItem } from "@/lib/cart";
import { getProfile, isLoggedIn } from "@/lib/shopAuth";

const API    = process.env.NEXT_PUBLIC_API_URL    ?? "https://api2.tehtek.com/api/v1";
const PP_ID  = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
const USD_RATE = Number(process.env.NEXT_PUBLIC_XAF_TO_USD_RATE ?? "620");

function fmt(n: number) {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paypal?: any;
  }
}

/* ──────────────────────────────────────────────────────── */

type PaymentMethod = "fapshi" | "paypal" | "cod";

interface FormState {
  name:    string;
  phone:   string;
  email:   string;
  city:    string;
  address: string;
  notes:   string;
}

/* ──────────────────────────────────────────────────────── */

function CheckoutInner() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "", phone: "", email: "", city: "", address: "", notes: "",
  });
  const [method, setMethod] = useState<PaymentMethod>("fapshi");
  const [codStatus, setCodStatus] = useState<"idle" | "checking" | "eligible" | "ineligible">("idle");
  const [codName, setCodName]     = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalRendered     = useRef(false);

  useEffect(() => {
    setItems(getCart());
    if (isLoggedIn()) {
      const profile = getProfile();
      if (profile) {
        setForm(f => ({
          ...f,
          name:    f.name    || `${profile.first_name} ${profile.last_name}`.trim(),
          phone:   f.phone   || profile.phone   || "",
          email:   f.email   || profile.email   || "",
          city:    f.city    || profile.city    || "",
          address: f.address || profile.address || "",
        }));
      }
    }
  }, []);

  const total = cartTotal(items);

  /* ── Field helpers ──────────────────────────────────── */
  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  /* ── COD eligibility check (debounced on phone change) ─ */
  const checkCod = useCallback(async (phone: string) => {
    if (!phone || phone.length < 8) { setCodStatus("idle"); return; }
    setCodStatus("checking");
    try {
      const r = await fetch(`${API}/shop/cod-eligible?phone=${encodeURIComponent(phone)}`);
      const d = await r.json();
      if (d.eligible) { setCodStatus("eligible"); setCodName(d.name); }
      else              { setCodStatus("ineligible"); setCodName(null); }
    } catch {
      setCodStatus("idle");
    }
  }, []);

  useEffect(() => {
    if (method !== "cod") return;
    const t = setTimeout(() => checkCod(form.phone), 600);
    return () => clearTimeout(t);
  }, [form.phone, method, checkCod]);

  /* ── Load PayPal SDK when method = paypal ──────────── */
  useEffect(() => {
    if (method !== "paypal" || !PP_ID) return;
    paypalRendered.current = false;
    const existing = document.getElementById("paypal-sdk");
    if (existing) { renderPayPalButtons(); return; }
    const script  = document.createElement("script");
    script.id     = "paypal-sdk";
    script.src    = `https://www.paypal.com/sdk/js?client-id=${PP_ID}&currency=USD`;
    script.onload = renderPayPalButtons;
    document.body.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  function renderPayPalButtons() {
    if (paypalRendered.current || !paypalContainerRef.current || !window.paypal) return;
    paypalRendered.current = true;
    const usd = (total / USD_RATE).toFixed(2);
    window.paypal.Buttons({
      createOrder: async (_data: unknown, actions: { order: { create: (o: object) => Promise<string> } }) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: usd, currency_code: "USD" },
                              description: "Commande TEHTEK" }],
        });
      },
      onApprove: async (data: { orderID: string }, _actions: unknown) => {
        if (!validateForm()) return;
        setLoading(true);
        setError("");
        try {
          // 1 — create our order record
          const ref = await submitOrder("paypal");
          // 2 — capture PayPal
          const capRes = await fetch(
            `${API}/shop/payment/paypal/capture?paypal_order_id=${data.orderID}&order_ref=${ref}`,
            { method: "POST" }
          );
          if (!capRes.ok) throw new Error("PayPal capture failed");
          clearCart();
          router.push(`/order/${ref}?status=paid`);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Erreur lors du paiement PayPal.");
          setLoading(false);
        }
      },
      onError: () => setError("Une erreur PayPal s'est produite. Veuillez réessayer."),
    }).render(paypalContainerRef.current);
  }

  /* ── Validation ─────────────────────────────────────── */
  function validateForm(): boolean {
    if (!form.name.trim())  { setError("Veuillez entrer votre nom complet."); return false; }
    if (!form.phone.trim()) { setError("Veuillez entrer votre numéro de téléphone."); return false; }
    if (items.length === 0) { setError("Votre panier est vide."); return false; }
    if (method === "cod" && codStatus !== "eligible") {
      setError("Ce numéro n'est pas éligible au paiement à la livraison.");
      return false;
    }
    return true;
  }

  /* ── Submit order to backend ─────────────────────────── */
  async function submitOrder(overrideMethod?: PaymentMethod): Promise<string> {
    const res = await fetch(`${API}/shop/checkout`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name:    form.name.trim(),
        customer_phone:   form.phone.trim(),
        customer_email:   form.email.trim() || null,
        customer_city:    form.city.trim()  || null,
        delivery_address: form.address.trim() || null,
        delivery_notes:   form.notes.trim()   || null,
        items: items.map(i => ({
          id:         i.id,
          sku:        i.sku,
          name:       i.name,
          qty:        i.qty,
          unit_price: i.sell_price ?? 0,
        })),
        payment_method: overrideMethod ?? method,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail ?? "Erreur lors de la création de la commande.");
    return data.order_ref as string;
  }

  /* ── Main pay handler ───────────────────────────────── */
  async function handlePay() {
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      const data = await (async () => {
        const res = await fetch(`${API}/shop/checkout`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_name:    form.name.trim(),
            customer_phone:   form.phone.trim(),
            customer_email:   form.email.trim() || null,
            customer_city:    form.city.trim()  || null,
            delivery_address: form.address.trim() || null,
            delivery_notes:   form.notes.trim()   || null,
            items: items.map(i => ({
              id:         i.id,
              sku:        i.sku,
              name:       i.name,
              qty:        i.qty,
              unit_price: i.sell_price ?? 0,
            })),
            payment_method: method,
          }),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.detail ?? "Erreur serveur.");
        return d;
      })();

      if (method === "fapshi" && data.pay_link) {
        // Do NOT clear cart here — clear it only after Fapshi confirms payment_status === "paid"
        window.location.href = data.pay_link;
      } else if (method === "cod") {
        clearCart(); // COD is immediately confirmed by the server
        router.push(`/order/${data.order_ref}?status=cod`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
      setLoading(false);
    }
  }

  /* ── Render ─────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <>
        <Navbar hideSearch />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-600 font-semibold mb-4">Votre panier est vide</p>
            <Link href="/produits" className="bg-[#2E8B2E] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#236B23] transition-colors">
              Voir les produits
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const inputCls = "w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E] transition-colors placeholder:text-slate-400";
  const labelCls = "text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block";

  return (
    <>
      <Navbar hideSearch />
      <main className="min-h-screen bg-slate-50">
        <div className="bg-[#1A2E1A] py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <Link href="/produits" className="inline-flex items-center gap-2 text-green-200/70 hover:text-white text-sm mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour aux produits
            </Link>
            <h1 className="text-2xl font-black text-white">Finaliser ma commande</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: form ──────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Contact */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-[#2E8B2E]" />
                Informations de contact
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Nom complet *</label>
                  <input className={inputCls} value={form.name} onChange={set("name")} placeholder="Prénom et nom" />
                </div>
                <div>
                  <label className={labelCls}>Téléphone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className={inputCls + " pl-10"} value={form.phone} onChange={set("phone")} placeholder="+237 6XX XXX XXX" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Email (optionnel)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className={inputCls + " pl-10"} value={form.email} onChange={set("email")} placeholder="vous@email.com" type="email" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Ville *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className={inputCls + " pl-10"} value={form.city} onChange={set("city")} placeholder="Douala, Yaoundé…" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Quartier / Adresse</label>
                  <input className={inputCls} value={form.address} onChange={set("address")} placeholder="Bonanjo, Akwa…" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Notes de livraison (optionnel)</label>
                  <textarea className={inputCls + " resize-none"} rows={2} value={form.notes} onChange={set("notes")} placeholder="Indications pour le livreur…" />
                </div>
              </div>
            </section>

            {/* Payment method */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#2E8B2E]" />
                Mode de paiement
              </h2>

              <div className="space-y-3">

                {/* Fapshi */}
                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${method === "fapshi" ? "border-[#2E8B2E] bg-green-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="radio" className="mt-0.5" name="method" value="fapshi"
                    checked={method === "fapshi"} onChange={() => setMethod("fapshi")} />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">Carte bancaire · Orange Money · MTN MoMo</p>
                    <p className="text-xs text-slate-500 mt-0.5">Paiement sécurisé via Fapshi — vous serez redirigé vers la page de paiement</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded">VISA</span>
                      <span className="text-[10px] font-black text-white bg-[#FF6600] px-2 py-0.5 rounded">OM</span>
                      <span className="text-[10px] font-black text-white bg-[#FFCC00] text-black px-2 py-0.5 rounded" style={{color:"#000"}}>MoMo</span>
                    </div>
                  </div>
                </label>

                {/* PayPal */}
                {PP_ID && (
                  <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${method === "paypal" ? "border-[#2E8B2E] bg-green-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="radio" className="mt-0.5" name="method" value="paypal"
                      checked={method === "paypal"} onChange={() => setMethod("paypal")} />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">
                        Pay<span className="text-[#009CDE]">Pal</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Paiement international en USD (~{fmt(total)} = ${(total / USD_RATE).toFixed(2)})
                      </p>
                    </div>
                  </label>
                )}

                {/* COD */}
                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${method === "cod" ? "border-[#2E8B2E] bg-green-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="radio" className="mt-0.5" name="method" value="cod"
                    checked={method === "cod"} onChange={() => setMethod("cod")} />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#2E8B2E]" />
                      Paiement à la livraison
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Réservé aux clients certifiés TEHTEK. Votre numéro de téléphone sera vérifié.
                    </p>
                    {method === "cod" && (
                      <div className="mt-2">
                        {codStatus === "checking" && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                            <Loader2 className="w-3 h-3 animate-spin" /> Vérification…
                          </span>
                        )}
                        {codStatus === "eligible" && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[#2E8B2E] font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Bonjour {codName} — vous êtes éligible à la livraison
                          </span>
                        )}
                        {codStatus === "ineligible" && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-red-600">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Ce numéro n&apos;est pas certifié.{" "}
                            <a href="https://wa.me/237690768890" className="underline" target="_blank" rel="noopener noreferrer">
                              Contactez-nous
                            </a>{" "}pour vous faire certifier.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* PayPal buttons mount point */}
              {method === "paypal" && (
                <div className="mt-5">
                  {!PP_ID ? (
                    <p className="text-xs text-red-500">PayPal non configuré.</p>
                  ) : (
                    <div ref={paypalContainerRef} id="paypal-buttons" className="min-h-[50px]" />
                  )}
                </div>
              )}
            </section>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Pay button (not for PayPal — PayPal buttons handle that) */}
            {method !== "paypal" && (
              <button
                onClick={handlePay}
                disabled={loading || (method === "cod" && codStatus !== "eligible")}
                className={`w-full flex items-center justify-center gap-3 font-bold py-4 rounded-2xl transition-all text-base shadow-md ${
                  loading
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : method === "cod" && codStatus !== "eligible"
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[#2E8B2E] hover:bg-[#236B23] text-white"
                }`}
              >
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Traitement…</>
                  : method === "cod"
                  ? <><Truck className="w-5 h-5" /> Confirmer ma commande (livraison) <ChevronRight className="w-5 h-5" /></>
                  : <><CreditCard className="w-5 h-5" /> Payer maintenant — {fmt(total)} <ChevronRight className="w-5 h-5" /></>
                }
              </button>
            )}
          </div>

          {/* ── Right: order summary ─────────────────────── */}
          <aside className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-6 overflow-hidden">
              <div className="bg-[#1A2E1A] px-5 py-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#F5C800]" />
                <h3 className="text-white font-bold text-sm">Récapitulatif</h3>
                <span className="ml-auto bg-[#F5C800] text-[#1A2E1A] text-xs font-black px-2 py-0.5 rounded-full">
                  {items.reduce((s, i) => s + i.qty, 0)} article{items.reduce((s, i) => s + i.qty, 0) > 1 ? "s" : ""}
                </span>
              </div>
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-contain p-1" />
                        : <Package className="w-5 h-5 text-slate-300" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">× {item.qty}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-900 shrink-0">
                      {item.sell_price ? fmt(item.sell_price * item.qty) : "—"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 px-5 py-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Sous-total</span>
                  <span className="font-semibold text-slate-900">{fmt(total)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Livraison</span>
                  <span>À confirmer</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-xl font-black text-[#2E8B2E]">{fmt(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}
