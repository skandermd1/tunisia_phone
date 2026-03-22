"use client";

import Link from "next/link";
import {
  Menu,
  ChevronDown,
  Heart,
  ArrowLeftRight,
  ShoppingCart,
  User,
} from "lucide-react";

export default function NavBar() {
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
            <Heart size={16} />
            Favoris
          </Link>
          <Link href="/produits" className="hidden sm:flex items-center gap-1.5 hover:text-forest hover:underline transition-colors">
            <ArrowLeftRight size={16} />
            Comparer
          </Link>
          <Link href="/commande" className="flex items-center gap-1.5 hover:text-forest hover:underline transition-colors">
            <ShoppingCart size={16} />
            Mon Panier
          </Link>
          <a href="#" className="flex items-center gap-1.5 hover:text-forest hover:underline transition-colors">
            <User size={16} />
            <span className="hidden sm:inline">Connexion/Inscription</span>
          </a>
        </div>
      </div>
    </div>
  );
}
