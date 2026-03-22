'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OrdersTable from '@/components/admin/OrdersTable';
import { adminGetOrders } from '@/lib/admin-api';
import type { Order } from '@/lib/admin-api';

const STATUS_TABS = [
  { key: '', label: 'Toutes' },
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Confirmees' },
  { key: 'processing', label: 'En cours' },
  { key: 'shipped', label: 'Expediees' },
  { key: 'delivered', label: 'Livrees' },
  { key: 'cancelled', label: 'Annulees' },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    let cancelled = false;
    adminGetOrders(token, { page, status: activeStatus || undefined })
      .then((res) => {
        if (!cancelled) {
          setOrders(res.orders);
          setTotalPages(res.total_pages);
        }
      })
      .catch(() => { if (!cancelled) setOrders([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, activeStatus]);

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex flex-wrap gap-1 bg-white rounded-xl border border-gray-200 p-1.5">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleStatusChange(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeStatus === tab.key
                ? 'bg-forest text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">Chargement des commandes...</div>
          </div>
        ) : (
          <OrdersTable
            orders={orders}
            onRowClick={(order) => router.push(`/admin/commandes/${order.id}`)}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Precedent
          </button>
          <span className="text-sm text-gray-600">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
