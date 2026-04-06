'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ToastContainer, { useToast } from '@/components/ui/Toast';
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  type Category,
} from '@/lib/admin-api';

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toasts, addToast, dismissToast } = useToast();

  // Add form
  const [addName, setAddName] = useState('');
  const [addSlug, setAddSlug] = useState('');
  const [addIcon, setAddIcon] = useState('');
  const [adding, setAdding] = useState(false);

  // Edit state
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const token = () => localStorage.getItem('admin_token') || '';

  useEffect(() => {
    setLoading(true);
    adminGetCategories(token())
      .then(setCategories)
      .catch(() => addToast('error', 'Erreur lors du chargement des categories'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    setAdding(true);
    try {
      const created = await adminCreateCategory(token(), {
        name: addName.trim(),
        slug: addSlug || toSlug(addName),
        icon: addIcon.trim() || undefined,
      });
      setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setAddName('');
      setAddSlug('');
      setAddIcon('');
      addToast('success', `Categorie "${created.name}" ajoutee`);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur lors de la creation');
    }
    setAdding(false);
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditIcon(cat.icon || '');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditSlug('');
    setEditIcon('');
  };

  const handleSave = async (id: number) => {
    setSaving(true);
    try {
      const updated = await adminUpdateCategory(token(), id, {
        name: editName.trim(),
        slug: editSlug.trim(),
        icon: editIcon.trim() || null,
      });
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      addToast('success', 'Categorie mise a jour');
      cancelEdit();
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur lors de la mise a jour');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminDeleteCategory(token(), deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      addToast('success', `Categorie "${deleteTarget.name}" supprimee`);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Ajouter une categorie</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Nom (ex: Protection d&apos;ecran)"
            value={addName}
            onChange={(e) => {
              setAddName(e.target.value);
              setAddSlug(toSlug(e.target.value));
            }}
            className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
            required
          />
          <input
            type="text"
            placeholder="Slug (auto-genere)"
            value={addSlug}
            onChange={(e) => setAddSlug(e.target.value)}
            className="flex-1 min-w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest font-mono"
          />
          <input
            type="text"
            placeholder="Icone (ex: smartphone)"
            value={addIcon}
            onChange={(e) => setAddIcon(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
          />
          <button
            type="submit"
            disabled={adding || !addName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest-light transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Plus size={16} />
            {adding ? 'Ajout...' : 'Ajouter'}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-200">
          <p className="text-sm text-gray-500">{categories.length} categorie(s)</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm">Chargement...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">Aucune categorie.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Slug</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Icone</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Produits</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {editId === cat.id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      {editId === cat.id ? (
                        <input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
                        />
                      ) : (
                        <span className="text-sm text-gray-500 font-mono">{cat.slug}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {editId === cat.id ? (
                        <input
                          value={editIcon}
                          onChange={(e) => setEditIcon(e.target.value)}
                          placeholder="ex: smartphone"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">{cat.icon || '—'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 hidden md:table-cell">
                      {cat.product_count}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {editId === cat.id ? (
                          <>
                            <button
                              onClick={() => handleSave(cat.id)}
                              disabled={saving}
                              title="Enregistrer"
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              title="Annuler"
                              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(cat)}
                              title="Modifier"
                              className="p-1.5 text-gray-500 hover:text-forest hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(cat)}
                              title={cat.product_count > 0 ? `${cat.product_count} produit(s) - suppression impossible` : 'Supprimer'}
                              disabled={cat.product_count > 0}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer la categorie"
        message={`Etes-vous sur de vouloir supprimer la categorie "${deleteTarget?.name}" ?`}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
