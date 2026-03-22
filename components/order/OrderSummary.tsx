import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/lib/cart-context";

interface OrderSummaryProps {
  items: CartItem[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 7;
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
      <h2 className="font-bold text-lg text-gray-900 mb-4">
        Resume de la commande
      </h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3">
            <div className="relative w-16 h-16 bg-white rounded-md overflow-hidden shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.productName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                {item.productName}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{item.variantLabel}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">
                  Qte: {item.quantity}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Sous-total</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Livraison</span>
          <span className="text-gray-900">{formatPrice(shipping)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex items-center justify-between font-bold">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900 text-lg">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
