import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recipeImg from '../assets/recipe_placeholder.png';
import { api } from '../api/axios';
import tomateImg from '../assets/tomate.png';
import customLogo from '../assets/logo.png';



function RecipeCard({ recipe }) {
  const imageUrl = recipe.main_image?.url || recipeImg;
  const [imgError, setImgError] = useState(false);
  const authorName = recipe.author?.name || 'Autor Desconocido';
  const avatarUrl = recipe.author?.avatar_url || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(authorName)}`;
  const categoryName = recipe.categories?.[0]?.name || 'Sin categoría';

  const placeholder = (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-2 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-500">
      <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-gray-400 font-bold text-sm">Sin imagen</span>
    </div>
  );

  return (
    <Link to={`/recipe/${recipe.id}`} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group block hover:-translate-y-2">
      <div className="relative h-64 w-full overflow-hidden">
        {!imgError ? (
          <img src={imageUrl} alt={recipe.title} onError={() => setImgError(true)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          placeholder
        )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center shadow-sm">
          <span className="font-bold text-green-700">{categoryName}</span>
        </div>
      </div>
      <div className="p-8 flex flex-col gap-6">
        <h3 className="text-2xl font-black text-[#1a2e35] group-hover:text-green-600 transition-colors line-clamp-2">{recipe.title}</h3>
        
        <div className="flex justify-between items-center text-sm font-bold text-gray-600">
          <div className="flex items-center gap-3">
            <img src={avatarUrl} alt={authorName} className="w-10 h-10 rounded-full object-cover border-2 border-gray-100" />
            <span className="text-[#1a2e35] text-lg truncate max-w-[150px]">{authorName}</span>
          </div>
        </div>

        <hr className="border-gray-50" />

        <div className="flex items-center justify-between text-lg font-black text-[#1a2e35]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-[#f0f4f0] text-green-700 px-3 py-1.5 rounded-xl text-base">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{(recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)} min</span>
            </div>
            <div className="flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1.5 rounded-xl text-base">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
              <span>{recipe.likes_count || 0}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-base ml-2">
            <svg className="w-6 h-6 text-[#ffb800] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span className="text-[#ffb800]">{Number(recipe.average_rating || 0).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Custom Dropdown Component for better UI and accessibility
function CustomDropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-grow min-w-[200px]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white rounded-3xl px-8 py-6 text-left shadow-md border-2 border-transparent hover:border-green-500 transition-all flex justify-between items-center focus:outline-none"
      >
        <span className={`text-xl font-black ${value ? 'text-[#1a2e35]' : 'text-gray-400'}`}>
          {value || label}
        </span>
        <svg className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-[100] overflow-hidden py-4">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="w-full text-left px-8 py-4 text-xl font-bold text-[#1a2e35] hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Explore() {
  const [recipes, setRecipes] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [publishedFrom, setPublishedFrom] = useState("");
  const [publishedTo, setPublishedTo] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAuthorOpen, setIsAuthorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch categories on mount
    api.get('/categories').then(res => setDbCategories(res.data.data)).catch(console.error);
    // Fetch all published recipes to extract unique authors
    api.get('/recipes', { params: { per_page: 50 } }).then(res => {
      const data = res.data.data || [];
      const uniqueAuthors = [];
      const seen = new Set();
      data.forEach(r => {
        if (r.author && r.author.id && !seen.has(r.author.id)) {
          seen.add(r.author.id);
          uniqueAuthors.push(r.author);
        }
      });
      setAuthors(uniqueAuthors);
    }).catch(console.error);
  }, []);

  const fetchRecipes = async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        q,
        published_from: publishedFrom,
        published_to: publishedTo,
      };
      if (category) {
        params['category_ids[]'] = category.id;
      }
      if (selectedAuthor) {
        params['author_id'] = selectedAuthor.id;
      }
      
      const res = await api.get('/recipes', { params });
      setRecipes(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(page);
  }, [page]);

  const handleSearch = () => {
    if (page === 1) {
      fetchRecipes(1);
    } else {
      setPage(1); // will trigger useEffect
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-[#1a2e35]">
      
      {/* Top Header */}
      <header className="w-full h-24 bg-[#ffb800] px-8 flex justify-between items-center shadow-md relative z-50">
        <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center h-full">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center group gap-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner transform group-hover:scale-105 transition-transform overflow-hidden p-2">
                <img src={tomateImg} alt="Tomate Logo" className="w-full h-full object-contain" />
              </div>
              <img src={customLogo} alt="Salsa de Tomate" style={{width: '250px', marginTop: '8px'}} />
            </Link>
          </div>
          
          <div className="flex gap-4">
            {localStorage.getItem('access_token') ? (
              <>
                <Link to="/my-recipes" className="px-6 py-2.5 bg-white text-[#ffb800] font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors">Mis recetas</Link>
                <button onClick={() => { localStorage.removeItem('access_token'); window.location.href='/login'; }} className="px-6 py-2.5 bg-white text-red-500 font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors border-2 border-red-100 hidden md:block">Salir</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-6 py-2.5 bg-white text-[#ffb800] font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors">Ingresar</Link>
                <Link to="/register" className="px-6 py-2.5 outline outline-2 outline-white text-white font-black text-lg md:text-xl rounded-full hover:bg-white/10 transition-colors">Regístrate</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero / Search Section */}
      <div className="w-full max-w-[95%] mx-auto px-4 mt-12 mb-16">
        <section className="relative w-full bg-white rounded-[4rem] shadow-[0_30px_70px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center py-24 px-10 border border-gray-100">
          
          {/* Background Blobs - Using a separate absolute wrapper with overflow-hidden to contain the blob without clipping the dropdowns below */}
          <div className="absolute inset-0 rounded-[4rem] overflow-hidden pointer-events-none" aria-hidden="true">
            <div 
              className="absolute top-0 right-0 w-[55%] h-full bg-[#fce08b] opacity-60"
              style={{ borderBottomLeftRadius: '800px' }}
            ></div>
          </div>

          <h1 className="text-7xl font-black text-[#1a2e35] z-10 mb-6 tracking-tighter">Explora recetas</h1>
          <p className="text-[#334155] font-bold z-10 mb-16 text-center text-3xl max-w-4xl leading-relaxed">
            Busca y encuentra <strong className="text-green-600">recetas deliciosas</strong> para inspirarte a cocinar.
          </p>

          {/* Search Bar Capsule - Final Refinement for 1584px Viewport */}
          <div className="bg-[#f0f4f0] rounded-[4rem] p-4 flex flex-wrap 2xl:flex-nowrap items-center gap-2 w-full max-w-[99%] z-20 shadow-sm relative">
            
            {/* MAIN SEARCH INPUT - MAXIMIZED BREATHING ROOM */}
            <div className="bg-white rounded-3xl flex-[3] min-w-[300px] flex items-center shadow-md border-3 border-transparent focus-within:border-green-500 transition-all">
              <input 
                type="text" 
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="¿Qué quieres cocinar?" 
                className="w-full px-6 py-5 outline-none text-[#1a2e35] bg-transparent text-xl font-black placeholder:text-lg" 
              />
            </div>
            
            <div className="flex-[0.7] min-w-[145px]">
              <div className="relative">
                <button 
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full bg-white rounded-3xl px-4 py-5 text-left shadow-md border-2 border-transparent hover:border-green-500 transition-all flex justify-between items-center focus:outline-none"
                >
                  <span className={`text-base font-black truncate ${category ? 'text-[#1a2e35]' : 'text-gray-400'}`}>
                    {category ? category.name : "Categoría"}
                  </span>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] max-h-60 overflow-y-auto py-2">
                    <button onClick={() => { setCategory(null); setIsCategoryOpen(false); }} className="w-full text-left px-5 py-3 text-lg font-bold text-gray-500 hover:bg-gray-50 transition-colors">Todas</button>
                    {dbCategories.map((opt) => (
                      <button key={opt.id} onClick={() => { setCategory(opt); setIsCategoryOpen(false); }} className="w-full text-left px-5 py-3 text-lg font-bold text-[#1a2e35] hover:bg-green-50 hover:text-green-700 transition-colors">{opt.name}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AUTHOR FILTER */}
            <div className="flex-[0.7] min-w-[145px]">
              <div className="relative">
                <button 
                  onClick={() => setIsAuthorOpen(!isAuthorOpen)}
                  className="w-full bg-white rounded-3xl px-4 py-5 text-left shadow-md border-2 border-transparent hover:border-green-500 transition-all flex justify-between items-center focus:outline-none"
                >
                  <span className={`text-base font-black truncate ${selectedAuthor ? 'text-[#1a2e35]' : 'text-gray-400'}`}>
                    {selectedAuthor ? selectedAuthor.name : "Autor"}
                  </span>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${isAuthorOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isAuthorOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] max-h-60 overflow-y-auto py-2">
                    <button onClick={() => { setSelectedAuthor(null); setIsAuthorOpen(false); }} className="w-full text-left px-5 py-3 text-lg font-bold text-gray-500 hover:bg-gray-50 transition-colors">Todos</button>
                    {authors.map((a) => (
                      <button key={a.id} onClick={() => { setSelectedAuthor(a); setIsAuthorOpen(false); }} className="w-full text-left px-5 py-3 text-lg font-bold text-[#1a2e35] hover:bg-green-50 hover:text-green-700 transition-colors">{a.name}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date and Search sections will be merged here. Left blank purposefully because I will replace it alongside next chunk. */}
            {/* DATE RANGE PICKER - COMPACT FOR 1584px */}
            <div className="bg-white rounded-3xl flex-[1] min-w-[270px] flex items-center gap-1 px-3 py-4 shadow-md border-3 border-transparent hover:border-green-500 transition-all">
              <div className="flex flex-col flex-1 min-w-[105px]">
                <span className="text-[9px] uppercase font-black text-gray-400 ml-1 mb-0.5">Desde</span>
                <input type="date" value={publishedFrom} onChange={(e) => setPublishedFrom(e.target.value)} className="bg-transparent text-sm font-black text-[#1a2e35] outline-none cursor-pointer w-full" />
              </div>
              <div className="w-px h-8 bg-gray-200 mx-1"></div>
              <div className="flex flex-col flex-1 min-w-[105px]">
                <span className="text-[9px] uppercase font-black text-gray-400 ml-1 mb-0.5">Hasta</span>
                <input type="date" value={publishedTo} onChange={(e) => setPublishedTo(e.target.value)} className="bg-transparent text-sm font-black text-[#1a2e35] outline-none cursor-pointer w-full" />
              </div>
            </div>
            
            <button onClick={handleSearch} className="bg-green-600 hover:bg-green-700 text-white px-8 py-5 rounded-3xl font-black text-xl transition-all hover:scale-[1.05] active:scale-95 shadow-2xl w-full 2xl:w-auto">
              BUSCAR
            </button>
          </div>
        </section>
      </div>
      <main className="flex-grow w-full max-w-[95%] mx-auto px-4 py-16 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-16 w-16 border-t-8 border-green-600 border-opacity-50"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
             <h2 className="text-3xl font-black text-gray-300">No se encontraron recetas</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {meta && meta.last_page > 1 && (
          <div className="flex justify-center items-center gap-4 mt-24">
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(num => (
              <button 
                key={num}
                onClick={() => { setPage(num); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-16 h-16 rounded-2xl shadow-xl text-2xl font-black transition-all ${num === page ? 'bg-green-600 text-white scale-110' : 'bg-white text-[#1a2e35] hover:bg-green-50 hover:text-green-700'}`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full text-center py-16 pb-24 mt-auto bg-white border-t-2 border-gray-100">
        <h4 className="text-[#1a2e35] font-black text-4xl">Compartiendo nuestras mejores recetas</h4>
      </footer>

    </div>
  );
}
