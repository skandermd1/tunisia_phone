"use client";

import { RotateCcw, CalendarDays, Truck, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/produits?search=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-[72px] gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="Tunisia Phone - Mobile & Accessoires"
            width={200}
            height={50}
            className="h-10 sm:h-12 w-auto"
            priority
          />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="flex">
            <input
              type="text"
              placeholder="Que recherchez-vous"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 border-r-0 rounded-l-md text-sm focus:outline-none focus:border-forest"
            />
            <button
              type="submit"
              className="bg-forest hover:bg-forest-light text-white px-5 py-2.5 rounded-r-md flex items-center gap-2 text-sm font-medium shrink-0 transition-colors"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Rechercher</span>
            </button>
          </div>
        </form>

        {/* Right Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600 shrink-0">
          <Link href="/" className="flex items-center gap-1.5 hover:text-forest hover:underline transition-colors">
            <RotateCcw size={16} />
            Retour
          </Link>
          <Link href="/commande" className="flex items-center gap-1.5 hover:text-forest hover:underline transition-colors">
            <CalendarDays size={16} />
            Commande
          </Link>
          <Link href="/suivi" className="flex items-center gap-1.5 hover:text-forest hover:underline transition-colors">
            <Truck size={16} />
            Suivi de commande
          </Link>
        </div>
      </div>
    </div>
  );
}
