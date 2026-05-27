"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { loginCustomer } from "@/lib/shopAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConnexionPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password,   setPassword]   = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginCustomer(identifier, password);
      router.push("/compte");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar hideSearch />
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1A2E1A] rounded-2xl mb-4">
                <LogIn className="w-7 h-7 text-[#F5C800]" />
              </div>
              <h1 className="text-2xl font-black text-slate-900">Connexion</h1>
              <p className="text-slate-500 text-sm mt-1">Accédez à votre espace client</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email ou numéro de téléphone</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="votre@email.com ou +237 6XX XXX XXX"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2E8B2E] hover:bg-[#236B23] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="text-[#2E8B2E] font-semibold hover:underline">
                Créer un compte
              </Link>
            </p>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400">ou</span>
              </div>
            </div>
            <Link href="/checkout" className="block text-center text-sm text-slate-500 hover:text-[#2E8B2E] transition-colors py-1">
              Continuer sans compte → Commander directement
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
