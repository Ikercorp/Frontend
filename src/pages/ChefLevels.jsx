import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';
import tomateImg from '../assets/tomate.png';
import customLogo from '../assets/logo.png';
import MyProfileLink from '../components/MyProfileLink';

const levelStyles = {
  MAESTRO: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  CHEF: 'border-amber-200 bg-amber-50 text-amber-800',
  KING_CHEF: 'border-purple-200 bg-purple-50 text-purple-800',
};

export default function ChefLevels() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/chef-levels')
      .then((res) => setLevels(res.data?.data || []))
      .catch(() => setLevels([]))
      .finally(() => setLoading(false));
  }, []);

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
        <section className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black">Niveles de chef</h1>
          <p className="mt-4 max-w-3xl text-lg font-bold text-gray-600">
            Cada nivel se obtiene con 5 recetas que alcanzan 100 ratings. Una vez que un usuario sube de nivel, no retrocede.
          </p>
        </section>

        {loading ? (
          <div className="rounded-[2rem] bg-white p-10 text-2xl font-black shadow-sm">Cargando niveles...</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {levels.map((level) => (
              <article key={level.code} className={`rounded-[2rem] border p-7 shadow-sm ${levelStyles[level.code] || 'bg-white border-gray-100 text-gray-800'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black">{level.label}</h2>
                    <p className="mt-3 font-bold leading-relaxed">{level.requirement}</p>
                  </div>
                  <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-black border border-white">{level.qualified_recipes_required} recetas</span>
                </div>

                {level.profile && (
                  <Link to={`/profile/${level.profile.id}`} className="mt-7 flex items-center gap-4 rounded-2xl bg-white/80 p-4 shadow-sm hover:bg-white transition-colors">
                    <img
                      src={level.profile.avatar_url || `https://ui-avatars.com/api/?background=ffb800&color=fff&name=${encodeURIComponent(level.profile.name)}`}
                      alt={level.profile.name}
                      className="h-16 w-16 rounded-2xl object-cover bg-white"
                    />
                    <div>
                      <p className="text-lg font-black">{level.profile.name}</p>
                      <p className="text-sm font-bold opacity-75">Ver perfil de muestra</p>
                    </div>
                  </Link>
                )}

                <div className="mt-7 rounded-2xl bg-white/80 p-5">
                  <h3 className="text-xl font-black mb-4">5 recetas que cumplen</h3>
                  <div className="flex flex-col gap-3">
                    {(level.qualified_recipes || []).map((recipe) => (
                      <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <p className="font-black text-[#1a2e35]">{recipe.title}</p>
                        <p className="mt-1 text-sm font-bold text-gray-500">
                          ★ {Number(recipe.average_rating || 0).toFixed(2)} · {recipe.ratings_count} ratings
                        </p>
                      </Link>
                    ))}
                    {(level.qualified_recipes || []).length === 0 && (
                      <p className="font-bold text-gray-500">Aun no hay recetas calificadas para este nivel.</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
