"use client";

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
        <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-forest transition-colors">
          <Menu size={18} />
          Toutes les catégories
        </button>

        {/* Center - Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#" className="flex items-center gap-1 hover:text-forest transition-colors font-medium text-gray-900">
            Accueil <ChevronDown size={14} />
          </a>
          <a href="#" className="hover:text-forest transition-colors">À propos</a>
          <a href="#" className="hover:text-forest transition-colors">Produits</a>
          <a href="#" className="hover:text-forest transition-colors">Blog</a>
          <a href="#" className="hover:text-forest transition-colors">Autres</a>
        </nav>

        {/* Right - Actions */}
        <div className="flex items-center gap-5 text-sm text-gray-600">
          <a href="#" className="hidden sm:flex items-center gap-1.5 hover:text-forest transition-colors">
            <Heart size={16} />
            Favoris
          </a>
          <a href="#" className="hidden sm:flex items-center gap-1.5 hover:text-forest transition-colors">
            <ArrowLeftRight size={16} />
            Comparer
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-forest transition-colors">
            <ShoppingCart size={16} />
            Mon Panier
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-forest transition-colors">
            <User size={16} />
            <span className="hidden sm:inline">Connexion/Inscription</span>
          </a>
        </div>
      </div>
    </div>
  );
}
