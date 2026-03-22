"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProduct, createOrder } from "@/lib/api";
import type { Product, ProductVariant } from "@/lib/types";
import OrderForm, { type OrderFormData } from "@/components/order/OrderForm";
import OrderSummary from "@/components/order/OrderSummary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { ShoppingCart } from "lucide-react";

export default function CommandeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const variantId = searchParams.get("variant");
  const productSlug = searchParams.get("product");

  const [product, setProduct] = useState<Product | null>(null);
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productSlug || !variantId) {
      setLoading(false);
      return;
    }

    getProduct(productSlug)
      .then((res) => {
        setProduct(res);
        const v = res.variants?.find(
          (v) => v.id === Number(variantId)
        );
        setVariant(v || null);
      })
      .catch(() => {
        setError("Impossible de charger le produit.");
      })
      .finally(() => setLoading(false));
  }, [productSlug, variantId]);

  async function handleSubmit(formData: OrderFormData) {
    if (!variant) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await createOrder({
        ...formData,
        items: [{ variant_id: variant.id, quantity: 1 }],
      });
      router.push(
        `/commande/confirmation?order=${encodeURIComponent(res.order_number)}`
      );
    } catch {
      setError("Une erreur est survenue. Veuillez reessayer.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Chargement..." />;
  }

  if (!productSlug || !variantId || !product || !variant) {
    return (
      <EmptyState
        icon={ShoppingCart}
        message="Aucun produit selectionne. Veuillez choisir un produit depuis notre catalogue."
      />
    );
  }

  const variantLabel = [variant.ram, `${variant.storage}${variant.storage_unit}`]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Form */}
      <div className="lg:col-span-3">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}
        <OrderForm onSubmit={handleSubmit} loading={submitting} />
      </div>

      {/* Summary */}
      <div className="lg:col-span-2">
        <OrderSummary
          productName={product.name}
          productImage={product.image_url}
          variantLabel={variantLabel}
          price={variant.price}
          originalPrice={variant.original_price}
        />
      </div>
    </div>
  );
}
