"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <>
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={32} className="text-green-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Commande confirmee !
      </h1>

      <p className="text-gray-600 mb-6">
        Merci pour votre commande. Vous recevrez un appel de confirmation
        sous peu.
      </p>

      {orderNumber && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">
            Numero de commande
          </p>
          <p className="text-xl font-bold text-gray-900">#{orderNumber}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {orderNumber && (
          <Link
            href={`/suivi?order=${encodeURIComponent(orderNumber)}`}
            className="bg-forest hover:bg-forest-light text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-colors"
          >
            Suivre ma commande
          </Link>
        )}
        <Link
          href="/produits"
          className="border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-md text-sm font-semibold transition-colors"
        >
          Continuer les achats
        </Link>
      </div>
    </>
  );
}
