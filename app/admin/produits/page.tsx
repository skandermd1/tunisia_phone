'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, EyeOff, Eye } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ToastContainer, { useToast } from '@/components/ui/Toast';
import { adminGetProducts, adminDeleteProduct, adminDeactivateProduct, adminActivateProduct } from '@/lib/admin-api';
import type { Product } from '@/lib/admin-api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const fetchProducts = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setLoading(true);
    adminGetProducts(token, { showInactive })
      .then(setProducts)
      .catch(() => addToast('error', 'Erreur lors du chargement des produits'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInactive]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await adminDeleteProduct(token, deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      addToast('success', 'Produit supprime avec succes');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
    setDeleteTarget(null);
  };

  const handleDeactivate = async (product: Product) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await adminDeactivateProduct(token, product.id);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: false } : p))
      );
      addToast('success', 'Produit desactive avec succes');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur lors de la desactivation');
    }
  };

  const handleActivate = async (product: Product) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await adminActivateProduct(token, product.id);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: true } : p))
      );
      addToast('success', 'Produit active avec succes');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : "Erreur lors de l'activation");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">{products.length} produit(s)</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-forest focus:ring-forest"
            />
            <span className="text-sm text-gray-500">Afficher inactifs</span>
          </label>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest-light transition-colors text-sm font-medium"
        >
          <Plus size={18} /> Ajouter un produit
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">Chargement des produits...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Aucun produit. Commencez par en ajouter un.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Marque</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Prix min</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Variantes</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Statut</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const displayPrice = product.default_price ?? 0;
                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category_name}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 hidden sm:table-cell">{product.brand_name}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 hidden md:table-cell">
                        {Number(displayPrice).toFixed(2)} DT
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 hidden md:table-cell">
                        {product.variant_count ?? '-'}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/produits/${product.id}/modifier`}
                            className="p-1.5 text-gray-500 hover:text-forest hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </Link>
                          {product.is_active ? (
                            <button
                              onClick={() => handleDeactivate(product)}
                              title="Desactiver"
                              className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              <EyeOff size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(product)}
                              title="Activer"
                              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(product)}
                            title="Supprimer definitivement"
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer le produit"
        message={`Etes-vous sur de vouloir supprimer "${deleteTarget?.name}" ? Cette action est irreversible.`}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
