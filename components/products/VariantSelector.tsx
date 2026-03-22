"use client";

import { formatPrice } from "@/lib/utils";
import type { ProductVariant } from "@/lib/types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedId: number | null;
  onSelect: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-900 text-sm mb-3">
        Choisir une variante
      </h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedId;
          const outOfStock = variant.stock_status === "out_of_stock";
          const label = [variant.ram, `${variant.storage}${variant.storage_unit}`]
            .filter(Boolean)
            .join(" / ");

          return (
            <button
              key={variant.id}
              onClick={() => !outOfStock && onSelect(variant)}
              disabled={outOfStock}
              className={`px-4 py-2.5 rounded-md border text-sm font-medium transition-colors ${
                isSelected
                  ? "border-forest bg-forest text-white"
                  : outOfStock
                    ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 hover:border-forest hover:text-forest"
              }`}
            >
              <span className="block">{label}</span>
              <span className="block text-xs mt-0.5">
                {formatPrice(variant.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
