import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://pub-PLACEHOLDER.r2.dev";

function img(filename: string) {
  return `${R2_PUBLIC_URL}/products/${filename}`;
}

async function seed() {
  console.log("Seeding database...");

  // ── Brands ──
  console.log("  Inserting brands...");
  await db.insert(schema.brands).values([
    { name: "Samsung", slug: "samsung", sortOrder: 1 },
    { name: "Infinix", slug: "infinix", sortOrder: 2 },
    { name: "Oppo", slug: "oppo", sortOrder: 3 },
    { name: "Honor", slug: "honor", sortOrder: 4 },
    { name: "Redmi", slug: "redmi", sortOrder: 5 },
    { name: "Xiaomi", slug: "xiaomi", sortOrder: 6 },
  ]);

  // ── Categories ──
  console.log("  Inserting categories...");
  await db.insert(schema.categories).values([
    { name: "Telephones", slug: "telephones", icon: "smartphone", sortOrder: 1 },
    { name: "Accessoires", slug: "accessoires", icon: "headphones", sortOrder: 2 },
    { name: "Chargeurs", slug: "chargeurs", icon: "battery-charging", sortOrder: 3 },
    { name: "AirPods", slug: "airpods", icon: "headset", sortOrder: 4 },
    { name: "Coques", slug: "coques", icon: "shield", sortOrder: 5 },
    { name: "Cables", slug: "cables", icon: "cable", sortOrder: 6 },
    { name: "Tablettes", slug: "tablettes", icon: "tablet", sortOrder: 7 },
  ]);

  // ── Products ──
  console.log("  Inserting products...");

  // Helper: insert a product and its variants
  async function addProduct(
    product: {
      name: string;
      slug: string;
      brandId: number;
      categoryId: number;
      imageFile: string;
      description: string;
      specs: Record<string, string>;
      colors: string[];
      isFeatured?: boolean;
      badge?: string | null;
    },
    variants: {
      ram: string;
      storage: string;
      storageUnit?: string;
      price: number;
      originalPrice?: number;
      isDefault: boolean;
    }[]
  ) {
    const [inserted] = await db
      .insert(schema.products)
      .values({
        name: product.name,
        slug: product.slug,
        brandId: product.brandId,
        categoryId: product.categoryId,
        imageUrl: img(product.imageFile),
        description: product.description,
        specs: product.specs,
        colors: JSON.stringify(product.colors),
        isFeatured: product.isFeatured ?? false,
        badge: product.badge ?? null,
        isActive: true,
        sortOrder: 0,
      })
      .returning({ id: schema.products.id });

    await db.insert(schema.productVariants).values(
      variants.map((v) => ({
        productId: inserted.id,
        ram: v.ram,
        storage: v.storage,
        storageUnit: v.storageUnit || "GB",
        price: String(v.price),
        originalPrice: v.originalPrice ? String(v.originalPrice) : null,
        isDefault: v.isDefault,
      }))
    );
  }

  const CAT = 1; // telephones

  // ── SAMSUNG (brand_id = 1) ──
  await addProduct(
    {
      name: "Samsung Galaxy A56", slug: "samsung-galaxy-a56", brandId: 1, categoryId: CAT,
      imageFile: "samsung-galaxy-a56.jpg",
      description: "Le Galaxy A56 offre un ecran Super AMOLED 6.7 pouces, un processeur Exynos 1580 performant et un appareil photo 50MP pour des cliches exceptionnels.",
      specs: { display: '6.7" Super AMOLED, 120Hz, 1080x2340', processor: "Exynos 1580", camera: "50MP + 12MP + 5MP arriere, 12MP avant", battery: "5000 mAh, charge rapide 25W", os: "Android 15, One UI 7" },
      colors: ["Noir", "Bleu", "Lilas"],
    },
    [
      { ram: "8", storage: "128", price: 1149, isDefault: true },
      { ram: "8", storage: "256", price: 1299, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Samsung Galaxy A36", slug: "samsung-galaxy-a36", brandId: 1, categoryId: CAT,
      imageFile: "samsung-galaxy-a36.jpg",
      description: "Le Galaxy A36 combine un design elegant avec un ecran Super AMOLED 6.6 pouces et une batterie longue duree de 5000 mAh.",
      specs: { display: '6.6" Super AMOLED, 120Hz, 1080x2340', processor: "Snapdragon 6 Gen 3", camera: "50MP + 8MP + 5MP arriere, 13MP avant", battery: "5000 mAh, charge rapide 25W", os: "Android 15, One UI 7" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [
      { ram: "8", storage: "128", price: 899, isDefault: true },
      { ram: "8", storage: "256", price: 999, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Samsung Galaxy A26", slug: "samsung-galaxy-a26", brandId: 1, categoryId: CAT,
      imageFile: "samsung-galaxy-a26.jpg",
      description: "Le Galaxy A26 propose un excellent rapport qualite-prix avec son ecran AMOLED 6.5 pouces et ses performances fiables au quotidien.",
      specs: { display: '6.5" Super AMOLED, 90Hz, 1080x2340', processor: "Exynos 1380", camera: "50MP + 8MP + 2MP arriere, 13MP avant", battery: "5000 mAh, charge rapide 25W", os: "Android 15, One UI 7" },
      colors: ["Noir", "Bleu Clair", "Jaune"],
    },
    [
      { ram: "6", storage: "128", price: 749, isDefault: true },
      { ram: "8", storage: "256", price: 849, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Samsung Galaxy A17 5G", slug: "samsung-galaxy-a17-5g", brandId: 1, categoryId: CAT,
      imageFile: "samsung-galaxy-a17-5g.jpg",
      description: "Le Galaxy A17 5G offre la connectivite 5G a un prix accessible avec un ecran 6.5 pouces et 8Go de RAM.",
      specs: { display: '6.5" PLS LCD, 90Hz, 1080x2340', processor: "Dimensity 6300", camera: "50MP + 2MP arriere, 8MP avant", battery: "5000 mAh, charge rapide 15W", os: "Android 15, One UI 7" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [{ ram: "8", storage: "256", price: 820, isDefault: true }]
  );

  await addProduct(
    {
      name: "Samsung Galaxy A17 4G", slug: "samsung-galaxy-a17-4g", brandId: 1, categoryId: CAT,
      imageFile: "samsung-galaxy-a17-4g.jpg",
      description: "Le Galaxy A17 4G est un smartphone polyvalent avec un ecran 6.5 pouces et plusieurs configurations memoire disponibles.",
      specs: { display: '6.5" PLS LCD, 90Hz, 720x1600', processor: "Helio G85", camera: "50MP + 2MP arriere, 8MP avant", battery: "5000 mAh, charge rapide 15W", os: "Android 14, One UI 6" },
      colors: ["Noir", "Bleu", "Or"],
    },
    [
      { ram: "4", storage: "128", price: 599, isDefault: true },
      { ram: "6", storage: "128", price: 649, isDefault: false },
      { ram: "8", storage: "256", price: 779, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Samsung Galaxy A16", slug: "samsung-galaxy-a16", brandId: 1, categoryId: CAT,
      imageFile: "samsung-galaxy-a16.jpg",
      description: "Le Galaxy A16 est un smartphone d'entree de gamme fiable avec un ecran 6.5 pouces et une autonomie impressionnante.",
      specs: { display: '6.5" PLS LCD, 90Hz, 1080x2340', processor: "Exynos 1330", camera: "50MP + 5MP + 2MP arriere, 13MP avant", battery: "5000 mAh, charge rapide 25W", os: "Android 14, One UI 6" },
      colors: ["Noir", "Bleu", "Or"],
    },
    [
      { ram: "4", storage: "128", price: 549, isDefault: true },
      { ram: "6", storage: "128", price: 579, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Samsung Galaxy A07", slug: "samsung-galaxy-a07", brandId: 1, categoryId: CAT,
      imageFile: "samsung-galaxy-a07.jpg",
      description: "Le Galaxy A07 est le compagnon ideal pour les usages essentiels avec son grand ecran 6.7 pouces et sa batterie longue duree.",
      specs: { display: '6.7" PLS LCD, 60Hz, 720x1600', processor: "Helio G85", camera: "50MP + 2MP arriere, 8MP avant", battery: "5000 mAh, charge 15W", os: "Android 14, One UI 6" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [
      { ram: "4", storage: "128", price: 449, isDefault: true },
      { ram: "6", storage: "128", price: 499, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Samsung Galaxy S25 Ultra", slug: "samsung-galaxy-s25-ultra", brandId: 1, categoryId: CAT,
      imageFile: "samsung-galaxy-s25-ultra.jpg",
      description: "Le Galaxy S25 Ultra est le fleuron de Samsung avec un ecran Dynamic AMOLED 6.9 pouces, le Snapdragon 8 Elite et un appareil photo 200MP.",
      specs: { display: '6.9" Dynamic AMOLED 2X, 120Hz, 1440x3120', processor: "Snapdragon 8 Elite", camera: "200MP + 50MP + 10MP + 50MP arriere, 12MP avant", battery: "5000 mAh, charge rapide 45W", os: "Android 15, One UI 7" },
      colors: ["Noir Titane", "Bleu Titane", "Gris Titane", "Argent Titane"],
      badge: "Premium",
    },
    [{ ram: "12", storage: "256", price: 3200, isDefault: true }]
  );

  await addProduct(
    {
      name: "Samsung Galaxy S26 Ultra", slug: "samsung-galaxy-s26-ultra", brandId: 1, categoryId: CAT,
      imageFile: "samsung-galaxy-s26-ultra.jpg",
      description: "Le tout nouveau Galaxy S26 Ultra repousse les limites avec son ecran 6.9 pouces, son processeur de derniere generation et des capacites IA avancees.",
      specs: { display: '6.9" Dynamic AMOLED 2X, 120Hz, 1440x3120', processor: "Snapdragon 8 Elite 2", camera: "200MP + 50MP + 10MP + 50MP arriere, 12MP avant", battery: "5500 mAh, charge rapide 65W", os: "Android 16, One UI 8" },
      colors: ["Noir Titane", "Bleu Titane", "Argent Titane", "Vert Titane"],
      isFeatured: true, badge: "Nouveau",
    },
    [{ ram: "12", storage: "256", price: 4300, isDefault: true }]
  );

  await addProduct(
    {
      name: "Samsung Galaxy Z Flip 7", slug: "samsung-galaxy-z-flip-7", brandId: 1, categoryId: CAT,
      imageFile: "samsung-galaxy-z-flip-7.jpg",
      description: "Le Z Flip 7 est le smartphone pliable compact de Samsung avec un design iconique et des performances de pointe.",
      specs: { display: '6.7" Dynamic AMOLED 2X pliable, 120Hz + 3.4" ecran externe', processor: "Snapdragon 8 Elite", camera: "50MP + 12MP arriere, 10MP avant", battery: "4000 mAh, charge rapide 25W", os: "Android 15, One UI 7" },
      colors: ["Noir", "Bleu", "Vert Menthe", "Jaune"],
      badge: "Nouveau",
    },
    [{ ram: "12", storage: "256", price: 2700, isDefault: true }]
  );

  await addProduct(
    {
      name: "Samsung Galaxy Z Fold 7", slug: "samsung-galaxy-z-fold-7", brandId: 1, categoryId: CAT,
      imageFile: "samsung-galaxy-z-fold-7.jpg",
      description: "Le Z Fold 7 transforme votre experience mobile avec son grand ecran pliable 7.6 pouces et ses capacites multitache inegalees.",
      specs: { display: '7.6" Dynamic AMOLED 2X pliable, 120Hz + 6.2" ecran externe', processor: "Snapdragon 8 Elite", camera: "50MP + 12MP + 10MP arriere, 4MP sous ecran + 10MP couverture", battery: "4400 mAh, charge rapide 25W", os: "Android 15, One UI 7" },
      colors: ["Noir", "Bleu Marine", "Argent"],
      badge: "Premium",
    },
    [{ ram: "12", storage: "512", price: 4900, isDefault: true }]
  );

  // ── INFINIX (brand_id = 2) ──
  await addProduct(
    {
      name: "Infinix Note 50S 5G+", slug: "infinix-note-50s-5g-plus", brandId: 2, categoryId: CAT,
      imageFile: "infinix-note-50s-5g-plus.jpg",
      description: "Le Note 50S 5G+ d'Infinix offre la connectivite 5G avec un ecran AMOLED 6.78 pouces et une charge rapide 33W.",
      specs: { display: '6.78" AMOLED, 120Hz, 1080x2400', processor: "Dimensity 7025", camera: "108MP + 2MP arriere, 32MP avant", battery: "5000 mAh, charge rapide 33W", os: "Android 14, XOS 14" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [{ ram: "8", storage: "256", price: 830, isDefault: true }]
  );

  await addProduct(
    {
      name: "Infinix Hot 60 Pro+", slug: "infinix-hot-60-pro-plus", brandId: 2, categoryId: CAT,
      imageFile: "infinix-hot-60-pro-plus.jpg",
      description: "Le Hot 60 Pro+ offre un ecran IPS 6.78 pouces, 8Go de RAM et une autonomie exceptionnelle de 6000 mAh.",
      specs: { display: '6.78" IPS LCD, 120Hz, 1080x2460', processor: "Helio G100", camera: "108MP + 2MP arriere, 8MP avant", battery: "6000 mAh, charge rapide 33W", os: "Android 14, XOS 14" },
      colors: ["Noir Volcanique", "Bleu Glacier", "Or"],
    },
    [{ ram: "8", storage: "256", price: 750, isDefault: true }]
  );

  await addProduct(
    {
      name: "Infinix Hot 60 Pro", slug: "infinix-hot-60-pro", brandId: 2, categoryId: CAT,
      imageFile: "infinix-hot-60-pro.jpg",
      description: "Le Hot 60 Pro combine performances et autonomie avec sa batterie 6000 mAh et son ecran 6.78 pouces fluide.",
      specs: { display: '6.78" IPS LCD, 90Hz, 720x1612', processor: "Helio G85", camera: "50MP + 2MP arriere, 8MP avant", battery: "6000 mAh, charge rapide 18W", os: "Android 14, XOS 14" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [{ ram: "8", storage: "256", price: 650, isDefault: true }]
  );

  await addProduct(
    {
      name: "Infinix Hot 60i", slug: "infinix-hot-60i", brandId: 2, categoryId: CAT,
      imageFile: "infinix-hot-60i.jpg",
      description: "Le Hot 60i est un smartphone abordable avec un ecran 6.56 pouces et une batterie genereuse de 5000 mAh.",
      specs: { display: '6.56" IPS LCD, 90Hz, 720x1612', processor: "Helio G36", camera: "13MP + 0.08MP arriere, 8MP avant", battery: "5000 mAh, charge 10W", os: "Android 14 Go, XOS 14" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [
      { ram: "6", storage: "128", price: 480, isDefault: true },
      { ram: "8", storage: "256", price: 530, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Infinix Smart 10", slug: "infinix-smart-10", brandId: 2, categoryId: CAT,
      imageFile: "infinix-smart-10.jpg",
      description: "Le Smart 10 est le smartphone essentiel d'Infinix avec un prix accessible et des fonctionnalites de base fiables.",
      specs: { display: '6.6" IPS LCD, 60Hz, 720x1612', processor: "Helio A24", camera: "13MP arriere, 5MP avant", battery: "5000 mAh, charge 10W", os: "Android 14 Go, XOS 14" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [
      { ram: "3", storage: "64", price: 370, isDefault: true },
      { ram: "4", storage: "128", price: 400, isDefault: false },
    ]
  );

  // ── OPPO (brand_id = 3) ──
  await addProduct(
    {
      name: "Oppo Reno 14F", slug: "oppo-reno-14f", brandId: 3, categoryId: CAT,
      imageFile: "oppo-reno-14f.jpg",
      description: "Le Reno 14F d'Oppo brille par son ecran AMOLED 6.7 pouces, 12Go de RAM et un systeme photo 64MP polyvalent.",
      specs: { display: '6.7" AMOLED, 120Hz, 1080x2400', processor: "Dimensity 7300", camera: "64MP + 8MP + 2MP arriere, 32MP avant", battery: "5000 mAh, charge rapide SUPERVOOC 67W", os: "Android 15, ColorOS 15" },
      colors: ["Noir", "Bleu", "Rose"],
      isFeatured: true,
    },
    [
      { ram: "12", storage: "256", price: 1180, isDefault: true },
      { ram: "12", storage: "512", price: 1350, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Oppo A6 Pro 5G", slug: "oppo-a6-pro-5g", brandId: 3, categoryId: CAT,
      imageFile: "oppo-a6-pro-5g.jpg",
      description: "L'A6 Pro 5G offre la connectivite 5G dans un design premium avec un ecran AMOLED 6.7 pouces et une charge rapide 45W.",
      specs: { display: '6.7" AMOLED, 120Hz, 1080x2400', processor: "Dimensity 7050", camera: "50MP + 2MP arriere, 16MP avant", battery: "5100 mAh, charge rapide 45W", os: "Android 14, ColorOS 14" },
      colors: ["Noir", "Bleu Ocean", "Violet"],
    },
    [{ ram: "8", storage: "256", price: 1050, isDefault: true }]
  );

  await addProduct(
    {
      name: "Oppo Reno 12 5G", slug: "oppo-reno-12-5g", brandId: 3, categoryId: CAT,
      imageFile: "oppo-reno-12-5g.jpg",
      description: "Le Reno 12 5G combine elegance et puissance avec son Dimensity 7300 et son ecran AMOLED 6.7 pouces incurve.",
      specs: { display: '6.7" AMOLED, 120Hz, 1080x2412', processor: "Dimensity 7300", camera: "50MP + 8MP + 2MP arriere, 32MP avant", battery: "5000 mAh, charge rapide SUPERVOOC 67W", os: "Android 14, ColorOS 14" },
      colors: ["Noir", "Argent", "Bleu"],
    },
    [{ ram: "12", storage: "512", price: 1150, isDefault: true }]
  );

  await addProduct(
    {
      name: "Oppo Reno 12F 4G", slug: "oppo-reno-12f-4g", brandId: 3, categoryId: CAT,
      imageFile: "oppo-reno-12f-4g.jpg",
      description: "Le Reno 12F 4G offre un excellent rapport qualite-prix avec son ecran AMOLED 6.67 pouces et sa charge rapide 45W.",
      specs: { display: '6.67" AMOLED, 120Hz, 1080x2400', processor: "Helio G99", camera: "50MP + 8MP + 2MP arriere, 32MP avant", battery: "5000 mAh, charge rapide 45W", os: "Android 14, ColorOS 14" },
      colors: ["Noir", "Vert", "Orange"],
    },
    [{ ram: "8", storage: "256", price: 720, isDefault: true }]
  );

  await addProduct(
    {
      name: "Oppo A5 Pro 5G", slug: "oppo-a5-pro-5g", brandId: 3, categoryId: CAT,
      imageFile: "oppo-a5-pro-5g.jpg",
      description: "L'A5 Pro 5G offre la 5G et une construction robuste avec certification IP69 pour une resistance maximale.",
      specs: { display: '6.7" AMOLED, 120Hz, 1080x2400', processor: "Dimensity 7025", camera: "50MP + 2MP arriere, 8MP avant", battery: "5100 mAh, charge rapide 45W", os: "Android 14, ColorOS 14" },
      colors: ["Noir", "Bleu", "Blanc"],
    },
    [{ ram: "8", storage: "256", price: 800, isDefault: true }]
  );

  await addProduct(
    {
      name: "Oppo A5 5G", slug: "oppo-a5-5g", brandId: 3, categoryId: CAT,
      imageFile: "oppo-a5-5g.jpg",
      description: "L'A5 5G est un smartphone 5G accessible avec un ecran 6.6 pouces et une batterie de 5100 mAh.",
      specs: { display: '6.6" IPS LCD, 90Hz, 720x1612', processor: "Dimensity 6300", camera: "13MP + 2MP arriere, 5MP avant", battery: "5100 mAh, charge rapide 15W", os: "Android 14, ColorOS 14" },
      colors: ["Noir", "Bleu", "Blanc"],
    },
    [{ ram: "6", storage: "128", price: 670, isDefault: true }]
  );

  await addProduct(
    {
      name: "Oppo A3", slug: "oppo-a3", brandId: 3, categoryId: CAT,
      imageFile: "oppo-a3.jpg",
      description: "L'Oppo A3 est un smartphone resistant avec certification IP54, ecran 6.67 pouces et charge rapide 45W.",
      specs: { display: '6.67" IPS LCD, 90Hz, 720x1604', processor: "Snapdragon 680", camera: "50MP + 2MP arriere, 8MP avant", battery: "5000 mAh, charge rapide 45W", os: "Android 14, ColorOS 14" },
      colors: ["Noir", "Bleu Etoile", "Blanc"],
    },
    [{ ram: "8", storage: "256", price: 570, isDefault: true }]
  );

  await addProduct(
    {
      name: "Oppo A3x", slug: "oppo-a3x", brandId: 3, categoryId: CAT,
      imageFile: "oppo-a3x.jpg",
      description: "L'Oppo A3x est un smartphone d'entree de gamme fiable avec un ecran 6.67 pouces et une autonomie solide.",
      specs: { display: '6.67" IPS LCD, 90Hz, 720x1604', processor: "Helio G36", camera: "8MP arriere, 5MP avant", battery: "5100 mAh, charge rapide 10W", os: "Android 14, ColorOS 14" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [{ ram: "4", storage: "128", price: 480, isDefault: true }]
  );

  // ── HONOR (brand_id = 4) ──
  await addProduct(
    {
      name: "Honor 400", slug: "honor-400", brandId: 4, categoryId: CAT,
      imageFile: "honor-400.jpg",
      description: "Le Honor 400 impressionne avec son ecran AMOLED 6.78 pouces, 12Go de RAM et un systeme photo 108MP pour des cliches detailles.",
      specs: { display: '6.78" AMOLED, 120Hz, 1080x2400', processor: "Snapdragon 7 Gen 3", camera: "108MP + 8MP + 2MP arriere, 32MP avant", battery: "5200 mAh, charge rapide 100W", os: "Android 15, MagicOS 9" },
      colors: ["Noir", "Bleu", "Vert"],
      isFeatured: true,
    },
    [
      { ram: "12", storage: "256", price: 1130, isDefault: true },
      { ram: "12", storage: "512", price: 1280, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Honor 400 Lite 5G", slug: "honor-400-lite-5g", brandId: 4, categoryId: CAT,
      imageFile: "honor-400-lite-5g.jpg",
      description: "Le Honor 400 Lite 5G offre la 5G dans un design fin avec un ecran AMOLED 6.7 pouces et 12Go de RAM.",
      specs: { display: '6.7" AMOLED, 120Hz, 1080x2412', processor: "Dimensity 7025", camera: "108MP + 2MP arriere, 16MP avant", battery: "5200 mAh, charge rapide 35W", os: "Android 15, MagicOS 9" },
      colors: ["Noir", "Bleu Ciel", "Rose"],
    },
    [{ ram: "12", storage: "256", price: 860, isDefault: true }]
  );

  await addProduct(
    {
      name: "Honor X9d", slug: "honor-x9d", brandId: 4, categoryId: CAT,
      imageFile: "honor-x9d.jpg",
      description: "Le Honor X9d offre une durabilite exceptionnelle avec certification militaire, un ecran AMOLED 6.78 pouces et 12Go de RAM.",
      specs: { display: '6.78" AMOLED, 120Hz, 1080x2388', processor: "Snapdragon 6 Gen 1", camera: "108MP + 5MP arriere, 16MP avant", battery: "5300 mAh, charge rapide 35W", os: "Android 14, MagicOS 8" },
      colors: ["Noir", "Bleu Ocean", "Vert"],
    },
    [{ ram: "12", storage: "256", price: 1100, isDefault: true }]
  );

  await addProduct(
    {
      name: "Honor X9C", slug: "honor-x9c", brandId: 4, categoryId: CAT,
      imageFile: "honor-x9c.jpg",
      description: "Le Honor X9C est un smartphone robuste avec un ecran AMOLED 6.78 pouces et une batterie massive de 5600 mAh.",
      specs: { display: '6.78" AMOLED, 120Hz, 1080x2388', processor: "Snapdragon 6 Gen 1", camera: "108MP + 5MP arriere, 16MP avant", battery: "5600 mAh, charge rapide 66W", os: "Android 14, MagicOS 8" },
      colors: ["Noir", "Bleu", "Titanium"],
    },
    [{ ram: "8", storage: "256", price: 900, isDefault: true }]
  );

  await addProduct(
    {
      name: "Honor X7d 5G", slug: "honor-x7d-5g", brandId: 4, categoryId: CAT,
      imageFile: "honor-x7d-5g.jpg",
      description: "Le Honor X7d 5G offre la connectivite 5G a un prix competitif avec un ecran AMOLED 6.72 pouces et 8Go de RAM.",
      specs: { display: '6.72" AMOLED, 90Hz, 1080x2400', processor: "Dimensity 6300", camera: "50MP + 2MP arriere, 8MP avant", battery: "5200 mAh, charge rapide 35W", os: "Android 14, MagicOS 8" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [{ ram: "8", storage: "256", price: 750, isDefault: true }]
  );

  await addProduct(
    {
      name: "Honor X7d 4G", slug: "honor-x7d-4g", brandId: 4, categoryId: CAT,
      imageFile: "honor-x7d-4g.jpg",
      description: "Le Honor X7d 4G est un smartphone equilibre avec un ecran 6.72 pouces et une batterie de 5200 mAh pour une utilisation quotidienne confortable.",
      specs: { display: '6.72" IPS LCD, 90Hz, 720x1604', processor: "Helio G85", camera: "50MP + 2MP arriere, 8MP avant", battery: "5200 mAh, charge rapide 35W", os: "Android 14, MagicOS 8" },
      colors: ["Noir", "Bleu", "Or"],
    },
    [{ ram: "8", storage: "256", price: 650, isDefault: true }]
  );

  // ── REDMI (brand_id = 5) ──
  await addProduct(
    {
      name: "Redmi Note 15 Pro+", slug: "redmi-note-15-pro-plus", brandId: 5, categoryId: CAT,
      imageFile: "redmi-note-15-pro-plus.jpg",
      description: "Le Redmi Note 15 Pro+ est le haut de gamme de la serie avec un ecran AMOLED 6.67 pouces, un capteur 200MP et une charge turbo 120W.",
      specs: { display: '6.67" AMOLED, 120Hz, 1220x2712', processor: "Snapdragon 7s Gen 3", camera: "200MP + 8MP + 2MP arriere, 16MP avant", battery: "5110 mAh, charge rapide 120W", os: "Android 14, MIUI 15" },
      colors: ["Noir", "Bleu", "Violet"],
      isFeatured: true,
    },
    [
      { ram: "8", storage: "256", price: 1300, isDefault: true },
      { ram: "12", storage: "512", price: 1450, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Redmi Note 15 Pro", slug: "redmi-note-15-pro", brandId: 5, categoryId: CAT,
      imageFile: "redmi-note-15-pro.jpg",
      description: "Le Redmi Note 15 Pro offre un ecran AMOLED 6.67 pouces, un processeur Snapdragon performant et un appareil photo 200MP.",
      specs: { display: '6.67" AMOLED, 120Hz, 1080x2400', processor: "Snapdragon 7s Gen 2", camera: "200MP + 8MP + 2MP arriere, 16MP avant", battery: "5100 mAh, charge rapide 67W", os: "Android 14, MIUI 15" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [
      { ram: "8", storage: "256", price: 950, isDefault: true },
      { ram: "12", storage: "512", price: 1050, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Redmi Note 15", slug: "redmi-note-15", brandId: 5, categoryId: CAT,
      imageFile: "redmi-note-15.jpg",
      description: "Le Redmi Note 15 offre un excellent rapport qualite-prix avec son ecran AMOLED 6.67 pouces et sa charge rapide 33W.",
      specs: { display: '6.67" AMOLED, 120Hz, 1080x2400', processor: "Snapdragon 4 Gen 2", camera: "108MP + 2MP arriere, 16MP avant", battery: "5100 mAh, charge rapide 33W", os: "Android 14, MIUI 15" },
      colors: ["Noir", "Bleu", "Vert Foret"],
    },
    [
      { ram: "6", storage: "128", price: 690, isDefault: true },
      { ram: "8", storage: "128", price: 740, isDefault: false },
      { ram: "8", storage: "256", price: 780, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Redmi Note 14 Pro+", slug: "redmi-note-14-pro-plus", brandId: 5, categoryId: CAT,
      imageFile: "redmi-note-14-pro-plus.jpg",
      description: "Le Redmi Note 14 Pro+ excelle avec son capteur 200MP, son ecran AMOLED 6.67 pouces et sa charge rapide 120W.",
      specs: { display: '6.67" AMOLED, 120Hz, 1220x2712', processor: "Snapdragon 7s Gen 2", camera: "200MP + 8MP + 2MP arriere, 16MP avant", battery: "5110 mAh, charge rapide 120W", os: "Android 14, MIUI 15" },
      colors: ["Noir", "Bleu", "Violet"],
    },
    [
      { ram: "8", storage: "256", price: 1120, isDefault: true },
      { ram: "12", storage: "512", price: 1250, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Redmi Note 14 Pro 5G", slug: "redmi-note-14-pro-5g", brandId: 5, categoryId: CAT,
      imageFile: "redmi-note-14-pro-5g.jpg",
      description: "Le Redmi Note 14 Pro 5G offre la connectivite 5G avec un ecran AMOLED 6.67 pouces et un appareil photo 50MP OIS.",
      specs: { display: '6.67" AMOLED, 120Hz, 1080x2400', processor: "Dimensity 7300 Ultra", camera: "50MP OIS + 8MP + 2MP arriere, 16MP avant", battery: "5110 mAh, charge rapide 45W", os: "Android 14, MIUI 15" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [{ ram: "8", storage: "256", price: 1020, isDefault: true }]
  );

  await addProduct(
    {
      name: "Redmi Note 14 Pro", slug: "redmi-note-14-pro", brandId: 5, categoryId: CAT,
      imageFile: "redmi-note-14-pro.jpg",
      description: "Le Redmi Note 14 Pro combine un ecran AMOLED 6.67 pouces incurve et un appareil photo 200MP a un prix attractif.",
      specs: { display: '6.67" AMOLED, 120Hz, 1080x2400', processor: "Helio G99 Ultra", camera: "200MP + 8MP + 2MP arriere, 16MP avant", battery: "5500 mAh, charge rapide 33W", os: "Android 14, MIUI 15" },
      colors: ["Noir", "Violet", "Vert Olive"],
    },
    [
      { ram: "8", storage: "256", price: 850, isDefault: true },
      { ram: "12", storage: "512", price: 980, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Redmi Note 14", slug: "redmi-note-14", brandId: 5, categoryId: CAT,
      imageFile: "redmi-note-14.jpg",
      description: "Le Redmi Note 14 est un smartphone polyvalent avec un ecran AMOLED 6.67 pouces et un appareil photo 108MP.",
      specs: { display: '6.67" AMOLED, 120Hz, 1080x2400', processor: "Helio G99 Ultra", camera: "108MP + 2MP arriere, 16MP avant", battery: "5110 mAh, charge rapide 33W", os: "Android 14, MIUI 15" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [
      { ram: "6", storage: "128", price: 590, isDefault: true },
      { ram: "8", storage: "128", price: 620, isDefault: false },
      { ram: "8", storage: "256", price: 680, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Redmi 15", slug: "redmi-15", brandId: 5, categoryId: CAT,
      imageFile: "redmi-15.jpg",
      description: "Le Redmi 15 offre un ecran 6.72 pouces, une batterie 5200 mAh et un design moderne a un prix accessible.",
      specs: { display: '6.72" IPS LCD, 90Hz, 1080x2400', processor: "Helio G100", camera: "50MP + 2MP arriere, 8MP avant", battery: "5200 mAh, charge rapide 33W", os: "Android 14, MIUI 15" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [
      { ram: "6", storage: "128", price: 550, isDefault: true },
      { ram: "8", storage: "256", price: 620, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Redmi 15C", slug: "redmi-15c", brandId: 5, categoryId: CAT,
      imageFile: "redmi-15c.jpg",
      description: "Le Redmi 15C est un smartphone economique fiable avec un grand ecran 6.72 pouces et une batterie longue duree.",
      specs: { display: '6.72" IPS LCD, 90Hz, 720x1650', processor: "Helio G85", camera: "50MP arriere, 5MP avant", battery: "5160 mAh, charge rapide 18W", os: "Android 14, MIUI 15" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [
      { ram: "4", storage: "128", price: 480, isDefault: true },
      { ram: "6", storage: "128", price: 500, isDefault: false },
      { ram: "8", storage: "256", price: 550, isDefault: false },
    ]
  );

  await addProduct(
    {
      name: "Redmi A5", slug: "redmi-a5", brandId: 5, categoryId: CAT,
      imageFile: "redmi-a5.jpg",
      description: "Le Redmi A5 est le smartphone le plus accessible de Redmi avec des fonctionnalites essentielles et une batterie de 5000 mAh.",
      specs: { display: '6.7" IPS LCD, 60Hz, 720x1600', processor: "Helio A22", camera: "13MP arriere, 5MP avant", battery: "5000 mAh, charge 10W", os: "Android 14 Go, MIUI 15" },
      colors: ["Noir", "Bleu", "Vert"],
    },
    [{ ram: "3", storage: "64", price: 380, isDefault: true }]
  );

  // ── XIAOMI (brand_id = 6) ──
  await addProduct(
    {
      name: "Xiaomi 14T Pro", slug: "xiaomi-14t-pro", brandId: 6, categoryId: CAT,
      imageFile: "xiaomi-14t-pro.jpg",
      description: "Le Xiaomi 14T Pro est un flagship avec ecran AMOLED 6.67 pouces, processeur Dimensity 9300+ et optique Leica pour des photos professionnelles.",
      specs: { display: '6.67" AMOLED, 144Hz, 1220x2712', processor: "Dimensity 9300+", camera: "50MP Leica + 50MP telephoto + 12MP ultra-wide, 32MP avant", battery: "5000 mAh, charge rapide 120W", os: "Android 14, HyperOS" },
      colors: ["Noir Titane", "Bleu Titane", "Gris Titane"],
      isFeatured: true, badge: "Premium",
    },
    [{ ram: "12", storage: "1", storageUnit: "TB", price: 1950, isDefault: true }]
  );

  await addProduct(
    {
      name: "Xiaomi 15T", slug: "xiaomi-15t", brandId: 6, categoryId: CAT,
      imageFile: "xiaomi-15t.jpg",
      description: "Le Xiaomi 15T offre des performances de pointe avec le Snapdragon 8 Gen 3, un ecran AMOLED 6.67 pouces et une optique Leica.",
      specs: { display: '6.67" AMOLED, 144Hz, 1220x2712', processor: "Snapdragon 8 Gen 3", camera: "50MP Leica + 50MP telephoto + 12MP ultra-wide, 32MP avant", battery: "5100 mAh, charge rapide 90W", os: "Android 15, HyperOS 2" },
      colors: ["Noir", "Bleu", "Vert"],
      isFeatured: true,
    },
    [{ ram: "12", storage: "512", price: 1600, isDefault: true }]
  );

  // ── Admin User ──
  console.log("  Inserting admin user...");
  const passwordHash = bcrypt.hashSync("admin123", 10);
  await db.insert(schema.adminUsers).values({
    username: "admin",
    passwordHash,
    displayName: "Administrateur",
  });

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
