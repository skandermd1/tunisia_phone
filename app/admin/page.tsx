'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Clock, DollarSign, Package } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import OrdersTable from '@/components/admin/OrdersTable';
import { adminGetDashboard } from '@/lib/admin-api';
import type { Order } from '@/lib/admin-api';

interface DashboardData {
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  total_products: number;
  recent_orders: Order[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    adminGetDashboard(token)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Chargement du tableau de bord...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Commandes"
          value={data.total_orders}
          icon={ShoppingCart}
          color="bg-forest"
        />
        <StatsCard
          title="Commandes en attente"
          value={data.pending_orders}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatsCard
          title="Revenus total"
          value={`${data.total_revenue.toFixed(2)} DT`}
          icon={DollarSign}
          color="bg-green-600"
        />
        <StatsCard
          title="Total Produits"
          value={data.total_products}
          icon={Package}
          color="bg-blue-600"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Commandes recentes</h2>
        </div>
        <OrdersTable
          orders={data.recent_orders}
          onRowClick={(order) => router.push(`/admin/commandes/${order.id}`)}
        />
      </div>
    </div>
  );
}
