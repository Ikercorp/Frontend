import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/axios';
import tomateImg from '../assets/tomate.png';
import recipeImg from '../assets/recipe_placeholder.png';
import customLogo from '../assets/logo.png';
import { useToast } from '../components/Toast';




export default function RecipeDetail() {
  const { id } = useParams();
  const toast = useToast();

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMediaUrl, setActiveMediaUrl] = useState(null);
  
  // Comment form state
  const [commentBody, setCommentBody] = useState("");
  const [guestName, setGuestName] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  
  const isAuth = !!localStorage.getItem('access_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipeRes, commentRes] = await Promise.all([
          api.get(`/recipes/${id}`),
          api.get(`/recipes/${id}/comments`)
        ]);
        setRecipe(recipeRes.data.data);
        setComments(commentRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Submit rating
      await api.post(`/recipes/${id}/ratings`, {
        stars: rating,
        guest_name: isAuth ? undefined : (guestName || 'Invitado')
      });
      // Submit comment
      if (commentBody.trim()) {
        const res = await api.post(`/recipes/${id}/comments`, {
          body: commentBody,
          guest_name: isAuth ? undefined : (guestName || 'Invitado')
        });
        setComments([res.data.data, ...comments]);
        setCommentBody("");
      }
      toast.success('¡Opinión guardada correctamente!');
      // Update recipe object to reflect new ratings if preferred (or just rely on the alert)
    } catch (err) {
      toast.error('Error al guardar opinión');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 bg-white min-h-screen text-2xl font-black">Cargando receta...</div>;
  if (!recipe) return <div className="text-center py-20 bg-white min-h-screen text-2xl font-black">Receta no encontrada</div>;

  const authorName = recipe.author?.name || 'Autor Desconocido';
  const categoryName = recipe.categories?.[0]?.name || 'Sin categoría';
  const time = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0) + ' min';

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      
      {/* Full-width Top Header (Matches Explore) */}
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
            <Link to="/explore" className="px-6 py-2.5 bg-white text-[#ffb800] font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors">Explorar</Link>
            {isAuth ? (
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

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto p-6 md:p-12 lg:p-16">
        
        {/* Recipe Title & Meta */}
          <div className="mb-10">
            <h1 className="text-5xl md:text-7xl font-black text-[#1a2e35] mb-4 tracking-tight">{recipe.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-lg font-bold text-gray-700">
              <p>Publicado por <span className="text-black">{authorName}</span> — {new Date(recipe.published_at || recipe.created_at).toLocaleDateString()}</p>
              <span className="ml-2 bg-[#fdf0d5] text-[#d48c00] px-4 py-1.5 rounded-full text-sm uppercase tracking-wider">
                {categoryName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: Images, Ingredients, Instructions */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Helper to check and extract YouTube ID */}
              {(() => {
                const getYouTubeId = (url) => {
                  if (!url) return null;
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                  const match = url.match(regExp);
                  return (match && match[2].length === 11) ? match[2] : null;
                };

                const mainMediaUrl = activeMediaUrl || recipe.main_image?.url || recipeImg;
                const mainYtId = getYouTubeId(mainMediaUrl);

                return (
                  <>
                    {/* Main Image or Video */}
                    <div className="rounded-[2.5rem] overflow-hidden shadow-md border-2 border-transparent bg-black aspect-[16/10] flex items-center justify-center">
                      {mainYtId ? (
                        <iframe 
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${mainYtId}?rel=0&autoplay=1`} 
                          title="YouTube video player" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <img src={mainMediaUrl} alt={recipe.title} className="w-full h-full object-cover bg-gray-50 bg-white" />
                      )}
                    </div>

                    {/* Gallery Thumbnails */}
                    {recipe.media && recipe.media.length > 1 && (
                      <div className="grid grid-cols-5 gap-4">
                        {recipe.media.map((img, idx) => {
                          const ytId = getYouTubeId(img.url);
                          const isActive = mainMediaUrl === img.url;
                          return (
                            <div 
                              key={idx} 
                              onClick={() => setActiveMediaUrl(img.url)}
                              className={`rounded-2xl overflow-hidden shadow-sm aspect-[4/3] border-[3px] cursor-pointer transition-all duration-300 bg-gray-50 flex items-center justify-center relative ${isActive ? 'border-green-500 scale-[1.03] shadow-md' : 'border-transparent hover:border-green-300 opacity-70 hover:opacity-100'}`}
                            >
                              {ytId ? (
                                <div className="w-full h-full bg-black relative">
                                  <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={`Video Tumbnail ${idx}`} className="w-full h-full object-cover opacity-80" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-red-600 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center pl-1 shadow-lg">
                                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Action Bar (Time, Rating, Tags) */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="bg-[#f5f5f5] px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-gray-700">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{time}</span>
                </div>
                <div className="bg-[#fff8e6] px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-[#ffb800]">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span>{Number(recipe.average_rating || 0).toFixed(1)} ({recipe.ratings_count || 0})</span>
                </div>
                <div className="bg-[#fdf0f0] px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-red-500">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  <span>{recipe.likes_count || 0}</span>
                </div>
                {recipe.categories && recipe.categories.length > 0 && (
                  <div className="bg-[#f5f5f5] px-6 py-3 rounded-2xl font-bold text-gray-600 truncate max-w-sm">
                    {recipe.categories.map(c => c.name).join(', ')}
                  </div>
                )}
              </div>

              {/* Ingredients Card */}
              <div className="bg-white border-2 border-[#f0f0f0] rounded-[2.5rem] p-10 shadow-sm mt-4">
                <h3 className="text-3xl font-black text-[#1a2e35] mb-6">Ingredientes</h3>
                <ul className="flex flex-col gap-3">
                  {recipe.ingredients && recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-4 group">
                      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xl font-bold text-gray-800">{ing.name} <span className="text-gray-500 font-medium ml-2">- {ing.quantity} {ing.unit}</span></span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions Section */}
              <div className="mt-8">
                <h3 className="text-3xl font-black text-[#1a2e35] mb-6 px-2">Preparación</h3>
                <div className="flex flex-col gap-6 px-2">
                  {recipe.steps && recipe.steps.sort((a,b)=>a.step_number-b.step_number).map((step, idx) => (
                    <p key={idx} className="text-xl font-medium text-gray-800 leading-relaxed bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex gap-4">
                      <span className="text-green-600 font-black text-2xl w-8 flex-shrink-0">{step.step_number}.</span> 
                      <span>{step.instruction}</span>
                    </p>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Sidebar (Actions & Reviews) */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              <Link to="/explore" className="w-full bg-[#f8f5f0] hover:bg-gray-200 text-gray-800 font-bold text-center text-lg py-4 rounded-[1.5rem] transition-colors">
                Volver al feed
              </Link>
              
              {/* Leave Review Form */}
              <form onSubmit={handleSubmitReview} className="bg-white border-2 border-[#f0f0f0] rounded-[2rem] p-8 shadow-sm flex flex-col gap-4">
                <h4 className="text-2xl font-black text-[#1a2e35]">Dejar Opinión</h4>
                
                {!isAuth && (
                  <input type="text" placeholder="Tu nombre (opcional)" value={guestName} onChange={e=>setGuestName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                )}
                
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">Calificación:</span>
                  <select value={rating} onChange={(e) => setRating(e.target.value)} className="p-2 border border-gray-200 rounded-xl font-bold outline-none cursor-pointer bg-white">
                    <option value="5">⭐⭐⭐⭐⭐ 5</option>
                    <option value="4">⭐⭐⭐⭐ 4</option>
                    <option value="3">⭐⭐⭐ 3</option>
                    <option value="2">⭐⭐ 2</option>
                    <option value="1">⭐ 1</option>
                  </select>
                </div>

                <textarea placeholder="Escribe tu comentario..." value={commentBody} onChange={e=>setCommentBody(e.target.value)} required rows="3" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-green-500"></textarea>

                <button type="submit" disabled={submitting} className="w-full bg-[#1b8c53] hover:bg-green-700 text-white font-bold text-lg py-4 rounded-[1.5rem] shadow-md transition-colors disabled:opacity-50">
                  {submitting ? 'Guardando...' : 'Enviar Evaluación'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="bg-white border-2 border-[#f0f0f0] rounded-[2rem] p-8 shadow-sm">
                <h4 className="text-2xl font-black text-[#1a2e35] mb-6">Comentarios</h4>
                
                <div className="flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-2">
                  {comments.length === 0 && <p className="text-gray-500 font-medium">No hay opiniones aún. ¡Sé el primero!</p>}
                  {comments.map((comment, idx) => (
                    <div key={idx} className="flex flex-col border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">
                            {(comment.guest_name || comment.user?.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-black text-gray-800 text-sm">{comment.guest_name || comment.user?.name || 'Invitado'}</span>
                        </div>
                        <span className="text-xs text-gray-400 font-bold">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 font-bold text-base leading-tight mt-1 pl-11">
                        {comment.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
          
        </main>
    </div>
  );
}
