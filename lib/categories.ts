/**
 * Static fallback category list — used for SSR/initial render.
 * Runtime components fetch fresh data from /api/v1/shop/categories.
 */

export interface ShopCategory {
  key: string;
  label_fr: string;
  icon: string;
  description_fr: string;
}

export const FALLBACK_CATEGORIES: ShopCategory[] = [
  { key: "electronics",        label_fr: "Téléphones & Tablettes",    icon: "📱", description_fr: "Smartphones, tablettes, montres connectées" },
  { key: "it_equipment",       label_fr: "Ordinateurs & Informatique",icon: "💻", description_fr: "Laptops, desktops, All-in-One, serveurs" },
  { key: "printer",            label_fr: "Imprimantes & Scanners",    icon: "🖨️", description_fr: "Imprimantes jet d'encre, laser, scanners" },
  { key: "network_equipment",  label_fr: "Réseau & Wi-Fi",            icon: "📡", description_fr: "Routeurs, switches, points d'accès" },
  { key: "security_equipment", label_fr: "Sécurité & Biométrie",      icon: "🔒", description_fr: "Caméras IP, NVR, contrôle d'accès" },
  { key: "solar_equipment",    label_fr: "Solaire & Onduleurs",       icon: "☀️", description_fr: "Panneaux, batteries, onduleurs, régulateurs" },
  { key: "storage",            label_fr: "Stockage & NAS",            icon: "💾", description_fr: "Disques durs, SSD, NAS, clés USB" },
  { key: "telecom",            label_fr: "Télécom & VoIP",            icon: "☎️", description_fr: "Téléphonie fixe, PABX, interphones" },
  { key: "tv_av",              label_fr: "TV & Électroménager",       icon: "📺", description_fr: "Téléviseurs, audio, électroménager" },
  { key: "accessories",        label_fr: "Accessoires",               icon: "🎧", description_fr: "Câbles, chargeurs, coques, casques" },
  { key: "consumable",         label_fr: "Consommables",              icon: "🔋", description_fr: "Encres, toners, piles, câbles divers" },
  { key: "office_supplies",    label_fr: "Bureautique",               icon: "🗂️", description_fr: "Papeterie, fournitures, mobilier tech" },
  { key: "pc_peripherals",     label_fr: "Périphériques PC",          icon: "🖥️", description_fr: "Écrans, claviers, souris, webcams" },
  { key: "pc_components",      label_fr: "Composants PC",             icon: "🔩", description_fr: "CPU, RAM, GPU, carte mère, alimentation" },
];
