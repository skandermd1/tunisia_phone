"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProducts, getCategories, getBrands } from "@/lib/api";
import type { Product, Brand, Category, Pagination as PaginationType } from "@/lib/types";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import PaginationComponent from "@/components/ui/Pagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProductListingContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);

  // Load brands and categories once
  useEffect(() => {
    Promise.all([getCategories(), getBrands()])
      .then(([catRes, brandRes]) => {
        setCategories(catRes.data);
        setBrands(brandRes.data);
      })
      .catch(() => {
        // Silently handle — filters will be empty
      });
  }, []);

  // Load products when search params change
  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    getProducts(params)
      .then((res) => {
        setProducts(res.data);
        setPagination(res.pagination);
      })
      .catch(() => {
        setProducts([]);
        setPagination(null);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    window.history.pushState(null, "", `/produits?${params.toString()}`);
    // Trigger re-render via location change
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <ProductFilters brands={brands} categories={categories} />

      <div className="flex-1">
        {/* Active search */}
        {searchParams.get("search") && (
          <p className="text-sm text-gray-500 mb-4">
            Resultats pour &quot;{searchParams.get("search")}&quot;
          </p>
        )}

        {loading ? (
          <LoadingSpinner message="Chargement..." />
        ) : (
          <>
            <ProductGrid products={products} />
            {pagination && (
              <PaginationComponent
                currentPage={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
