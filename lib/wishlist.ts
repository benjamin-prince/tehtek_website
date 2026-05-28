export interface WishlistItem {
  id: number;
  sku: string;
  name: string;
  image_url: string | null;
  sell_price: number | null;
  compare_price: number | null;
  brand: string | null;
  category: string;
}

const KEY = "tehtek_wishlist";

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

function save(items: WishlistItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("wishlist-updated"));
}

export function toggleWishlist(item: WishlistItem): boolean {
  const list = getWishlist();
  const idx = list.findIndex(w => w.id === item.id);
  if (idx >= 0) { list.splice(idx, 1); save(list); return false; }
  list.push(item); save(list); return true;
}

export function isInWishlist(id: number): boolean {
  return getWishlist().some(w => w.id === id);
}

export function removeFromWishlist(id: number) {
  save(getWishlist().filter(w => w.id !== id));
}

export function wishlistCount(): number {
  return getWishlist().length;
}
