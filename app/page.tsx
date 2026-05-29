import FlashBanner from "@/components/FlashBanner";
import FeaturedList from "@/components/FeaturedList";
import FlashDeals from "@/components/FlashDeals";
import CategoryRow from "@/components/CategoryRow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CATEGORIES = [
  { catKey: "electronics",        label: "Téléphones & Tablettes", emoji: "📱" },
  { catKey: "it_equipment",       label: "Informatique",           emoji: "💻" },
  { catKey: "printer",            label: "Imprimantes",            emoji: "🖨️" },
  { catKey: "solar_equipment",    label: "Solaire & Énergie",      emoji: "☀️" },
  { catKey: "security_equipment", label: "Sécurité",               emoji: "🔒" },
  { catKey: "network_equipment",  label: "Réseau",                 emoji: "📡" },
  { catKey: "accessories",        label: "Accessoires",            emoji: "🎧" },
  { catKey: "tv_av",              label: "TV & Audio",             emoji: "📺" },
  { catKey: "storage",            label: "Stockage",               emoji: "💾" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <FlashBanner />
      <main className="bg-slate-50">
        <FeaturedList />
        <FlashDeals />
        {CATEGORIES.map(c => <CategoryRow key={c.catKey} {...c} />)}
      </main>
      <Footer />
    </>
  );
}
