'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import ToastContainer, { useToast } from '@/components/ui/Toast';
import { adminCreateProduct, adminUploadImages } from '@/lib/admin-api';
import type { Product } from '@/lib/admin-api';
import { getBrands, getCategories } from '@/lib/api';

export default function NewProductPage() {
  const router = useRouter();
  const { toasts, addToast, dismissToast } = useToast();
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBrands(), getCategories()])
      .then(([brandsData, categoriesData]) => {
        setBrands(brandsData.map((b) => ({ id: b.id, name: b.name })));
        setCategories(categoriesData.map((c) => ({ id: c.id, name: c.name })));
      })
      .catch(() => addToast('error', 'Erreur lors du chargement des marques/categories'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (files: File[]) => {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error('Non autorise');
    return adminUploadImages(token, files);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await adminCreateProduct(token, data as Partial<Product>);
      addToast('success', 'Produit cree avec succes');
      setTimeout(() => router.push('/admin/produits'), 1000);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur lors de la creation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/produits" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-forest">
        <ArrowLeft size={16} /> Retour aux produits
      </Link>

      <ProductForm
        onSubmit={handleSubmit}
        onUploadImages={handleUpload}
        brands={brands}
        categories={categories}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
