'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import type { Product, ProductVariant } from '@/lib/admin-api';

interface BrandOption {
  id: number;
  name: string;
}

interface CategoryOption {
  id: number;
  name: string;
}

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onUploadImages: (files: File[]) => Promise<string[]>;
  brands: BrandOption[];
  categories: CategoryOption[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const emptyVariant: ProductVariant = {
  ram: '',
  storage: '',
  storage_unit: 'GB',
  price: 0,
  original_price: undefined,
};

export default function ProductForm({ initialData, onSubmit, onUploadImages, brands, categories }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [brandId, setBrandId] = useState(initialData?.brand_id ? String(initialData.brand_id) : '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id ? String(initialData.category_id) : '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    initialData?.specs
      ? Object.entries(initialData.specs).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  );
  const [colors, setColors] = useState<string>(initialData?.colors?.join(', ') || '');
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images?.length
      ? initialData.images
      : initialData?.image_url ? [initialData.image_url] : []
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [badge, setBadge] = useState(initialData?.badge || '');
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialData?.variants?.length ? initialData.variants : [{ ...emptyVariant }]
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [loading, setLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!initialData);

  useEffect(() => {
    if (autoSlug) {
      setSlug(slugify(name));
    }
  }, [name, autoSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const specsObj: Record<string, string> = {};
      specs.forEach(({ key, value }) => {
        if (key.trim()) specsObj[key.trim()] = value.trim();
      });

      await onSubmit({
        name,
        slug,
        brand_id: Number(brandId),
        category_id: Number(categoryId),
        description,
        specs: specsObj,
        colors: colors.split(',').map((c: string) => c.trim()).filter(Boolean),
        image_url: imageUrls[0] || '',
        images: imageUrls,
        badge: badge || undefined,
        variants,
        is_featured: isFeatured,
      });
    } finally {
      setLoading(false);
    }
  };

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    const next = [...specs];
    next[i] = { ...next[i], [field]: val };
    setSpecs(next);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await onUploadImages(files);
      setImageUrls((prev) => [...prev, ...urls]);
    } catch {
      // Parent page handles toast errors
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => setVariants([...variants, { ...emptyVariant }]);
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: keyof ProductVariant, val: string | number) => {
    const next = [...variants];
    next[i] = { ...next[i], [field]: val };
    setVariants(next);
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest/20 focus:border-forest outline-none text-sm transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations generales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom du produit *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Marque *</label>
            <select value={brandId} onChange={(e) => setBrandId(e.target.value)} required className={inputClass}>
              <option value="">Selectionner...</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Categorie *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={inputClass}>
              <option value="">Selectionner...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Media & Badge */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Images et badge</h3>

        {/* Image upload */}
        <div className="mb-4">
          <label className={labelClass}>Images du produit</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {imageUrls.map((url, i) => (
                <div key={url} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="96px" />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-forest/80 text-white text-[10px] text-center py-0.5">
                      Principale
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-forest hover:text-forest transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Upload en cours...' : 'Ajouter des images'}
          </button>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG ou WebP. Max 5 Mo par fichier. La premiere image sera l&apos;image principale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Badge</label>
            <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} className={inputClass} placeholder="Nouveau, -20%, etc." />
          </div>
          <div>
            <label className={labelClass}>Couleurs (separees par des virgules)</label>
            <input type="text" value={colors} onChange={(e) => setColors(e.target.value)} className={inputClass} placeholder="Noir, Blanc, Bleu" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-forest focus:ring-forest"
              />
              <span className="text-sm font-medium text-gray-700">Produit en vedette</span>
            </label>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
          <button type="button" onClick={addSpec} className="flex items-center gap-1 text-sm text-forest hover:text-forest-light font-medium">
            <Plus size={16} /> Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {specs.map((spec, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => updateSpec(i, 'key', e.target.value)}
                placeholder="Cle (ex: Ecran)"
                className={`${inputClass} flex-1`}
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpec(i, 'value', e.target.value)}
                placeholder="Valeur (ex: 6.7 pouces)"
                className={`${inputClass} flex-1`}
              />
              <button type="button" onClick={() => removeSpec(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Variantes</h3>
          <button type="button" onClick={addVariant} className="flex items-center gap-1 text-sm text-forest hover:text-forest-light font-medium">
            <Plus size={16} /> Ajouter une variante
          </button>
        </div>
        <div className="space-y-3">
          {variants.map((variant, i) => (
            <div key={i} className="flex flex-wrap gap-2 items-end p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-[100px]">
                <label className="text-xs text-gray-500">RAM</label>
                <input
                  type="text"
                  value={variant.ram || ''}
                  onChange={(e) => updateVariant(i, 'ram', e.target.value)}
                  placeholder="8"
                  className={inputClass}
                />
              </div>
              <div className="flex-1 min-w-[100px]">
                <label className="text-xs text-gray-500">Stockage</label>
                <input
                  type="text"
                  value={variant.storage}
                  onChange={(e) => updateVariant(i, 'storage', e.target.value)}
                  placeholder="128"
                  className={inputClass}
                />
              </div>
              <div className="w-20">
                <label className="text-xs text-gray-500">Unite</label>
                <select
                  value={variant.storage_unit}
                  onChange={(e) => updateVariant(i, 'storage_unit', e.target.value)}
                  className={inputClass}
                >
                  <option value="GB">GB</option>
                  <option value="TB">TB</option>
                </select>
              </div>
              <div className="flex-1 min-w-[100px]">
                <label className="text-xs text-gray-500">Prix (DT) *</label>
                <input
                  type="number"
                  value={variant.price || ''}
                  onChange={(e) => updateVariant(i, 'price', parseFloat(e.target.value) || 0)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="flex-1 min-w-[100px]">
                <label className="text-xs text-gray-500">Prix original (DT)</label>
                <input
                  type="number"
                  value={variant.original_price || ''}
                  onChange={(e) => updateVariant(i, 'original_price', parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
              <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg" disabled={variants.length === 1}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-forest text-white rounded-lg hover:bg-forest-light transition-colors font-medium disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? 'Enregistrement...' : initialData ? 'Mettre a jour' : 'Creer le produit'}
        </button>
      </div>
    </form>
  );
}
