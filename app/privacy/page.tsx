import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de TEHTEK et TehCargo — collecte, utilisation et protection de vos données, y compris via WhatsApp.",
};

const SECTIONS = [
  {
    title: "1. Qui sommes-nous",
    body: `TEHTEK et TehCargo Inc. (15421 Old Columbia Pike, Burtonsville, MD 20866, USA)
exploitent ce site, la boutique en ligne, ainsi qu'un service client et d'expédition accessible
par WhatsApp. La présente politique décrit comment nous collectons, utilisons et protégeons
vos données personnelles. / TEHTEK and TehCargo Inc. operate this website, the online shop,
and a customer-service and shipping service available through WhatsApp. This policy describes
how we collect, use, and protect your personal data.`,
  },
  {
    title: "2. Données collectées / Data we collect",
    body: `Lorsque vous nous contactez (site, téléphone ou WhatsApp), nous pouvons collecter :
votre nom, numéro de téléphone, adresse e-mail, adresses d'enlèvement et de livraison,
informations sur vos colis (type, poids, photos que vous envoyez volontairement), coordonnées
du destinataire, et le contenu de vos messages. / When you contact us (website, phone, or
WhatsApp), we may collect: your name, phone number, email, pickup and delivery addresses,
shipment details (type, weight, photos you voluntarily send), recipient contact details, and
the content of your messages.`,
  },
  {
    title: "3. Utilisation / How we use your data",
    body: `Vos données servent exclusivement à : répondre à vos demandes, préparer des devis,
organiser l'enlèvement, l'expédition et la livraison de vos colis, assurer le suivi de vos
expéditions, et améliorer notre service client (y compris via un assistant automatisé sur
WhatsApp). Nous ne vendons jamais vos données à des tiers. / Your data is used exclusively to:
answer your requests, prepare quotes, arrange pickup, shipping and delivery, track your
shipments, and improve our customer service (including an automated WhatsApp assistant).
We never sell your data to third parties.`,
  },
  {
    title: "4. WhatsApp",
    body: `Notre service client utilise l'API WhatsApp Business de Meta. Les messages échangés
avec notre numéro professionnel sont traités par nos systèmes (y compris un assistant
automatisé) afin de vous répondre. Les conversations sont conservées de manière sécurisée et
accessibles uniquement à notre équipe. L'utilisation de WhatsApp est également soumise à la
politique de confidentialité de WhatsApp/Meta. / Our customer service uses Meta's WhatsApp
Business API. Messages exchanged with our business number are processed by our systems
(including an automated assistant) to answer you. Conversations are stored securely and are
accessible only to our team. Your use of WhatsApp is also governed by the WhatsApp/Meta
privacy policy.`,
  },
  {
    title: "5. Partage / Sharing",
    body: `Nous partageons vos données uniquement avec les prestataires strictement nécessaires
à l'exécution du service : transporteurs, compagnies maritimes et aériennes, services douaniers,
et prestataires techniques (hébergement, traitement des messages). / We share your data only
with providers strictly necessary to deliver the service: carriers, shipping and airline
companies, customs services, and technical providers (hosting, message processing).`,
  },
  {
    title: "6. Conservation & sécurité / Retention & security",
    body: `Les données sont conservées le temps nécessaire à la gestion de vos expéditions et
aux obligations légales (comptabilité, douane), puis supprimées ou anonymisées. Elles sont
hébergées sur des serveurs sécurisés avec accès restreint et chiffrement en transit. / Data is
kept for as long as needed to manage your shipments and meet legal obligations (accounting,
customs), then deleted or anonymized. It is hosted on secured servers with restricted access
and encryption in transit.`,
  },
  {
    title: "7. Vos droits / Your rights",
    body: `Vous pouvez demander l'accès, la rectification ou la suppression de vos données à
tout moment en nous écrivant à info@tehtek.com ou sur WhatsApp. Vous pouvez aussi demander à
ne plus recevoir de messages de notre part. / You may request access, correction, or deletion
of your data at any time by writing to info@tehtek.com or on WhatsApp. You may also ask to
stop receiving messages from us.`,
  },
  {
    title: "8. Contact",
    body: `TEHTEK / TehCargo Inc. — 15421 Old Columbia Pike, Burtonsville, MD 20866, USA —
info@tehtek.com — WhatsApp : +1 (301) 778-5042. Dernière mise à jour : juillet 2026. /
Last updated: July 2026.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Politique de confidentialité</h1>
      <p className="text-sm opacity-70 mb-8">Privacy Policy — TEHTEK &amp; TehCargo Inc.</p>
      <div className="space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
            <p className="leading-relaxed whitespace-pre-line opacity-90">{s.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
