/**
 * Payment methods badge strip — shown on product detail pages.
 *
 * Methods:
 *   - Carte Bancaire (Visa / Mastercard)
 *   - PayPal
 *   - Orange Money
 *   - Livraison contre remboursement (clients certifiés uniquement)
 */
export default function PaymentMethods({ compact = false }: { compact?: boolean }) {
  const methods = [
    {
      id: "card",
      label: "Carte bancaire",
      sublabel: "Visa · Mastercard",
      certified: false,
      icon: (
        <svg viewBox="0 0 38 24" className="w-10 h-6 shrink-0" fill="none">
          <rect width="38" height="24" rx="4" fill="#1A1F71" />
          <path d="M15.2 16H13l1.4-8h2.2L15.2 16zm7.3-7.8c-.4-.2-1.1-.4-1.9-.4-2.1 0-3.6 1.1-3.6 2.7 0 1.2 1 1.8 1.8 2.2.8.4 1 .6 1 1 0 .5-.6.8-1.2.8-.8 0-1.3-.1-2-.4l-.3-.1-.3 1.7c.5.2 1.4.4 2.3.4 2.3 0 3.7-1.1 3.7-2.8 0-.9-.6-1.6-1.8-2.2-.7-.4-1.2-.6-1.2-1 0-.3.4-.7 1.2-.7.7 0 1.2.1 1.6.3l.2.1.3-1.6zm5.6-.2h-1.6c-.5 0-.9.1-1.1.6l-3.1 7.4h2.2l.4-1.2h2.7l.3 1.2h2L28.1 8zm-2.7 4.9l.8-2.3.5 2.3h-1.3z" fill="white"/>
          {/* Visa text */}
          <text x="5" y="17" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">VISA</text>
        </svg>
      ),
    },
    {
      id: "paypal",
      label: "PayPal",
      sublabel: "Paiement sécurisé",
      certified: false,
      icon: (
        <svg viewBox="0 0 38 24" className="w-10 h-6 shrink-0" fill="none">
          <rect width="38" height="24" rx="4" fill="#003087" />
          <path d="M10.2 7.5h4c1.5 0 2.6 1 2.4 2.6-.3 1.8-1.6 2.7-3.1 2.7h-.9l-.7 3.2H10l1.5-8h-1.3zm2.4 3.9h.6c.6 0 1.2-.3 1.3-1.1.1-.5-.2-.9-.8-.9h-.6l-.5 2z" fill="#009CDE"/>
          <path d="M17.6 13.2c.1-.7.5-1.3 1.1-1.5.3-.1.6-.2 1-.2h2c.2 0 .3-.1.3-.3 0-.3-.2-.5-.5-.6-.2 0-.4-.1-.6-.1h-2.2l.3-1.5h2.5c.6 0 1 .1 1.3.2.7.3 1.1.9 1 1.8l-.6 3.2h-1.8l.1-.5c-.4.4-1 .6-1.7.6-.6 0-1.1-.2-1.4-.6-.3-.3-.4-.8-.3-1.3h.5zm2.4.2c.5 0 .9-.2 1.1-.6l.1-.4h-1.1c-.4 0-.6.2-.7.5-.1.3.1.5.6.5z" fill="white"/>
          <path d="M24.5 10.6h1.9l1.2 3.4.9-3.4h1.9l-1.8 5.4h-1.9l-1.4-3.5-.7 3.5h-1.9l1.8-5.4z" fill="white"/>
        </svg>
      ),
    },
    {
      id: "orange",
      label: "Orange Money",
      sublabel: "Mobile Money CM",
      certified: false,
      icon: (
        <svg viewBox="0 0 38 24" className="w-10 h-6 shrink-0" fill="none">
          <rect width="38" height="24" rx="4" fill="#FF6600" />
          <circle cx="19" cy="12" r="7" fill="white" fillOpacity=".15"/>
          <circle cx="19" cy="12" r="5" fill="white"/>
          <text x="19" y="16" textAnchor="middle" fill="#FF6600" fontSize="7" fontWeight="900" fontFamily="Arial">OM</text>
        </svg>
      ),
    },
    {
      id: "cod",
      label: "Paiement à la livraison",
      sublabel: "Clients certifiés uniquement",
      certified: true,
      icon: (
        <svg viewBox="0 0 38 24" className="w-10 h-6 shrink-0" fill="none">
          <rect width="38" height="24" rx="4" fill="#16a34a"/>
          <path d="M8 14l2.5 2.5L14 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="16" y="9" width="14" height="6" rx="1.5" fill="white" fillOpacity=".25"/>
          <rect x="17" y="10" width="5" height="4" rx="1" fill="white" fillOpacity=".5"/>
          <circle cx="24" cy="12" r="1.5" fill="white"/>
        </svg>
      ),
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-xs text-slate-400 mr-1">Paiement :</span>
        {methods.map((m) => (
          <div key={m.id} title={`${m.label} — ${m.sublabel}`}>
            {m.icon}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-[#1A2E1A]">
        <h2 className="text-white font-bold text-base flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#F5C800]">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
          </svg>
          Modes de paiement acceptés
        </h2>
      </div>

      <div className="divide-y divide-slate-50">
        {methods.map((m) => (
          <div key={m.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
            {m.icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{m.label}</p>
              <p className="text-xs text-slate-500">{m.sublabel}</p>
            </div>
            {m.certified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full shrink-0">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                  <path d="M8 0l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9L4.4 11l.7-4L2.2 4.2l4-.6L8 0z"/>
                </svg>
                Client certifié
              </span>
            )}
            {!m.certified && (
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#2E8B2E] shrink-0">
                <path fillRule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm3.78-9.72a.75.75 0 0 0-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4.5-4.5z" clipRule="evenodd"/>
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* CoD note */}
      <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
        <p className="text-xs text-amber-700 flex items-start gap-2">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 mt-0.5 shrink-0">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 4a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 4zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
          Le paiement à la livraison est réservé aux clients ayant un historique d&apos;achat vérifié
          avec TEHTEK. Contactez-nous pour connaître votre éligibilité.
        </p>
      </div>
    </div>
  );
}
