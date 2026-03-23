"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShoppingCart, Check } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import VariantSelector from "@/components/products/VariantSelector";
import ProductSpecs from "@/components/products/ProductSpecs";
import { useCart } from "@/lib/cart-context";

const colorMap: Record<string, string> = {
  "Noir": "#1a1a1a",
  "Bleu": "#2563eb",
  "Lilas": "#c084fc",
  "Vert": "#16a34a",
  "Bleu Clair": "#7dd3fc",
  "Jaune": "#facc15",
  "Or": "#d4a017",
  "Noir Titane": "#2d2d2d",
  "Bleu Titane": "#4a6d8c",
  "Gris Titane": "#8a8d8f",
  "Argent Titane": "#c0c0c0",
  "Vert Titane": "#4a6d5c",
  "Vert Menthe": "#3eb489",
  "Bleu Marine": "#001f5b",
  "Argent": "#c0c0c0",
  "Noir Volcanique": "#36393b",
  "Bleu Glacier": "#6ba3be",
  "Rose": "#f472b6",
  "Bleu Ocean": "#0077b6",
  "Violet": "#7c3aed",
  "Orange": "#f97316",
  "Blanc": "#ffffff",
  "Bleu Etoile": "#1e3a5f",
  "Titanium": "#878681",
  "Bleu Ciel": "#87ceeb",
  "Vert Foret": "#228b22",
  "Vert Olive": "#6b8e23",
};

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
  const { addItem, items } = useCart();

  const isInCart = selectedVariant
    ? items.some((i) => i.variantId === selectedVariant.id)
    : false;

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
              quality={90}
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
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <div key={color} className="flex flex-col items-center gap-1">
                    <span
                      className={`w-7 h-7 rounded-full border-2 ${color === "Blanc" ? "border-gray-300" : "border-gray-200"}`}
                      style={{ backgroundColor: colorMap[color] || color }}
                      title={color}
                    />
                    <span className="text-xs text-gray-500">{color}</span>
                  </div>
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

          {/* Add to Cart button */}
          {selectedVariant && (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (selectedVariant.stock_status === "out_of_stock") return;
                  const variantLabel = [selectedVariant.ram, `${selectedVariant.storage}${selectedVariant.storage_unit}`]
                    .filter(Boolean)
                    .join(" / ");
                  addItem({
                    variantId: selectedVariant.id,
                    productSlug: product.slug,
                    productName: product.name,
                    variantLabel,
                    price: selectedVariant.price,
                    originalPrice: selectedVariant.original_price,
                    imageUrl: product.image_url,
                  });
                }}
                disabled={selectedVariant.stock_status === "out_of_stock"}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-semibold transition-colors ${
                  selectedVariant.stock_status === "out_of_stock"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isInCart
                      ? "bg-forest text-white"
                      : "bg-forest hover:bg-forest-light text-white"
                }`}
              >
                {isInCart ? (
                  <>
                    <Check size={16} />
                    Ajouté au panier
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Ajouter au panier
                  </>
                )}
              </button>
            </div>
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
