'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import ToastContainer, { useToast } from '@/components/ui/Toast';
import { adminCreateProduct } from '@/lib/admin-api';
import type { Product } from '@/lib/admin-api';

const BRANDS = ['Samsung', 'Apple', 'Xiaomi', 'OPPO', 'Realme', 'Infinix', 'Tecno', 'Huawei', 'Honor', 'Nokia', 'Motorola', 'Autre'];
const CATEGORIES = ['Telephones', 'Accessoires', 'Chargeurs', 'AirPods', 'Coques', 'Cables', 'Tablettes'];

export default function NewProductPage() {
  const router = useRouter();
  const { toasts, addToast, dismissToast } = useToast();

  const handleSubmit = async (data: Partial<Product>) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await adminCreateProduct(token, data);
      addToast('success', 'Produit cree avec succes');
      setTimeout(() => router.push('/admin/produits'), 1000);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur lors de la creation');
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/produits" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-forest">
        <ArrowLeft size={16} /> Retour aux produits
      </Link>

      <ProductForm
        onSubmit={handleSubmit}
        brands={BRANDS}
        categories={CATEGORIES}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
