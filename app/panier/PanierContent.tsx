"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function PanierContent() {
  const { items, removeItem, updateQuantity, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">Votre panier est vide</p>
        <Link
          href="/produits"
          className="inline-block bg-forest hover:bg-forest-light text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-colors"
        >
          Parcourir les produits
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 7;
  const total = subtotal + shipping;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.variantId}
            className="flex gap-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="relative w-20 h-20 bg-gray-50 rounded-md overflow-hidden shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.productName}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/produits/${item.productSlug}`}
                className="font-semibold text-sm text-gray-900 hover:text-forest line-clamp-1"
              >
                {item.productName}
              </Link>
              <p className="text-xs text-gray-500 mt-0.5">{item.variantLabel}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold text-sm text-gray-900">
                  {formatPrice(item.price)}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(item.originalPrice)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-gray-200 rounded-md">
                  <button
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity + 1)
                    }
                    className="px-2 py-1 text-gray-500 hover:text-gray-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 sticky top-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">
            Resume ({itemCount} article{itemCount > 1 ? "s" : ""})
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sous-total</span>
              <span className="text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Livraison</span>
              <span className="text-gray-900">{formatPrice(shipping)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900 text-lg">{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/commande"
            className="block text-center w-full mt-4 bg-forest hover:bg-forest-light text-white py-3 rounded-md text-sm font-semibold transition-colors"
          >
            Passer la commande
          </Link>
          <Link
            href="/produits"
            className="block text-center w-full mt-2 text-sm text-forest hover:underline"
          >
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  );
}
