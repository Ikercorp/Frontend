import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import platilloImg from '../assets/platillo.png';
import tomateImg from '../assets/tomate.png';
import customLogo from '../assets/logo.png';
import recipeImg from '../assets/recipe_placeholder.png';
import { useToast } from '../components/Toast';



function MyRecipes() {
  const [activeTab, setActiveTab] = useState('publicadas');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const toast = useToast();


  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyRecipes = async () => {
      try {
        // Fetch user profile
        const userRes = await api.get('/auth/me');
        setUserName(userRes.data?.data?.name || userRes.data?.name || 'Chef');

        // Fetch user recipes
        const res = await api.get('/recipes?mine=1');
        setRecipes(res.data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmed = await toast.confirm('¿Seguro que deseas eliminar esta receta?', { danger: true, confirmText: 'Eliminar' });
    if (!confirmed) return;

    try {
      await api.delete(`/recipes/${id}`);
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (err) {
      toast.error('Error eliminando receta');
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.post(`/recipes/${id}/publish`);
      setRecipes(recipes.map(r => r.id === id ? { ...r, status: 'published' } : r));
      setActiveTab('publicadas');
      toast.success('¡Receta publicada con éxito!');

    } catch (err) {
      if (err.response?.status === 422) {
        const msg = err.response.data.message || '';
        if (msg.toLowerCase().includes('foto') || msg.toLowerCase().includes('image')) {
          const goGallery = await toast.confirm(msg + '\n\n¿Quieres ir a la galería para subir una foto ahora?', { confirmText: 'Ir a galería' });
          if (goGallery) {

            navigate(`/edit/${id}/media`);
          }
          return;
        }
        toast.error(msg);
      } else {
        toast.error('Error publicando la receta');
        console.error(err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch(e) {
      console.error(e);
    } finally {
      localStorage.removeItem('access_token');
      navigate('/login');
    }
  };

  const publishedRecipes = recipes.filter(r => r.status === 'published');
  const draftRecipes = recipes.filter(r => r.status === 'draft');

  const currentList = activeTab === 'publicadas' ? publishedRecipes : draftRecipes;

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-2xl">Cargando mis recetas...</div>;  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans text-gray-800 flex flex-col relative overflow-hidden">
      
      {/* Full-width Top Header */}
      <header className="w-full h-24 bg-[#ffb800] px-8 flex justify-between items-center shadow-md relative z-50">
        <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center h-full">
          <div className="flex items-center gap-4">
            <Link to="/" className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform -rotate-12 hover:rotate-0 transition-transform flex-shrink-0 overflow-hidden p-2">
              <img src={tomateImg} alt="Tomate Logo" className="w-full h-full object-contain" />
            </Link>
              <img src={customLogo} alt="Salsa de Tomate" style={{width: '250px', marginTop: '8px'}} />
          </div>
          <div className="flex gap-4">
            <Link to="/explore" className="px-6 py-2.5 outline outline-2 outline-white text-white font-black text-lg md:text-xl rounded-full hover:bg-white/10 transition-colors hidden sm:block">Explorar Recetas</Link>
            <button onClick={handleLogout} className="px-6 py-2.5 bg-white text-red-500 font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors border-2 border-red-100">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1500px] mx-auto p-4 md:p-8 lg:p-12 relative z-10">
        
        {/* Single Outer Container for all info */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-12 relative overflow-hidden min-h-[700px]">
          
          {/* Decorative background element inside the white wrapper */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#fef3c7] rounded-bl-full opacity-60 pointer-events-none z-0"></div>

          {/* Left Column (Main Content) */}
          <div className="flex-grow lg:w-2/3 relative z-10">
            
            {/* Header Texts */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-black text-[#1a2e35] mb-3">Mis recetas</h1>
              <h2 className="text-3xl text-gray-700 font-bold mb-2">Hola, {userName}</h2>
              <p className="text-gray-500 font-bold text-lg">desde aquí puedes gestionar tus recetas</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-between items-center border-b border-gray-200 mb-8 w-full pr-2">
              <div className="flex gap-8">
                <button 
                  onClick={() => setActiveTab('publicadas')}
                  className={`pb-4 text-xl font-bold transition-colors relative ${activeTab === 'publicadas' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Publicadas
                  {activeTab === 'publicadas' && <div className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-[#ffb800]"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab('borradores')}
                  className={`pb-4 text-xl font-bold transition-colors relative ${activeTab === 'borradores' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Borradores
                  {activeTab === 'borradores' && <div className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-[#ffb800]"></div>}
                </button>
              </div>
              <Link to="/categories" className="pb-4 text-lg font-bold text-[#1e8b4d] hover:text-green-800 transition-colors hidden sm:block">
                Administrar Categorías &rsaquo;
              </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex-grow min-w-[250px]">
                <input type="text" placeholder="Buscar en mis recetas..." className="w-full border border-gray-200 rounded-xl px-5 py-3 font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent transition-all shadow-sm" />
              </div>
              <select className="border border-gray-200 rounded-xl px-5 py-3 bg-white font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffb800] shadow-sm cursor-pointer">
                <option>Categoria</option>
                <option>Mariscos</option>
                <option>Mexicana</option>
              </select>
              <select className="border border-gray-200 rounded-xl px-5 py-3 bg-white font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffb800] shadow-sm cursor-pointer">
                <option>Mas recientes</option>
                <option>Mas antiguas</option>
              </select>
              <button className="bg-[#ffb800] text-gray-900 font-black px-8 py-3 rounded-xl hover:bg-yellow-500 transition-colors shadow-sm flex items-center justify-center gap-2">
                <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                Filtrar
              </button>
            </div>

            {/* Recipe Cards List */}
            <div className="space-y-5">
              {currentList.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xl text-gray-500 font-bold mb-4">No tienes recetas aquí por el momento.</p>
                  <Link to="/create" className="inline-block px-8 py-3 outline outline-2 outline-[#1e8b4d] text-[#1e8b4d] font-bold rounded-xl hover:bg-green-50 transition-colors">Crear nueva receta</Link>
                </div>
              ) : (
                currentList.map((recipe) => (
                  <div key={recipe.id} className="flex flex-col sm:flex-row bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <img src={recipe.main_image?.url || recipeImg} alt={recipe.title} className="w-full sm:w-56 h-48 sm:h-auto object-cover flex-shrink-0" />
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-bold text-gray-800">{recipe.title}</h3>
                          <span className={`px-4 py-1.5 text-xs font-black rounded-lg border ml-4 flex-shrink-0 ${recipe.status === 'published' ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {recipe.status === 'published' ? 'Publicada' : 'Borrador'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm font-bold text-gray-800">
                          <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
                          <span className="flex items-center text-[#ffb800]"><span className="text-lg mr-1 leading-none">★</span> {Number(recipe.average_rating || 0).toFixed(1)}</span>
                        </div>
                      </div>
                        <div className="flex flex-wrap gap-3 mt-6">
                          <Link to={`/edit/${recipe.id}`} className="px-6 py-2 bg-[#1e8b4d] text-white font-bold rounded-lg hover:bg-green-800 transition-colors shadow-sm text-center">Editar</Link>
                          {recipe.status === 'published' && (
                            <Link to={`/recipe/${recipe.id}`} className="px-6 py-2 border-2 border-gray-400 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors text-center">Ver</Link>
                          )}
                          {recipe.status === 'draft' && (
                            <button onClick={() => handlePublish(recipe.id)} className="px-6 py-2 border-2 border-[#1e8b4d] text-[#1e8b4d] font-bold rounded-lg hover:bg-green-50 transition-colors text-center">Publicar</button>
                          )}
                          <button onClick={() => handleDelete(recipe.id)} className="px-6 py-2 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-50 transition-colors text-center">Eliminar</button>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Right Column (Call to Actions) */}
          <div className="xl:w-1/3 flex flex-col gap-6 relative z-10 pt-4 xl:pt-16">
                        {/* 1. Card para cuando NO hay recetas publicadas */}
              {publishedRecipes.length === 0 && (
                <div className="bg-[#f8f5f0] rounded-[2rem] p-8 text-center shadow-sm">
                  <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm overflow-hidden">
                    <img src={platilloImg} alt="Platillo" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1a2e35] mb-3 leading-tight">¡Aún no has compartido tu sazón!</h3>
                  <p className="text-gray-600 font-bold mb-8 text-sm px-2">Crea tu primera receta aquí y empieza a compartir tus mejores platillos.</p>
                  
                  <Link to="/create" className="w-full bg-[#1e8b4d] hover:bg-green-800 text-white font-black py-4 px-6 rounded-xl transition-colors shadow-md text-lg block text-center">
                    Crear nueva receta
                  </Link>
                </div>
              )}

              {/* 2. Card para cuando NO hay borradores */}
              {draftRecipes.length === 0 && (
                <div className="bg-white border-2 border-[#f0f0f0] rounded-[2rem] p-8 text-center shadow-sm">
                  <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 overflow-hidden">
                    <img src={platilloImg} alt="Platillo" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1a2e35] mb-3 leading-tight">No tienes borradores por ahora.</h3>
                  <p className="text-gray-500 font-bold mb-8 text-sm px-2">Cuando guardes una receta sin publicar, aparecerá aquí.</p>
                  
                  <Link to="/create" className="w-full bg-[#1e8b4d] hover:bg-green-800 text-white font-black py-4 px-6 rounded-xl transition-colors shadow-md text-lg block text-center">
                    Crear receta
                  </Link>
                </div>
              )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default MyRecipes;
