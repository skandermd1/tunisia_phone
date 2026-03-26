"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Brand, Category } from "@/lib/types";
import { VALID_PRODUCT_PARAMS } from "@/lib/api";

interface ProductFiltersProps {
  brands: Brand[];
  categories: Category[];
}

export default function ProductFilters({
  brands,
  categories,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedBrands = searchParams.get("brand")?.split(",").filter(Boolean) ?? [];
  const selectedCategories = searchParams.get("category")?.split(",").filter(Boolean) ?? [];
  const minPrice = searchParams.get("min_price") ?? "";
  const maxPrice = searchParams.get("max_price") ?? "";

  // Debounced local state for price inputs
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync URL → local when URL params change externally (e.g. clear filters)
  useEffect(() => { setLocalMinPrice(minPrice); }, [minPrice]);
  useEffect(() => { setLocalMaxPrice(maxPrice); }, [maxPrice]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams();
      // Only copy valid params, stripping garbage keys
      searchParams.forEach((value, key) => {
        if (VALID_PRODUCT_PARAMS.has(key) && value) {
          params.set(key, value);
        }
      });
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Reset to page 1 on filter change
      params.delete("page");
      router.push(`/produits?${params.toString()}`);
    },
    [router, searchParams]
  );

  function updatePriceDebounced(key: "min_price" | "max_price", value: string) {
    if (key === "min_price") setLocalMinPrice(value);
    else setLocalMaxPrice(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ [key]: value || null });
    }, 500);
  }

  function toggleFilter(key: "brand" | "category", slug: string) {
    const current = key === "brand" ? selectedBrands : selectedCategories;
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    updateParams({ [key]: next.length > 0 ? next.join(",") : null });
  }

  function clearAll() {
    router.push("/produits");
  }

  const hasFilters =
    selectedBrands.length > 0 ||
    selectedCategories.length > 0 ||
    minPrice ||
    maxPrice;

  const filterContent = (
    <>
      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-sm text-forest underline underline-offset-2 mb-4 hover:text-forest-light transition-colors"
        >
          Effacer les filtres
        </button>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label
                key={cat.slug}
                className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleFilter("category", cat.slug)}
                  className="rounded border-gray-300 text-forest focus:ring-forest"
                />
                <span className="flex-1">{cat.name}</span>
                {cat.product_count !== undefined && (
                  <span className="text-xs text-gray-400">
                    ({cat.product_count})
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">
            Marques
          </h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label
                key={brand.slug}
                className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={() => toggleFilter("brand", brand.slug)}
                  className="rounded border-gray-300 text-forest focus:ring-forest"
                />
                <span className="flex-1">{brand.name}</span>
                {brand.product_count !== undefined && (
                  <span className="text-xs text-gray-400">
                    ({brand.product_count})
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">
          Prix (DT)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localMinPrice}
            onChange={(e) => updatePriceDebounced("min_price", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-forest"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={localMaxPrice}
            onChange={(e) => updatePriceDebounced("max_price", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-forest"
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4"
      >
        <SlidersHorizontal size={16} />
        Filtres
        {hasFilters && (
          <span className="ml-1 w-5 h-5 bg-forest text-white text-xs rounded-full flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-gray-900">Filtres</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">{filterContent}</aside>
    </>
  );
}
