import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';
import tomateImg from '../assets/tomate.png';
import customLogo from '../assets/logo.png';
import { useToast } from '../components/Toast';



const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();


  useEffect(() => {
    // Fetch categories
    api.get('/categories')
      .then(res => setCategories(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Handle creating a new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (newCategoryName.trim() !== '') {
      try {
        const res = await api.post('/categories', { name: newCategoryName });
        setCategories([...categories, res.data.data]);
        setNewCategoryName('');
        toast.success('¡Categoría creada con éxito!');

      } catch (err) {
        toast.error('Error al crear categoría');
        console.error(err);
      }
    }
  };

  // Filter categories based on search input
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      {/* Header Area */}
      <header className="w-full h-24 bg-[#ffb800] px-8 flex justify-between items-center shadow-md relative z-50">
        <div className="max-w-[1400px] mx-auto w-full flex justify-between items-center h-full">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner transform group-hover:scale-105 pointer-events-auto transition-transform p-2">
              <img src={tomateImg} alt="Tomate Logo" className="w-full h-full object-contain" />
            </div>
              <img src={customLogo} alt="Salsa de Tomate" style={{width: '250px', marginTop: '8px'}} />
          </Link>

          {/* User Actions */}
          <nav className="flex items-center gap-3">
             <Link to="/login" className="hidden sm:inline-block px-5 py-2.5 rounded-full font-bold text-orange-900 bg-white/40 hover:bg-white/60 transition-colors">
              Ingresar
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full font-bold text-white border-2 border-white hover:bg-white hover:text-orange-500 transition-colors hidden sm:block">
              Regístrate
            </Link>
            <Link to="/my-recipes" className="px-6 py-2.5 rounded-full font-bold text-orange-700 bg-white hover:shadow-md transition-all">
              Mis recetas
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12 relative z-10 w-full">

        {/* Single Outer White Container */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden min-h-[700px]">
          
          {/* Decorative background element inside the white wrapper */}
          <div className="absolute top-0 right-0 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[#fef3c7] rounded-bl-full opacity-60 pointer-events-none z-0"></div>

          {/* Actual Content Wrapper (z-10 to stay above bg decoration) */}
          <div className="relative z-10 w-full">
            
            {/* Header / Breadcrumbs */}
            <div className="mb-10">
              <p className="text-sm font-bold text-gray-500 mb-3">
                <Link to="/my-recipes" className="hover:text-gray-800">Mis recetas</Link> &rsaquo; <span className="text-gray-800">Categorías</span>
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-[#1a2e35] mb-2">Categorías</h1>
              <p className="text-gray-600 font-bold text-lg">Crea y administra tus categorías para organizar mejor tus recetas.</p>
            </div>

            {/* Two Column Layout for Forms and Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* LEFT COLUMN: Create Category */}
              <div>
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 h-full">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear categoría</h2>
                  
                  <form onSubmit={handleCreateCategory}>
                    <div className="mb-4">
                      <label htmlFor="categoryName" className="block text-gray-700 font-bold mb-3">
                        Nombre de la categoría
                      </label>
                      <input 
                        type="text" 
                        id="categoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Ej. Italiana, Postres, Sopas..."
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all font-medium text-gray-700 text-lg"
                      />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-2 mt-6">
                      <button 
                        type="submit"
                        className="bg-[#1e8b4d] hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors inline-block"
                      >
                        Crear
                      </button>
                      <Link 
                        to="/create"
                        className="border-2 border-gray-800 text-gray-800 hover:bg-gray-100 font-bold py-2.5 px-6 rounded-full transition-colors text-center inline-block"
                      >
                        Ir al editor
                      </Link>
                    </div>
                    <p className="text-sm font-bold text-gray-600 pt-3">
                      Tip: usa nombres cortos y claros (1-2 palabras).
                    </p>
                  </form>
                </div>
              </div>

              {/* RIGHT COLUMN: Manage Categories List */}
              <div>
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 h-full flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis categorías</h2>
                  
                  {/* Search bar */}
                  <div className="mb-6 relative">
                    <input 
                      type="text" 
                      placeholder="Buscar categoría..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all font-medium text-gray-700 text-lg shadow-sm"
                    />
                  </div>

                  {/* Categories List */}
                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 flex-grow">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map(category => (
                        <div key={category.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-gray-300 bg-white shadow-sm hover:shadow-md transition-all gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                            <p className="text-sm font-bold text-gray-400">ID: {category.id} - {category.slug}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-gray-400 font-bold px-3">Edición no soportada</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500 font-bold border-2 border-dashed rounded-2xl">
                        No se encontraron categorías.
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div> {/* End Two Column Layout */}
          </div> {/* End Actual Content Wrapper */}
        </div> {/* End Outer White Container */}

      </main>
    </div>
  );
};

export default Categories;
