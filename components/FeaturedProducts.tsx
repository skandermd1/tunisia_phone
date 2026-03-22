"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: 1, per_page: 8 })
      .then((res) => setProducts(res.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Produits en Vedette
          </h2>
          <Link
            href="/produits"
            className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-forest transition-colors"
          >
            Voir Tout
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Chargement des produits..." />
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            Aucun produit en vedette pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
