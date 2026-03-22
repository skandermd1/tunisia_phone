"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrder } from "@/lib/api";
import OrderForm, { type OrderFormData } from "@/components/order/OrderForm";
import OrderSummary from "@/components/order/OrderSummary";
import EmptyState from "@/components/ui/EmptyState";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CommandeContent() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        message="Votre panier est vide. Ajoutez des produits depuis notre catalogue."
      />
    );
  }

  async function handleSubmit(formData: OrderFormData) {
    setSubmitting(true);
    setError(null);

    try {
      const res = await createOrder({
        ...formData,
        items: items.map((item) => ({
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
      });
      clearCart();
      router.push(
        `/commande/confirmation?order=${encodeURIComponent(res.order_number)}`
      );
    } catch {
      setError("Une erreur est survenue. Veuillez reessayer.");
      setSubmitting(false);
    }
  }

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
        <OrderSummary items={items} />
      </div>
    </div>
  );
}
