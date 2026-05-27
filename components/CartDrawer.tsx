"use client";
import { useEffect, useState, useCallback } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, Package, CreditCard } from "lucide-react";
import Link from "next/link";
import { getCart, removeFromCart, updateQty, clearCart,
         cartCount, cartTotal, buildWhatsAppMessage, CartItem } from "@/lib/cart";

const WA = "237690768890";

function fmt(n: number) {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
}

export default function CartDrawer({
  open, onClose,
}: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = useCallback(() => setItems(getCart()), []);
  useEffect(() => {
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, [refresh]);

  const count = cartCount(items);
  const total = cartTotal(items);

  const waLink = `https://wa.me/${WA}?text=${buildWhatsAppMessage(items)}`;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-[#1A2E1A]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#F5C800]" />
            <h2 className="text-white font-bold text-base">Mon panier</h2>
            {count > 0 && (
              <span className="bg-[#F5C800] text-[#1A2E1A] text-xs font-black px-2 py-0.5 rounded-full">{count}</span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">Votre panier est vide</p>
              <p className="text-slate-400 text-sm mt-1">Ajoutez des produits depuis le catalogue</p>
              <button
                onClick={onClose}
                className="mt-6 bg-[#2E8B2E] hover:bg-[#236B23] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                Voir le catalogue
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Package className="w-7 h-7 text-slate-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {item.brand && (
                    <p className="text-[10px] text-[#2E8B2E] font-semibold uppercase tracking-wide">{item.brand}</p>
                  )}
                  <p className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2">{item.name}</p>
                  {item.sell_price ? (
                    <p className="text-sm font-black text-slate-900 mt-1">{fmt(item.sell_price)}</p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-1">Prix sur demande</p>
                  )}

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-red-300 hover:text-red-500 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold text-slate-800 w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-green-300 hover:text-green-600 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-5 space-y-4 bg-white">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Total estimé</span>
              <span className="text-xl font-black text-slate-900">{fmt(total)}</span>
            </div>

            {/* Payment method badges */}
            <div className="flex items-center justify-center gap-2 py-2 border-y border-slate-100">
              <span className="text-[10px] text-slate-400">Paiement :</span>
              <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">VISA</span>
              <span className="text-[10px] font-black text-white bg-[#FF6600] px-1.5 py-0.5 rounded">OM</span>
              <span className="text-[10px] font-black bg-[#FFCC00] px-1.5 py-0.5 rounded" style={{color:"#000"}}>MoMo</span>
              <span className="text-[10px] font-black text-[#003087] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                Pay<span className="text-[#009CDE]">Pal</span>
              </span>
              <span className="text-[10px] font-black text-white bg-green-600 px-1.5 py-0.5 rounded">COD★</span>
            </div>

            {/* Primary CTA: checkout */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex items-center justify-center gap-2.5 w-full bg-[#2E8B2E] hover:bg-[#236B23] text-white font-bold py-4 rounded-2xl transition-colors shadow-md text-base"
            >
              <CreditCard className="w-5 h-5" />
              Passer commande — {fmt(total)}
            </Link>

            {/* Secondary: WhatsApp */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full border border-[#2E8B2E]/40 text-[#2E8B2E] hover:bg-green-50 font-semibold py-3 rounded-2xl transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Commander via WhatsApp
            </a>

            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-slate-400 hover:text-red-500 transition-colors py-1"
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  );
}
