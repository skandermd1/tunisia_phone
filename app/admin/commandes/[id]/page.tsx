'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import { adminGetOrder, adminUpdateOrderStatus } from '@/lib/admin-api';
import type { Order } from '@/lib/admin-api';

const STATUSES = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmee' },
  { value: 'processing', label: 'En cours' },
  { value: 'shipped', label: 'Expediee' },
  { value: 'delivered', label: 'Livree' },
  { value: 'cancelled', label: 'Annulee' },
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    adminGetOrder(token, id)
      .then((data) => {
        setOrder(data);
        setNewStatus(data.status);
      })
      .catch(() => setMessage('Erreur lors du chargement de la commande'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveStatus = async () => {
    if (!order || newStatus === order.status) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setSaving(true);
    setMessage('');
    try {
      const updated = await adminUpdateOrderStatus(token, order.id, newStatus);
      setOrder(updated);
      setMessage('Statut mis a jour avec succes');
    } catch {
      setMessage('Erreur lors de la mise a jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Commande introuvable</p>
        <Link href="/admin/commandes" className="text-forest hover:underline">
          Retour aux commandes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/commandes" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-forest">
        <ArrowLeft size={16} /> Retour aux commandes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Commande #{order.order_number}</h2>
              <StatusBadge status={order.status} />
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Client</dt>
                <dd className="font-medium text-gray-900">{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Telephone</dt>
                <dd className="font-medium text-gray-900">{order.customer_phone}</dd>
              </div>
              {order.customer_email && (
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-900">{order.customer_email}</dd>
                </div>
              )}
              {order.customer_address && (
                <div>
                  <dt className="text-gray-500">Adresse</dt>
                  <dd className="font-medium text-gray-900">{order.customer_address}</dd>
                </div>
              )}
              {order.customer_city && (
                <div>
                  <dt className="text-gray-500">Ville</dt>
                  <dd className="font-medium text-gray-900">{order.customer_city}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Date</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(order.created_at).toLocaleString('fr-TN')}
                </dd>
              </div>
            </dl>
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Notes</p>
                <p className="text-sm text-gray-700 mt-1">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Articles commandes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Produit</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Variante</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Prix</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Qte</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Sous-total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">{item.product_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.variant_label}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.price.toFixed(2)} DT</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                        {(item.price * item.quantity).toFixed(2)} DT
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 text-right">
              <span className="text-sm text-gray-500">Total: </span>
              <span className="text-lg font-bold text-gray-900">{order.total.toFixed(2)} DT</span>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">Mettre a jour le statut</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest/20 focus:border-forest outline-none text-sm mb-4"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button
              onClick={handleSaveStatus}
              disabled={saving || newStatus === order.status}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-forest text-white rounded-lg hover:bg-forest-light transition-colors font-medium disabled:opacity-50 text-sm"
            >
              <Save size={16} />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            {message && (
              <p className={`mt-3 text-sm text-center ${message.includes('succes') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
