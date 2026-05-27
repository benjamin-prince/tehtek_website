/**
 * TEHTEK Shop — Customer portal auth helpers.
 * Tokens are stored in localStorage (client-side only).
 */

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

const KEY_ACCESS  = "shop_access_token";
const KEY_REFRESH = "shop_refresh_token";
const KEY_PROFILE = "shop_customer";

export interface ShopCustomer {
  id:            number;
  customer_code: string;
  first_name:    string;
  last_name:     string;
  email:         string;
  phone:         string | null;
  whatsapp:      string | null;
  address:       string | null;
  city:          string | null;
  country:       string | null;
}

export interface ShopOrder {
  order_ref:      string;
  status:         string;
  payment_status: string;
  payment_method: string;
  subtotal:       number;
  items:          Array<{ name: string; qty: number; unit_price: number; line_total: number }>;
  created_at:     string;
}

// ── Token storage ─────────────────────────────────────────────────────────────

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem(KEY_ACCESS,  access);
  localStorage.setItem(KEY_REFRESH, refresh);
}

export function clearTokens() {
  localStorage.removeItem(KEY_ACCESS);
  localStorage.removeItem(KEY_REFRESH);
  localStorage.removeItem(KEY_PROFILE);
}

export function getAccessToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(KEY_ACCESS) : null;
}

export function getRefreshToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(KEY_REFRESH) : null;
}

export function saveProfile(p: ShopCustomer) {
  localStorage.setItem(KEY_PROFILE, JSON.stringify(p));
}

export function getProfile(): ShopCustomer | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY_PROFILE);
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

// ── API fetch with auto-refresh ───────────────────────────────────────────────

async function shopFetch(path: string, opts: RequestInit = {}): Promise<Response> {
  const access = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
    ...(opts.headers as Record<string, string> | undefined ?? {}),
  };

  let res = await fetch(`${API}${path}`, { ...opts, headers });

  if (res.status === 401) {
    const refresh = getRefreshToken();
    if (refresh) {
      const rr = await fetch(`${API}/shop/auth/refresh`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ refresh_token: refresh }),
      });
      if (rr.ok) {
        const data = await rr.json();
        saveTokens(data.access_token, data.refresh_token);
        res = await fetch(`${API}${path}`, {
          ...opts,
          headers: { ...headers, Authorization: `Bearer ${data.access_token}` },
        });
      } else {
        clearTokens();
      }
    }
  }
  return res;
}

// ── Auth actions ──────────────────────────────────────────────────────────────

export async function registerCustomer(payload: {
  first_name: string; last_name: string;
  email: string; phone?: string; password: string;
}): Promise<ShopCustomer> {
  const res = await fetch(`${API}/shop/auth/register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Erreur lors de l'inscription");
  saveTokens(data.access_token, data.refresh_token);
  saveProfile(data.customer);
  window.dispatchEvent(new Event("shop-auth-changed"));
  return data.customer;
}

export async function loginCustomer(identifier: string, password: string): Promise<ShopCustomer> {
  const res = await fetch(`${API}/shop/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Identifiant ou mot de passe incorrect");
  saveTokens(data.access_token, data.refresh_token);
  saveProfile(data.customer);
  window.dispatchEvent(new Event("shop-auth-changed"));
  return data.customer;
}

export async function logoutCustomer() {
  const refresh = getRefreshToken();
  if (refresh) {
    await fetch(`${API}/shop/auth/logout`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ refresh_token: refresh }),
    }).catch(() => {});
  }
  clearTokens();
  window.dispatchEvent(new Event("shop-auth-changed"));
}

export async function fetchMe(): Promise<ShopCustomer> {
  const res  = await shopFetch("/shop/auth/me");
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Erreur");
  saveProfile(data);
  return data;
}

export async function updateMe(patch: Partial<ShopCustomer>): Promise<ShopCustomer> {
  const res  = await shopFetch("/shop/auth/me", {
    method: "PATCH",
    body:   JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Erreur");
  saveProfile(data);
  return data;
}

export async function fetchMyOrders(): Promise<ShopOrder[]> {
  const res  = await shopFetch("/shop/auth/orders");
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Erreur");
  return data;
}
