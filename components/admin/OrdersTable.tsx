'use client';

import StatusBadge from './StatusBadge';
import type { Order } from '@/lib/admin-api';

interface OrdersTableProps {
  orders: Order[];
  onRowClick?: (order: Order) => void;
}

export default function OrdersTable({ orders, onRowClick }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucune commande trouvee.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Telephone</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => onRowClick?.(order)}
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.order_number}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{order.customer_name}</td>
              <td className="py-3 px-4 text-sm text-gray-700 hidden sm:table-cell">{order.customer_phone}</td>
              <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.total.toFixed(2)} DT</td>
              <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
              <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">
                {new Date(order.created_at).toLocaleDateString('fr-TN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
