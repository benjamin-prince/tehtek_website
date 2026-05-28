"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, Search, ShoppingCart, UserCircle2, LogOut, Package, User, Heart } from "lucide-react";
import { getCart, cartCount } from "@/lib/cart";
import { wishlistCount } from "@/lib/wishlist";
import { getProfile, isLoggedIn, logoutCustomer } from "@/lib/shopAuth";
import CartDrawer from "./CartDrawer";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api2.tehtek.com/api/v1";

interface NavCat { key: string; label_fr: string; icon: string | null }

interface NavbarProps {
  hideSearch?: boolean;
}

export default function Navbar({ hideSearch }: NavbarProps) {
  const [open,          setOpen]          = useState(false);
  const [cartOpen,      setCartOpen]      = useState(false);
  const [accountOpen,   setAccountOpen]   = useState(false);
  const [count,         setCount]         = useState(0);
  const [wishCount,     setWishCount]     = useState(0);
  const [navCats,       setNavCats]       = useState<NavCat[]>([]);
  const [loggedIn,      setLoggedIn]      = useState(false);
  const [firstName,     setFirstName]     = useState("");
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API}/shop/categories`)
      .then(r => r.json())
      .then((data: unknown) => { if (Array.isArray(data)) setNavCats((data as NavCat[]).slice(0, 8)); })
      .catch(() => {});
  }, []);

  const refreshCount = useCallback(() => setCount(cartCount(getCart())), []);
  const refreshWish  = useCallback(() => setWishCount(wishlistCount()), []);
  const refreshAuth  = useCallback(() => {
    const profile = getProfile();
    setLoggedIn(isLoggedIn());
    setFirstName(profile?.first_name ?? "");
  }, []);

  useEffect(() => {
    refreshCount();
    refreshWish();
    refreshAuth();
    const openCart = () => setCartOpen(true);
    window.addEventListener("cart-updated",      refreshCount);
    window.addEventListener("wishlist-updated",  refreshWish);
    window.addEventListener("shop-auth-changed", refreshAuth);
    window.addEventListener("open-cart",         openCart);
    return () => {
      window.removeEventListener("cart-updated",      refreshCount);
      window.removeEventListener("wishlist-updated",  refreshWish);
      window.removeEventListener("shop-auth-changed", refreshAuth);
      window.removeEventListener("open-cart",         openCart);
    };
  }, [refreshCount, refreshWish, refreshAuth]);

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Top bar */}
        <div className="bg-[#1A2E1A] text-white text-xs py-1.5 px-4 text-center">
          <span>Livraison à Douala &amp; Yaoundé · </span>
          <a href="https://wa.me/237690768890" className="underline font-semibold hover:text-[#F5C800]">
            Commander via WhatsApp
          </a>
          <span> · Service client 8h–18h</span>
        </div>

        {/* Main bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 sm:h-16 gap-3">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image src="/logo.png" alt="TEHTEK" width={120} height={20} priority style={{ height: "auto" }} className="sm:w-[140px]" />
            </Link>

            {/* Search bar — desktop only (mobile has its own row below) */}
            {!hideSearch && (
              <div className="flex-1 hidden sm:flex items-center max-w-xl relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit, une marque…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = (e.target as HTMLInputElement).value.trim();
                      if (v) window.location.href = `/produits?q=${encodeURIComponent(v)}`;
                    }
                  }}
                  className="w-full border border-slate-300 rounded-full pl-4 pr-12 py-2 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                />
                <Search className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            )}

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <a href="tel:+237690768890"
                className="hidden md:flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#2E8B2E] transition-colors">
                <Phone className="w-4 h-4" />
                <span>+237 690 768 890</span>
              </a>

              {/* Account dropdown */}
              <div ref={accountRef} className="hidden md:block relative">
                <button
                  onClick={() => setAccountOpen(v => !v)}
                  className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#2E8B2E] transition-colors"
                >
                  <UserCircle2 className="w-5 h-5" />
                  <span>{loggedIn ? (firstName || "Mon compte") : "Connexion"}</span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-slate-200 py-2 z-50">
                    {loggedIn ? (
                      <>
                        <p className="px-4 py-2 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                          {firstName}
                        </p>
                        <Link href="/compte"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2E8B2E] transition-colors">
                          <Package className="w-4 h-4" /> Mes commandes
                        </Link>
                        <Link href="/compte?tab=profil"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2E8B2E] transition-colors">
                          <User className="w-4 h-4" /> Mon profil
                        </Link>
                        <hr className="my-1 border-slate-100" />
                        <button
                          onClick={async () => { setAccountOpen(false); await logoutCustomer(); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/connexion"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2E8B2E] transition-colors">
                          <UserCircle2 className="w-4 h-4" /> Se connecter
                        </Link>
                        <Link href="/inscription"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2E8B2E] transition-colors">
                          <User className="w-4 h-4" /> Créer un compte
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist button */}
              <Link
                href="/wishlist"
                className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 hover:border-red-400 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                title="Mes favoris"
              >
                <Heart className="w-4 h-4" />
                {wishCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {wishCount > 9 ? "9+" : wishCount}
                  </span>
                )}
              </Link>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 bg-[#2E8B2E] hover:bg-[#236B23] text-white font-semibold px-4 py-2 rounded-full transition-colors text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Panier</span>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#F5C800] text-[#1A2E1A] text-[10px] font-black rounded-full flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                className="sm:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                onClick={() => setOpen(!open)}
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar — mobile only row */}
          {!hideSearch && (
            <div className="sm:hidden pb-2 relative">
              <input
                type="text"
                placeholder="Rechercher un produit, une marque…"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = (e.target as HTMLInputElement).value.trim();
                    if (v) window.location.href = `/produits?q=${encodeURIComponent(v)}`;
                  }
                }}
                className="w-full border border-slate-300 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          )}

          {/* Category nav row (desktop) */}
          <nav className="hidden sm:flex items-center gap-1 border-t border-slate-100 py-1.5 overflow-x-auto scrollbar-hide">
            <Link href="/produits"
              className="flex items-center gap-1 text-sm font-semibold text-[#2E8B2E] px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors whitespace-nowrap">
              Tous les produits
            </Link>
            {navCats.map((c) => (
              <Link key={c.key} href={`/produits?cat=${c.key}`}
                className="text-sm text-slate-600 hover:text-[#2E8B2E] px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors whitespace-nowrap">
                {c.icon && <span className="mr-1">{c.icon}</span>}{c.label_fr}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="sm:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-1">
            <Link href="/produits"
              className="block text-sm font-semibold text-[#2E8B2E] py-2 border-b border-slate-50"
              onClick={() => setOpen(false)}>
              Tous les produits
            </Link>
            {navCats.map((c) => (
              <Link key={c.key} href={`/produits?cat=${c.key}`}
                className="block text-sm text-slate-600 py-2 border-b border-slate-50"
                onClick={() => setOpen(false)}>
                {c.icon && <span className="mr-1">{c.icon}</span>}{c.label_fr}
              </Link>
            ))}
            <a href="tel:+237690768890" className="flex items-center gap-2 text-sm text-slate-600 py-2">
              <Phone className="w-4 h-4" /> +237 690 768 890
            </a>
            {loggedIn ? (
              <Link href="/compte" className="flex items-center gap-2 text-sm text-[#2E8B2E] font-semibold py-2" onClick={() => setOpen(false)}>
                <UserCircle2 className="w-4 h-4" /> Mon compte ({firstName})
              </Link>
            ) : (
              <Link href="/connexion" className="flex items-center gap-2 text-sm text-slate-600 py-2" onClick={() => setOpen(false)}>
                <UserCircle2 className="w-4 h-4" /> Connexion / Créer un compte
              </Link>
            )}
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
