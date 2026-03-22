'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/admin-api';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  brands: string[];
  categories: string[];
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

export default function ProductForm({ initialData, onSubmit, brands, categories }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    initialData?.specs
      ? Object.entries(initialData.specs).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  );
  const [colors, setColors] = useState<string>(initialData?.colors?.join(', ') || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
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
        brand,
        category,
        description,
        specs: specsObj,
        colors: colors.split(',').map((c) => c.trim()).filter(Boolean),
        image_url: imageUrl,
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
            <select value={brand} onChange={(e) => setBrand(e.target.value)} required className={inputClass}>
              <option value="">Selectionner...</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Categorie *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required className={inputClass}>
              <option value="">Selectionner...</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Image et badge</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>URL de l&apos;image</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} placeholder="https://..." />
          </div>
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
