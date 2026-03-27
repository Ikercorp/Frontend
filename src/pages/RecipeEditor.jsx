import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/axios';
import tomateImg from '../assets/tomate.png';
import customLogo from '../assets/logo.png';
import { useToast } from '../components/Toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';


function RecipeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [servings, setServings] = useState('');
  
  const [ingredients, setIngredients] = useState([
    { id: 1, value: '' },
  ]);

  const [steps, setSteps] = useState([
    { id: 1, value: '' },
  ]);

  const [dbCategories, setDbCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [hasMainImage, setHasMainImage] = useState(false);


  useEffect(() => {
    // Load categories
    api.get('/categories').then(res => setDbCategories(res.data.data)).catch(console.error);

    if (isEditMode) {
      // Load recipe for editing
      api.get(`/recipes/${id}`).then(res => {
        const data = res.data.data;
        setTitle(data.title || '');
        setDescription(data.description || data.summary || '');
        setPrepTime(data.prep_time_minutes || '');
        setServings(data.servings || '');
        
        if (data.ingredients?.length > 0) {
          setIngredients(data.ingredients.map((ing, idx) => ({ id: Date.now() + idx, value: ing.name })));
        }
        
        if (data.steps?.length > 0) {
          setSteps(data.steps.map((st, idx) => ({ id: Date.now() + idx, value: st.instruction })));
        }
        
        if (data.categories?.length > 0) {
          setSelectedCategories(data.categories.map(c => c.id));
        }

        if (data.main_image) {
          setHasMainImage(true);
        }

      }).catch(err => {
        console.error(err);
        toast.error('Error cargando receta');
        navigate('/my-recipes');
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [id, isEditMode, navigate]);

  const addIngredient = () => setIngredients([...ingredients, { id: Date.now(), value: '' }]);
  const removeIngredient = (id) => setIngredients(ingredients.filter(ing => ing.id !== id));
  const updateIngredient = (id, value) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, value } : ing));
  };

  const addStep = () => setSteps([...steps, { id: Date.now(), value: '' }]);
  const removeStep = (id) => setSteps(steps.filter(step => step.id !== id));
  const updateStep = (id, value) => {
    setSteps(steps.map(step => step.id === id ? { ...step, value } : step));
  };

  const toggleCategory = (catId) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSave = async (status) => {
    if (!title.trim()) {
      toast.warning('El título es obligatorio');
      return;
    }

    if (status === 'published' && !hasMainImage) {
      toast.warning('La receta debe tener al menos una foto antes de publicarse. Por favor, guarda el borrador y sube una foto en la galería.');
      return;
    }


    setSaving(true);
    const payload = {
      title,
      description,
      prep_time_minutes: prepTime ? parseInt(prepTime) : null,
      servings: servings ? parseInt(servings) : null,
      status: status, // 'draft' or 'published'
      category_ids: selectedCategories,
      ingredients: ingredients.filter(i => i.value.trim()).map(i => ({ name: i.value })),
      steps: steps.filter(s => s.value.trim()).map(s => ({ instruction: s.value }))
    };

    try {
      if (isEditMode) {
        await api.put(`/recipes/${id}`, payload);
        toast.success('¡Receta actualizada!');
        navigate('/my-recipes');
      } else {
        const res = await api.post('/recipes', payload);
        const newId = res.data.data?.id || res.data.id;
        toast.success('¡Receta creada! Ahora puedes añadir fotos.');
        navigate(`/edit/${newId}`);
      }
    } catch (err) {
      console.error('Error detail:', err);
      const errorMsg = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message || err.message || 'Error guardando receta';
      
      toast.error(errorMsg);

    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 bg-white min-h-screen text-2xl font-black text-gray-800">Cargando editor...</div>;
  // Handled above

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans text-gray-800 flex flex-col">
      
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
            {localStorage.getItem('access_token') ? (
              <>
                <Link to="/explore" className="px-6 py-2.5 outline outline-2 outline-white text-white font-black text-lg md:text-xl rounded-full hover:bg-white/10 transition-colors hidden sm:block">Explorar</Link>
                <Link to="/my-recipes" className="px-6 py-2.5 bg-white text-[#ffb800] font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors">Mis recetas</Link>
                <button onClick={() => { localStorage.removeItem('access_token'); navigate('/login'); }} className="px-6 py-2.5 bg-white text-red-500 font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors border-2 border-red-100 hidden md:block">Salir</button>
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

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12 relative z-10">

        {/* Single Outer Container for all info */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-8 lg:gap-16 relative overflow-hidden min-h-[800px]">
          
          {/* Decorative background element inside the white wrapper */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#fef3c7] rounded-bl-full opacity-60 pointer-events-none z-0"></div>

          {/* Left Column (Forms) */}
          <div className="flex-grow space-y-12 lg:w-2/3 xl:w-3/4 relative z-10">
            
            {/* Breadcrumb & Title */}
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-500 mb-3">
                <Link to="/my-recipes" className="hover:text-gray-800">Mis recetas</Link> &rsaquo; <span className="text-gray-800">Crear receta</span>
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-[#1a2e35] mb-3">{isEditMode ? 'Editar receta' : 'Nueva receta'}</h1>
              <p className="text-gray-600 font-bold text-lg">Completa los datos y guarda como borrador o publica cuando estés listo.</p>
            </div>

            {/* Datos Básicos Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Datos básicos</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Título</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Paella Valenciana" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent transition-all font-bold text-gray-800" />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Descripción</label>
                  <div className="quill-wrapper rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#ffb800] focus-within:border-transparent transition-all">
                    <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                      placeholder="Describe la receta..."
                      modules={{
                        toolbar: [
                          ['bold', 'italic', 'underline'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link'],
                          ['clean']
                        ]
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Tiempo estimado (min)</label>
                    <input type="number" min="0" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="Ej. 60" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent transition-all font-bold text-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Porciones</label>
                    <input type="number" min="1" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="Ej. 4" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent transition-all font-bold text-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredientes Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Ingredientes</h2>
              
              <button onClick={addIngredient} className="mb-6 px-4 py-2 bg-[#f3f4f6] text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm">
                + Agregar ingrediente
              </button>

              <div className="space-y-4">
                {ingredients.map((ing) => (
                  <div key={ing.id} className="flex gap-3">
                    <input 
                      type="text" 
                      value={ing.value} 
                      onChange={(e) => updateIngredient(ing.id, e.target.value)}
                      placeholder="Ej. 1 taza de arroz"
                      className="flex-grow border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent transition-all font-bold text-gray-800" 
                    />
                    <button 
                      onClick={() => removeIngredient(ing.id)}
                      className="px-6 py-3 border-2 border-gray-400 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pasos Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Pasos</h2>
              
              <button onClick={addStep} className="mb-6 px-4 py-2 bg-[#f3f4f6] text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm">
                + Agregar paso
              </button>

              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex gap-3">
                    <input 
                      type="text" 
                      value={step.value}
                      onChange={(e) => updateStep(step.id, e.target.value)}
                      placeholder="Ej. Calienta el aceite..."
                      className="flex-grow border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent transition-all font-bold text-gray-800" 
                    />
                    <button 
                      onClick={() => removeStep(step.id)}
                      className="px-6 py-3 border-2 border-gray-400 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorías Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Categorías</h2>
              
              <div className="flex flex-wrap gap-3 mb-4">
                {dbCategories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-5 py-2 font-bold rounded-full transition-colors ${selectedCategories.includes(cat.id) ? 'bg-[#e8f5e9] text-[#1e8b4d] border border-[#a5d6a7]' : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'}`}
                  >
                    {cat.name}
                  </button>
                ))}
                <Link to="/categories" className="px-5 py-2 border-2 border-gray-400 text-gray-500 font-bold rounded-full hover:bg-gray-50 transition-colors text-center inline-block">+ Administrar nuevas</Link>
              </div>
              <p className="text-sm font-bold text-gray-500">Tip: selecciona 1-3 categorías para que sea más fácil encontrar tu receta.</p>
            </div>

          </div>

          {/* Right Column (Sticky Actions) */}
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2 lg:border-none lg:pb-0">Acciones</h2>
              <p className="text-sm font-bold text-gray-600 mb-1 lg:mt-6">Estado actual: <span className="text-black">Borrador</span></p>
              <p className="text-xs text-gray-500 font-bold mb-6">Puedes guardar cambios y publicar cuando quieras.</p>
              
              <div className="space-y-4">
                <button onClick={() => handleSave('draft')} disabled={saving} className="w-full py-4 bg-[#f3f4f6] text-gray-700 border border-gray-200 font-black rounded-xl shadow-sm hover:bg-gray-200 transition-colors text-lg disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Guardar borrador'}
                </button>
                <button onClick={() => handleSave('published')} disabled={saving} className="w-full py-4 bg-[#1e8b4d] text-white font-black rounded-xl shadow hover:bg-green-800 transition-colors text-lg disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Publicar'}
                </button>
                
                <hr className="my-6 border-gray-200" />
                
                {isEditMode ? (
                  <Link to={`/edit/${id}/media`} className="w-full py-3 bg-[#f3f4f6] text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm flex justify-center items-center">
                    Administrar fotos (galería)
                  </Link>
                ) : (
                  <div className="w-full py-3 bg-gray-50 text-gray-400 font-bold rounded-xl border border-dashed border-gray-200 text-sm flex justify-center items-center text-center px-4">
                    Guarda el borrador primero para subir fotos
                  </div>
                )}
                <Link to="/my-recipes" className="w-full py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex justify-center items-center text-sm">
                  Volver a Mis recetas
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default RecipeEditor;
