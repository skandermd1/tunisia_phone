"use client";

import {
  Smartphone,
  Headphones,
  BatteryCharging,
  ShieldCheck,
  Cable,
  Watch,
  Tablet,
} from "lucide-react";

const categories = [
  { name: "Téléphones", icon: Smartphone, color: "bg-gray-100" },
  { name: "AirPods", icon: Headphones, color: "bg-gray-100" },
  { name: "Chargeurs", icon: BatteryCharging, color: "bg-gray-100" },
  { name: "Coques", icon: ShieldCheck, color: "bg-gray-100" },
  { name: "Câbles", icon: Cable, color: "bg-gray-100" },
  { name: "Montres", icon: Watch, color: "bg-gray-100" },
  { name: "Tablettes", icon: Tablet, color: "bg-gray-100" },
];

export default function CategorySection() {
  return (
    <section className="bg-cream-dark">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Choisir par Catégorie
          </h2>
          <a
            href="#"
            className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-forest transition-colors"
          >
            Tout Parcourir
          </a>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 md:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.name}
                href="#"
                className="flex flex-col items-center gap-3 group"
              >
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${cat.color} flex items-center justify-center group-hover:shadow-md transition-shadow`}
                >
                  <Icon
                    size={28}
                    className="text-gray-700 group-hover:text-forest transition-colors"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-forest transition-colors">
                  {cat.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
