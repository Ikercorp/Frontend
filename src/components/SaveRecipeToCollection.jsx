import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useToast } from './Toast';

export default function SaveRecipeToCollection({ recipeId }) {
  const toast = useToast();
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionPublished, setNewCollectionPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAuth = !!localStorage.getItem('access_token');

  const loadCollections = async () => {
    if (!isAuth) return;
    setLoading(true);
    try {
      const res = await api.get('/profile/collections');
      const data = res.data?.data || [];
      setCollections(data);
      if (!selectedCollectionId && data.length > 0) {
        setSelectedCollectionId(String(data[0].id));
      }
    } catch {
      toast.error('No se pudieron cargar tus colecciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, [recipeId]);

  const saveRecipe = async (collectionId) => {
    const targetId = Number(collectionId || selectedCollectionId);
    if (!targetId) {
      toast.warning('Selecciona o crea una colección');
      return;
    }

    setSaving(true);
    try {
      await api.post(`/profile/collections/${targetId}/recipes`, { recipe_id: Number(recipeId) });
      toast.success('Receta guardada en tu colección');
      await loadCollections();
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo guardar la receta');
    } finally {
      setSaving(false);
    }
  };

  const createCollectionAndSave = async (event) => {
    event.preventDefault();
    if (!newCollectionName.trim()) {
      toast.warning('Escribe el nombre de la colección');
      return;
    }

    setSaving(true);
    try {
      const res = await api.post('/profile/collections', {
        name: newCollectionName,
        description: '',
        is_published: newCollectionPublished,
      });
      const collection = res.data?.data;
      setNewCollectionName('');
      if (collection?.id) {
        setSelectedCollectionId(String(collection.id));
        await api.post(`/profile/collections/${collection.id}/recipes`, { recipe_id: Number(recipeId) });
        toast.success('Colección creada y receta guardada');
      }
      await loadCollections();
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo crear la colección');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuth) {
    return (
      <div className="bg-white border-2 border-[#f0f0f0] rounded-[2rem] p-8 shadow-sm">
        <h4 className="text-2xl font-black text-[#1a2e35] mb-3">Guardar receta</h4>
        <p className="text-gray-500 font-bold">Inicia sesión para guardar esta receta en una colección.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#f0f0f0] rounded-[2rem] p-8 shadow-sm flex flex-col gap-4">
      <h4 className="text-2xl font-black text-[#1a2e35]">Guardar en colección</h4>

      {collections.length > 0 && (
        <div className="flex flex-col gap-3">
          <select
            value={selectedCollectionId}
            onChange={(event) => setSelectedCollectionId(event.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold outline-none focus:border-green-500 bg-white"
            disabled={loading || saving}
          >
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>{collection.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => saveRecipe()}
            disabled={saving || loading}
            className="w-full bg-[#1e8b4d] hover:bg-green-700 text-white font-black text-lg py-4 rounded-[1.5rem] shadow-md transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar receta'}
          </button>
        </div>
      )}

      <form onSubmit={createCollectionAndSave} className="mt-2 border-t border-gray-100 pt-4 flex flex-col gap-3">
        <input
          value={newCollectionName}
          onChange={(event) => setNewCollectionName(event.target.value)}
          placeholder="Nueva colección"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold outline-none focus:border-green-500"
        />
        <label className="flex items-center gap-3 text-sm font-bold text-gray-600">
          <input
            type="checkbox"
            checked={newCollectionPublished}
            onChange={(event) => setNewCollectionPublished(event.target.checked)}
          />
          Publicar colección en mi perfil
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#ffb800] hover:bg-yellow-500 text-white font-black text-lg py-4 rounded-[1.5rem] shadow-md transition-colors disabled:opacity-50"
        >
          {saving ? 'Creando...' : 'Crear colección y guardar'}
        </button>
      </form>
    </div>
  );
}
