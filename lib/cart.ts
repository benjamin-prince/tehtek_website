/**
 * Cart — localStorage-backed, no server needed.
 * Each item: product snapshot + qty.
 */

export interface CartItem {
  id: number;
  sku: string;
  name: string;      // displayed name (fr preferred)
  image_url: string | null;
  sell_price: number | null;
  brand: string | null;
  qty: number;
}

const KEY = "tehtek_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: Omit<CartItem, "qty">) {
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
}

export function removeFromCart(id: number) {
  saveCart(getCart().filter((c) => c.id !== id));
}

export function updateQty(id: number, qty: number) {
  if (qty <= 0) { removeFromCart(id); return; }
  const cart = getCart();
  const item = cart.find((c) => c.id === id);
  if (item) { item.qty = qty; saveCart(cart); }
}

export function clearCart() {
  saveCart([]);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((s, i) => s + i.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + (i.sell_price ?? 0) * i.qty, 0);
}

export function buildWhatsAppMessage(items: CartItem[]): string {
  const lines = items.map((i) =>
    `• ${i.qty}x ${i.name}${i.sku ? ` (${i.sku})` : ""}${i.sell_price ? ` — ${fmt(i.sell_price * i.qty)} XAF` : ""}`
  );
  const total = cartTotal(items);
  return encodeURIComponent(
    `Bonjour TEHTEK, je voudrais commander :\n\n${lines.join("\n")}\n\nTotal estimé : ${fmt(total)} XAF\n\nMerci de confirmer la disponibilité et les modalités de livraison.`
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat("fr-CM", { maximumFractionDigits: 0 }).format(n);
}
