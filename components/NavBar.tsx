"use client";

import Link from "next/link";
import {
  Menu,
  ChevronDown,
  ArrowLeftRight,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function NavBar() {
  const { itemCount } = useCart();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-12">
        {/* Left - All Categories */}
        <Link
          href="/produits"
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-forest hover:underline transition-colors"
        >
          <Menu size={18} />
          Toutes les categories
        </Link>

        {/* Center - Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="flex items-center gap-1 hover:text-forest hover:underline transition-colors font-medium text-gray-900">
            Accueil <ChevronDown size={14} />
          </Link>
          <Link href="/produits" className="hover:text-forest hover:underline transition-colors">
            Produits
          </Link>
          <Link href="/suivi" className="hover:text-forest hover:underline transition-colors">
            Suivi
          </Link>
        </nav>

        {/* Right - Actions */}
        <div className="flex items-center gap-5 text-sm text-gray-600">
          <Link href="/produits" className="hidden sm:flex items-center gap-1.5 hover:text-forest hover:underline transition-colors">
            <ArrowLeftRight size={16} />
            Comparer
          </Link>
          <Link href="/panier" className="relative flex items-center gap-1.5 hover:text-forest hover:underline transition-colors">
            <ShoppingCart size={16} />
            Mon Panier
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-forest text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
