"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Headphones,
  BatteryCharging,
  ShieldCheck,
  Cable,
  Watch,
  Tablet,
  Package,
} from "lucide-react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/types";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  smartphone: Smartphone,
  headphones: Headphones,
  battery: BatteryCharging,
  shield: ShieldCheck,
  cable: Cable,
  watch: Watch,
  tablet: Tablet,
};

const FALLBACK_CATEGORIES = [
  { name: "Telephones", slug: "telephones", icon: "smartphone" },
  { name: "AirPods", slug: "airpods", icon: "headphones" },
  { name: "Chargeurs", slug: "chargeurs", icon: "battery" },
  { name: "Coques", slug: "coques", icon: "shield" },
  { name: "Cables", slug: "cables", icon: "cable" },
  { name: "Montres", slug: "montres", icon: "watch" },
  { name: "Tablettes", slug: "tablettes", icon: "tablet" },
];

export default function CategorySection() {
  const [categories, setCategories] = useState<{ name: string; slug: string; icon: string }[]>(
    FALLBACK_CATEGORIES
  );

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res && res.length > 0) {
          setCategories(res.map((c: Category) => ({ name: c.name, slug: c.slug, icon: c.icon })));
        }
      })
      .catch(() => {
        // Keep fallback categories
      });
  }, []);

  return (
    <section className="bg-cream-dark">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Choisir par Categorie
          </h2>
          <Link
            href="/produits"
            className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-forest transition-colors"
          >
            Tout Parcourir
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 md:gap-6">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Package;
            return (
              <Link
                key={cat.slug}
                href={`/produits?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 flex items-center justify-center group-hover:shadow-md transition-shadow">
                  <Icon
                    size={28}
                    className="text-gray-700 group-hover:text-forest transition-colors"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-forest transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
