'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import ToastContainer, { useToast } from '@/components/ui/Toast';
import { adminGetProduct, adminUpdateProduct, adminUploadImages } from '@/lib/admin-api';
import type { Product } from '@/lib/admin-api';
import { getBrands, getCategories } from '@/lib/api';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { toasts, addToast, dismissToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    Promise.all([
      adminGetProduct(token, id),
      getBrands(),
      getCategories(),
    ])
      .then(([productData, brandsData, categoriesData]) => {
        setProduct(productData);
        setBrands(brandsData.map((b) => ({ id: b.id, name: b.name })));
        setCategories(categoriesData.map((c) => ({ id: c.id, name: c.name })));
      })
      .catch(() => addToast('error', 'Erreur lors du chargement'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpload = async (files: File[]) => {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error('Non autorise');
    return adminUploadImages(token, files);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await adminUpdateProduct(token, id, data as Partial<Product>);
      addToast('success', 'Produit mis a jour avec succes');
      setTimeout(() => router.push('/admin/produits'), 1000);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur lors de la mise a jour');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Chargement du produit...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Produit introuvable</p>
        <Link href="/admin/produits" className="text-forest hover:underline">
          Retour aux produits
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/produits" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-forest">
        <ArrowLeft size={16} /> Retour aux produits
      </Link>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        onUploadImages={handleUpload}
        brands={brands}
        categories={categories}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
