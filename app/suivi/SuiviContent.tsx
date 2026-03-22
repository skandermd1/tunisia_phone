"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { trackOrder } from "@/lib/api";
import type { Order } from "@/lib/types";
import OrderTracking from "@/components/order/OrderTracking";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SuiviContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") ?? "";

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = orderNumber.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await trackOrder(trimmed);
      setOrder(res);
    } catch {
      setError("Commande introuvable. Verifiez le numero et reessayez.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-search if order number in URL
  useEffect(() => {
    if (initialOrder) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Numero de commande (ex: TP-20260322-XXXX)"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-forest transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !orderNumber.trim()}
          className="bg-forest hover:bg-forest-light text-white px-5 py-2.5 rounded-md flex items-center gap-2 text-sm font-medium shrink-0 transition-colors disabled:opacity-50"
        >
          <Search size={16} />
          Rechercher
        </button>
      </form>

      {/* Results */}
      {loading && <LoadingSpinner message="Recherche en cours..." />}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {order && <OrderTracking order={order} />}
    </div>
  );
}
