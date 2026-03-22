"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo.png"
                alt="Tunisia Phone - Mobile & Accessoires"
                width={200}
                height={50}
                className="h-12 w-auto rounded"
              />
            </div>
            <p className="text-sm leading-6 text-gray-400">
              Votre boutique de confiance pour téléphones et accessoires en Tunisie. Produits de qualité, meilleurs prix, livraison rapide.
            </p>
            <div className="flex flex-col gap-2 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>+216 12 345 678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>contact@tunisiaphone.tn</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>Tunis, Tunisie</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#" className="hover:text-white transition-colors">À Propos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Produits</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Smartphones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AirPods & Écouteurs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chargeurs & Câbles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Coques de Téléphone</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tablettes</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Service Client</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Suivi de Commande</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Retours & Échanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Infos Livraison</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          &copy; 2026 Tunisia Phone. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
