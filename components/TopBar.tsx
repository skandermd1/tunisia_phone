"use client";

import { Phone, ChevronDown } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-forest text-white text-sm">
      <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-10">
        {/* Left - Phone */}
        <div className="flex items-center gap-2">
          <Phone size={14} />
          <a href="tel:+21612345678" className="hover:underline">
            +216 12 345 678
          </a>
        </div>

        {/* Center - Promo */}
        <div className="hidden md:flex items-center gap-1">
          <span>🎉</span>
          <span>
            Obtenez <strong>50% de réduction</strong> sur les articles sélectionnés |{" "}
            <a href="#" className="underline font-semibold">
              Achetez Maintenant
            </a>
          </span>
        </div>

        {/* Right - Selectors */}
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <button className="flex items-center gap-1 hover:opacity-80">
            🇹🇳 Tunisie <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-1 hover:opacity-80">
            TND <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-1 hover:opacity-80">
            Français <ChevronDown size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
