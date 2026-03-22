import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  productName: string;
  productImage: string;
  variantLabel: string;
  price: number;
  originalPrice?: number;
  quantity?: number;
}

export default function OrderSummary({
  productName,
  productImage,
  variantLabel,
  price,
  originalPrice,
  quantity = 1,
}: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
      <h2 className="font-bold text-lg text-gray-900 mb-4">
        Resume de la commande
      </h2>

      <div className="flex gap-4">
        <div className="relative w-20 h-20 bg-white rounded-md overflow-hidden shrink-0">
          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
            {productName}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{variantLabel}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Quantite: {quantity}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Sous-total</span>
          <span className="text-gray-900">{formatPrice(price * quantity)}</span>
        </div>
        {originalPrice && originalPrice > price && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Economie</span>
            <span className="text-green-600">
              -{formatPrice((originalPrice - price) * quantity)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Livraison</span>
          <span className="text-gray-900">7 DT</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex items-center justify-between font-bold">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900 text-lg">
            {formatPrice(price * quantity + 7)}
          </span>
        </div>
      </div>
    </div>
  );
}
