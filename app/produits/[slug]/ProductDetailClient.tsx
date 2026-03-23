"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import VariantSelector from "@/components/products/VariantSelector";
import ProductSpecs from "@/components/products/ProductSpecs";

export default function ProductDetailClient({
  product,
}: {
  product: Product;
}) {
  const defaultVariant =
    product.variants?.find((v) => v.is_default) || product.variants?.[0];
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(defaultVariant || null);
  const [selectedImage, setSelectedImage] = useState(0);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image_url];

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-forest transition-colors">
          Accueil
        </Link>
        <ChevronRight size={14} />
        <Link href="/produits" className="hover:text-forest transition-colors">
          Produits
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium line-clamp-1">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left - Images */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-forest text-white text-xs font-semibold px-3 py-1 rounded">
                {product.badge}
              </span>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden shrink-0 border-2 transition-colors ${
                    i === selectedImage
                      ? "border-forest"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right - Details */}
        <div className="space-y-5">
          {/* Brand */}
          <div>
            <span className="inline-block text-xs uppercase tracking-wide text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
              {product.brand.name}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          {/* Category */}
          <p className="text-sm text-gray-500">
            Categorie:{" "}
            <Link
              href={`/produits?category=${product.category.slug}`}
              className="text-forest hover:underline"
            >
              {product.category.name}
            </Link>
          </p>

          {/* Price */}
          {selectedVariant && (
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(selectedVariant.price)}
              </span>
              {selectedVariant.original_price > selectedVariant.price && (
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(selectedVariant.original_price)}
                </span>
              )}
              {selectedVariant.stock_status === "in_stock" ? (
                <span className="text-xs text-green-600 font-medium">
                  En stock
                </span>
              ) : (
                <span className="text-xs text-red-500 font-medium">
                  Rupture de stock
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">
                Couleurs disponibles
              </h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="w-7 h-7 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selectedId={selectedVariant?.id ?? null}
              onSelect={setSelectedVariant}
            />
          )}

          {/* Commander button */}
          {selectedVariant && (
            <Link
              href={`/commande?variant=${selectedVariant.id}&product=${product.slug}`}
              className={`block text-center w-full py-3 rounded-md text-sm font-semibold transition-colors ${
                selectedVariant.stock_status === "out_of_stock"
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                  : "bg-forest hover:bg-forest-light text-white"
              }`}
            >
              Commander
            </Link>
          )}

          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <ProductSpecs specs={product.specs} />
          )}
        </div>
      </div>
    </div>
  );
}
