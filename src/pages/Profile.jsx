import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/axios';
import tomateImg from '../assets/tomate.png';
import customLogo from '../assets/logo.png';
import recipeImg from '../assets/recipe_placeholder.png';
import { useToast } from '../components/Toast';
import MyProfileLink from '../components/MyProfileLink';

const levelStyles = {
  NONE: 'bg-gray-100 text-gray-600 border-gray-200',
  MAESTRO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CHEF: 'bg-amber-50 text-amber-700 border-amber-200',
  KING_CHEF: 'bg-purple-50 text-purple-700 border-purple-200',
};

function RecipeMiniCard({ recipe }) {
  return (
    <Link to={`/recipe/${recipe.id}`} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <img src={recipe.main_image?.url || recipeImg} alt={recipe.title} className="h-24 w-28 rounded-xl object-cover bg-gray-100" />
      <div className="min-w-0">
        <h3 className="text-lg font-black text-[#1a2e35] line-clamp-2">{recipe.title}</h3>
        <p className="mt-2 text-sm font-bold text-gray-500">{(recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)} min</p>
        <p className="text-sm font-black text-[#ffb800]">★ {Number(recipe.average_rating || 0).toFixed(1)}</p>
      </div>
    </Link>
  );
}

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [collectionPublished, setCollectionPublished] = useState(false);
  const [recipeIdByCollection, setRecipeIdByCollection] = useState({});
  const [profileForm, setProfileForm] = useState({ name: '', bio: '', avatar_url: '' });
  const showProfileCollectionManagement = false;

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${id}/profile`);
      setProfile(res.data.data);
      setProfileForm({
        name: res.data.data.user?.name || '',
        bio: res.data.data.user?.bio || '',
        avatar_url: res.data.data.user?.avatar_url || '',
      });
    } catch (err) {
      toast.error('No se pudo cargar el perfil');
      navigate('/explore');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const updateProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    try {
      await api.patch('/profile', profileForm);
      toast.success('Perfil actualizado');
      await loadProfile();
    } catch {
      toast.error('No se pudo actualizar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleFollow = async () => {
    try {
      if (profile.is_following) {
        await api.delete(`/users/${id}/follow`);
      } else {
        await api.post(`/users/${id}/follow`);
      }
      await loadProfile();
    } catch {
      toast.error('No se pudo actualizar el seguimiento');
    }
  };

  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setAvatarUploading(true);
    try {
      const res = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const avatarUrl = res.data?.data?.avatar_url || '';
      setProfileForm((current) => ({ ...current, avatar_url: avatarUrl }));
      toast.success('Avatar actualizado');
      await loadProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo subir el avatar');
    } finally {
      setAvatarUploading(false);
      event.target.value = null;
    }
  };

  const createCollection = async (event) => {
    event.preventDefault();
    if (!collectionName.trim()) {
      toast.warning('Escribe un nombre para la colección');
      return;
    }

    try {
      await api.post('/profile/collections', {
        name: collectionName,
        description: collectionDescription,
        is_published: collectionPublished,
      });
      setCollectionName('');
      setCollectionDescription('');
      setCollectionPublished(false);
      toast.success('Colección creada');
      await loadProfile();
    } catch {
      toast.error('No se pudo crear la colección');
    }
  };

  const renameCollection = async (collection) => {
    const name = window.prompt('Nuevo nombre de la colección', collection.name);
    if (!name || !name.trim()) return;
    try {
      await api.patch(`/profile/collections/${collection.id}`, {
        name,
        description: collection.description,
        is_published: collection.is_published,
      });
      await loadProfile();
    } catch {
      toast.error('No se pudo renombrar la colección');
    }
  };

  const toggleCollectionPublished = async (collection) => {
    try {
      await api.post(`/profile/collections/${collection.id}/${collection.is_published ? 'unpublish' : 'publish'}`);
      await loadProfile();
    } catch {
      toast.error('No se pudo cambiar la visibilidad');
    }
  };

  const attachRecipe = async (collection) => {
    const recipeId = Number(recipeIdByCollection[collection.id]);
    if (!recipeId) {
      toast.warning('Escribe el ID de una receta');
      return;
    }

    try {
      await api.post(`/profile/collections/${collection.id}/recipes`, { recipe_id: recipeId });
      setRecipeIdByCollection({ ...recipeIdByCollection, [collection.id]: '' });
      await loadProfile();
    } catch {
      toast.error('No se pudo agregar la receta');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-black">Cargando perfil...</div>;
  }

  if (!profile) return null;

  const user = profile.user;
  const avatar = user.avatar_url || `https://ui-avatars.com/api/?background=ffb800&color=fff&name=${encodeURIComponent(user.name)}`;
  const levelClass = levelStyles[user.chef_level] || levelStyles.NONE;

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans text-[#1a2e35]">
      <header className="w-full h-24 bg-[#ffb800] px-8 flex justify-between items-center shadow-md relative z-50">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden p-2">
            <img src={tomateImg} alt="Tomate Logo" className="w-full h-full object-contain" />
          </div>
          <img src={customLogo} alt="Salsa de Tomate" style={{ width: '250px', marginTop: '8px' }} />
        </Link>
        <nav className="flex gap-4">
          <Link to="/explore" className="px-6 py-2.5 bg-white text-[#ffb800] font-black text-lg rounded-full shadow">Explorar</Link>
          <Link to="/my-recipes" className="px-6 py-2.5 bg-white text-[#ffb800] font-black text-lg rounded-full shadow">Mis recetas</Link>
          <MyProfileLink className="hidden md:block" />
        </nav>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 md:p-10">
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-10 justify-between">
            <div className="flex flex-col sm:flex-row gap-8">
              <img src={avatar} alt={user.name} className="w-36 h-36 rounded-[2rem] object-cover bg-gray-100 border-4 border-white shadow-lg" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-5xl font-black">{user.name}</h1>
                  <Link to="/chef-levels" className={`px-4 py-2 rounded-full border text-sm font-black hover:shadow-md transition-shadow ${levelClass}`}>
                    {user.chef_level_label || 'NONE'}
                  </Link>
                </div>
                <p className="mt-4 max-w-2xl text-lg font-bold text-gray-600">{user.bio || 'Este chef todavía no ha escrito su bio.'}</p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-black text-gray-600">
                  <span>{profile.followers_count} seguidores</span>
                  <span>{profile.following_count} siguiendo</span>
                  <span>{profile.recipes.length} recetas publicadas</span>
                </div>
              </div>
            </div>

            {!profile.can_edit && localStorage.getItem('access_token') && (
              <button onClick={toggleFollow} className="h-fit px-8 py-4 rounded-2xl bg-[#1e8b4d] text-white font-black shadow hover:bg-green-800">
                {profile.is_following ? 'Dejar de seguir' : 'Seguir'}
              </button>
            )}
          </div>

          {profile.can_edit && (
            <form onSubmit={updateProfile} className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4 border-t border-gray-100 pt-8">
              <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="border border-gray-200 rounded-2xl px-5 py-4 font-bold" placeholder="Nombre" />
              <input value={profileForm.avatar_url} onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })} className="hidden border border-gray-200 rounded-2xl px-5 py-4 font-bold" placeholder="URL de avatar" />
              <label className="relative overflow-hidden border-2 border-dashed border-gray-200 rounded-2xl px-5 py-4 font-black text-gray-600 bg-gray-50 hover:bg-gray-100 cursor-pointer text-center">
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadAvatar} disabled={avatarUploading} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                {avatarUploading ? 'Subiendo avatar...' : 'Seleccionar avatar'}
              </label>
              <button disabled={savingProfile} className="bg-[#ffb800] rounded-2xl px-6 py-4 font-black text-white disabled:opacity-60">{savingProfile ? 'Guardando...' : 'Guardar perfil'}</button>
              <textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} className="lg:col-span-3 border border-gray-200 rounded-2xl px-5 py-4 font-bold min-h-28" placeholder="Bio" />
            </form>
          )}
        </section>

        <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
            <h2 className="text-3xl font-black mb-6">Recetas publicadas</h2>
            <div className="grid grid-cols-1 gap-4">
              {profile.recipes.length === 0 && <p className="font-bold text-gray-500">No hay recetas publicadas.</p>}
              {profile.recipes.map((recipe) => <RecipeMiniCard key={recipe.id} recipe={recipe} />)}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
            <h2 className="text-3xl font-black mb-6">Colecciones</h2>

            {profile.can_edit && showProfileCollectionManagement && (
              <form onSubmit={createCollection} className="mb-8 rounded-2xl bg-gray-50 p-5 flex flex-col gap-3">
                <input value={collectionName} onChange={(e) => setCollectionName(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 font-bold" placeholder="Nombre de colección" />
                <input value={collectionDescription} onChange={(e) => setCollectionDescription(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 font-bold" placeholder="Descripción" />
                <label className="flex items-center gap-3 font-bold text-gray-600">
                  <input type="checkbox" checked={collectionPublished} onChange={(e) => setCollectionPublished(e.target.checked)} />
                  Publicar colección
                </label>
                <button className="bg-[#1e8b4d] text-white rounded-xl px-5 py-3 font-black">Crear colección</button>
              </form>
            )}

            <div className="flex flex-col gap-5">
              {profile.collections.length === 0 && <p className="font-bold text-gray-500">No hay colecciones.</p>}
              {profile.collections.map((collection) => (
                <article key={collection.id} className="rounded-2xl border border-gray-100 p-5">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black">{collection.name}</h3>
                      <p className="text-sm font-bold text-gray-500">{collection.description || 'Sin descripción'}</p>
                      <p className="mt-1 text-xs font-black text-gray-400">{collection.recipes_count} recetas - {collection.is_published ? 'Publicada' : 'Privada'}</p>
                    </div>
                    {profile.can_edit && showProfileCollectionManagement && (
                      <div className="flex flex-col gap-2">
                        <button onClick={() => renameCollection(collection)} className="text-sm font-black text-[#1e8b4d]">Renombrar</button>
                        <button onClick={() => toggleCollectionPublished(collection)} className="text-sm font-black text-[#ffb800]">{collection.is_published ? 'Ocultar' : 'Publicar'}</button>
                      </div>
                    )}
                  </div>

                  {profile.can_edit && showProfileCollectionManagement && (
                    <div className="mt-4 flex gap-2">
                      <input value={recipeIdByCollection[collection.id] || ''} onChange={(e) => setRecipeIdByCollection({ ...recipeIdByCollection, [collection.id]: e.target.value })} className="min-w-0 flex-1 border border-gray-200 rounded-xl px-4 py-2 font-bold" placeholder="ID receta" />
                      <button onClick={() => attachRecipe(collection)} className="px-4 py-2 rounded-xl bg-gray-900 text-white font-black">Agregar</button>
                    </div>
                  )}

                  {collection.recipes && collection.recipes.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-3">
                      {collection.recipes.map((recipe) => <RecipeMiniCard key={recipe.id} recipe={recipe} />)}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
