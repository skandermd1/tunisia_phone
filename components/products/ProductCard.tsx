import Image from "next/image";
import Link from "next/link";
import { Palette } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const minPrice =
    product.min_price ??
    Math.min(...product.variants.map((v) => v.price));

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-forest text-white text-xs font-semibold px-2.5 py-1 rounded">
            {product.badge}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand */}
        <span className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          {product.brand.name}
        </span>
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-3 text-xs text-gray-500">
            <Palette size={12} />
            <span>
              {product.colors.length} couleur{product.colors.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(minPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
