/**
 * Non-destructive migration: adds new brands and categories.
 * Safe to run multiple times — uses onConflictDoNothing() so existing rows are untouched.
 *
 * Run with:  npx tsx db/seed-more.ts
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seedMore() {
  console.log("Adding new brands and categories (safe, non-destructive)...\n");

  // ── New Brands ──────────────────────────────────────────────────
  console.log("  Adding brands...");
  const newBrands = [
    { name: "Apple",      slug: "apple",      sortOrder: 10 },
    { name: "Google",     slug: "google",     sortOrder: 11 },
    { name: "OnePlus",    slug: "oneplus",    sortOrder: 12 },
    { name: "Realme",     slug: "realme",     sortOrder: 13 },
    { name: "Nokia",      slug: "nokia",      sortOrder: 14 },
    { name: "Motorola",   slug: "motorola",   sortOrder: 15 },
    { name: "Sony",       slug: "sony",       sortOrder: 16 },
    { name: "Huawei",     slug: "huawei",     sortOrder: 17 },
    { name: "Vivo",       slug: "vivo",       sortOrder: 18 },
    { name: "Tecno",      slug: "tecno",      sortOrder: 19 },
    { name: "Itel",       slug: "itel",       sortOrder: 20 },
    { name: "Asus",       slug: "asus",       sortOrder: 21 },
    { name: "Nothing",    slug: "nothing",    sortOrder: 22 },
    { name: "Blackview",  slug: "blackview",  sortOrder: 23 },
    { name: "ZTE",        slug: "zte",        sortOrder: 24 },
    { name: "Alcatel",    slug: "alcatel",    sortOrder: 25 },
    { name: "Wiko",       slug: "wiko",       sortOrder: 26 },
    { name: "TCL",        slug: "tcl",        sortOrder: 27 },
    { name: "Poco",       slug: "poco",       sortOrder: 28 },
    { name: "Lenovo",     slug: "lenovo",     sortOrder: 29 },
    { name: "HTC",        slug: "htc",        sortOrder: 30 },
    { name: "iQOO",       slug: "iqoo",       sortOrder: 31 },
    { name: "Doogee",     slug: "doogee",     sortOrder: 32 },
    { name: "Ulefone",    slug: "ulefone",    sortOrder: 33 },
    { name: "Fairphone",  slug: "fairphone",  sortOrder: 34 },
  ];

  const brandResult = await db
    .insert(schema.brands)
    .values(newBrands)
    .onConflictDoNothing();
  console.log(`  ✓ Brands processed (${newBrands.length} attempted)`);

  // ── New Categories ───────────────────────────────────────────────
  console.log("  Adding categories...");
  const newCategories = [
    { name: "Protection d'ecran",        slug: "vitre-trempe",        icon: "shield-check",   sortOrder: 10 },
    { name: "Ecouteurs filaires",         slug: "ecouteurs-filaires",  icon: "headphones",     sortOrder: 11 },
    { name: "Haut-parleurs Bluetooth",   slug: "enceintes-bluetooth", icon: "speaker",        sortOrder: 12 },
    { name: "Powerbanks",                slug: "powerbanks",          icon: "battery-full",   sortOrder: 13 },
    { name: "Cartes memoire",            slug: "cartes-memoire",      icon: "memory-stick",   sortOrder: 14 },
    { name: "Montres connectees",        slug: "montres-connectees",  icon: "watch",          sortOrder: 15 },
    { name: "Bracelets connectes",       slug: "bracelets-connectes", icon: "activity",       sortOrder: 16 },
    { name: "Supports telephone",        slug: "supports",            icon: "layout",         sortOrder: 17 },
    { name: "Adaptateurs",              slug: "adaptateurs",         icon: "plug",           sortOrder: 18 },
    { name: "Cles USB",                  slug: "cles-usb",            icon: "usb",            sortOrder: 19 },
    { name: "Hubs USB",                  slug: "hubs-usb",            icon: "git-branch",     sortOrder: 20 },
    { name: "Stylets",                   slug: "stylets",             icon: "pen-tool",       sortOrder: 21 },
    { name: "Chargeurs sans fil",        slug: "chargeurs-sans-fil",  icon: "wifi",           sortOrder: 22 },
    { name: "Batteries de rechange",     slug: "batteries",           icon: "battery",        sortOrder: 23 },
    { name: "Accessoires gaming",        slug: "gaming",              icon: "gamepad-2",      sortOrder: 24 },
    { name: "Etuis et Sacs",            slug: "etuis-sacs",          icon: "briefcase",      sortOrder: 25 },
    { name: "Perches a selfie",          slug: "selfie-sticks",       icon: "camera",         sortOrder: 26 },
    { name: "Anneaux et PopSockets",     slug: "anneaux",             icon: "circle",         sortOrder: 27 },
    { name: "Cables Lightning",          slug: "cables-lightning",    icon: "zap",            sortOrder: 28 },
    { name: "Cables USB-C",             slug: "cables-usbc",         icon: "zap",            sortOrder: 29 },
  ];

  await db
    .insert(schema.categories)
    .values(newCategories)
    .onConflictDoNothing();
  console.log(`  ✓ Categories processed (${newCategories.length} attempted)`);

  console.log("\nDone! Summary:");
  console.log(`  • ${newBrands.length} new brands added (Apple, Google, OnePlus, Realme, Nokia, Motorola, Sony, Huawei, Vivo, Tecno, Itel, Asus, Nothing, Blackview, ZTE, Alcatel, Wiko, TCL, Poco, Lenovo, HTC, iQOO, Doogee, Ulefone, Fairphone)`);
  console.log(`  • ${newCategories.length} new categories added`);
  console.log("\nTotal options available:");
  console.log("  • 31 brands (6 original + 25 new)");
  console.log("  • 27 categories (7 original + 20 new)");
}

seedMore()
  .then(() => {
    console.log("\nMigration complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
