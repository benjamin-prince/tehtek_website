"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { registerCustomer } from "@/lib/shopAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function InscriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", password: "", confirm: "",
  });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.email && !form.phone) {
      setError("Veuillez saisir au moins un email ou un numéro de téléphone");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setLoading(true);
    try {
      await registerCustomer({
        first_name: form.first_name,
        last_name:  form.last_name,
        email:      form.email,
        phone:      form.phone || undefined,
        password:   form.password,
      });
      router.push("/compte");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar hideSearch />
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1A2E1A] rounded-2xl mb-4">
                <UserPlus className="w-7 h-7 text-[#F5C800]" />
              </div>
              <h1 className="text-2xl font-black text-slate-900">Créer un compte</h1>
              <p className="text-slate-500 text-sm mt-1">Suivez vos commandes et gérez votre profil</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prénom</label>
                  <input
                    type="text" value={form.first_name} onChange={set("first_name")}
                    required placeholder="Jean"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom</label>
                  <input
                    type="text" value={form.last_name} onChange={set("last_name")}
                    required placeholder="Dupont"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                  />
                </div>
              </div>

              {/* At least one of email / phone required */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
                Renseignez <strong>au moins un</strong> : email <em>ou</em> numéro de téléphone.
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email <span className="text-slate-400 font-normal">(optionnel si téléphone fourni)</span>
                </label>
                <input
                  type="email" value={form.email} onChange={set("email")}
                  autoComplete="email" placeholder="votre@email.com"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Téléphone <span className="text-slate-400 font-normal">(optionnel si email fourni)</span>
                </label>
                <input
                  type="tel" value={form.phone} onChange={set("phone")}
                  placeholder="+237 6XX XXX XXX"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"} value={form.password} onChange={set("password")}
                    required autoComplete="new-password" placeholder="Min. 8 car., 1 majuscule, 1 chiffre"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirmer le mot de passe</label>
                <input
                  type={showPw ? "text" : "password"} value={form.confirm} onChange={set("confirm")}
                  required autoComplete="new-password" placeholder="••••••••"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E8B2E] focus:ring-1 focus:ring-[#2E8B2E]"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-[#2E8B2E] hover:bg-[#236B23] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm mt-2"
              >
                {loading ? "Création du compte…" : "Créer mon compte"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Déjà un compte ?{" "}
              <Link href="/connexion" className="text-[#2E8B2E] font-semibold hover:underline">
                Se connecter
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
