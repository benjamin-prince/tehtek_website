import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tehtek.com"),
  title: {
    default: "TEHTEK — Votre Boutique Tech au Cameroun",
    template: "%s | TEHTEK",
  },
  description:
    "Téléphones, ordinateurs, équipements solaires, systèmes de sécurité et plus encore. Livraison à Douala, Yaoundé et partout au Cameroun.",
  keywords: ["téléphone", "ordinateur", "solaire", "sécurité", "Cameroun", "TEHTEK"],
  icons: {
    icon: [
      { url: "/favicon-16x16.png",  sizes: "16x16",  type: "image/png" },
      { url: "/favicon-32x32.png",  sizes: "32x32",  type: "image/png" },
      { url: "/favicon-64x64.png",  sizes: "64x64",  type: "image/png" },
      { url: "/favicon-128x128.png",sizes: "128x128",type: "image/png" },
      { url: "/favicon.ico",        sizes: "any" },
    ],
    apple:   { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "TEHTEK — La Tech de Demain",
    description: "Votre boutique tech de référence au Cameroun.",
    url: "https://tehtek.com",
    siteName: "TEHTEK",
    locale: "fr_CM",
    type: "website",
    images: [{ url: "/icon-512x512.png", width: 512, height: 512 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
