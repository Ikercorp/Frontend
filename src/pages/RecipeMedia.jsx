import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/axios';
import tomateImg from '../assets/tomate.png';
import customLogo from '../assets/logo.png';
import { useToast } from '../components/Toast';



const RecipeMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();


  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        if (res.data.data.media) {
          setPhotos(res.data.data.media);
        }
      } catch (err) {
        console.error(err);
        toast.error('Error cargando medios de la receta');
        navigate('/my-recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, [id, navigate]);

  const primaryPhoto = photos.find(p => p.is_primary) || photos[0];

  const handleSetPrimary = async (mediaId) => {
    try {
      await api.patch(`/recipes/${id}/media/${mediaId}/primary`);
      setPhotos(photos.map(p => ({
        ...p,
        is_primary: p.id === mediaId
      })));
    } catch(err) {
      console.error(err);
      toast.error('Error cambiando foto principal');
    }
  };

  const handleDelete = async (mediaId) => {
    const confirmed = await toast.confirm('¿Seguro que deseas eliminar esta foto?', { danger: true, confirmText: 'Eliminar' });
    if (!confirmed) return;

    try {
      await api.delete(`/recipes/${id}/media/${mediaId}`);
      setPhotos(photos.filter(p => p.id !== mediaId));
    } catch(err) {
      console.error(err);
      toast.error('Error al eliminar la foto');
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
       const file = files[i];
       const formData = new FormData();
       formData.append('file', file);
       
       try {
           const res = await api.post(`/recipes/${id}/media`, formData, {
               headers: {
                   'Content-Type': 'multipart/form-data'
               }
           });
           setPhotos(prev => [...prev, res.data.data]);
       } catch (err) {
           console.error("Error al subir imagen:", err.response?.data || err.message);
           toast.error('Hubo un error subiendo la imagen: ' + file.name);
       }
    }
    setUploading(false);
    e.target.value = null;
  };

  if (loading) return <div className="min-h-screen flex text-2xl font-bold justify-center items-center">Cargando fotos...</div>;

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <header className="w-full h-24 bg-[#ffb800] px-8 flex justify-between items-center shadow-md relative z-50">
        <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center h-full">
          <Link to="/" className="flex items-center group gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner transform group-hover:scale-105 transition-transform overflow-hidden p-2">
              <img src={tomateImg} alt="Tomate Logo" className="w-full h-full object-contain" />
            </div>
              <img src={customLogo} alt="Salsa de Tomate" style={{width: '250px', marginTop: '8px'}} />
          </Link>
          <div className="flex gap-4">
            {localStorage.getItem('access_token') ? (
              <>
                <Link to="/explore" className="px-6 py-2.5 bg-white text-[#ffb800] font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors hidden sm:block">Explorar</Link>
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
      <main className="flex-grow w-full max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden min-h-[700px]">
          <div className="absolute top-0 right-0 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[#fef3c7] rounded-bl-full opacity-60 pointer-events-none z-0"></div>
          <div className="relative z-10 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div>
                <p className="text-sm font-bold text-gray-500 mb-3">
                  <Link to="/my-recipes" className="hover:text-gray-800">Mis recetas</Link> &rsaquo; <Link to={`/edit/${id}`} className="hover:text-gray-800">Editor</Link> &rsaquo; <span className="text-gray-800">Galería / Media</span>
                </p>
                <h1 className="text-4xl md:text-5xl font-black text-[#1a2e35] mb-2">Galería / Media</h1>
                <p className="text-gray-600 font-bold text-lg">Sube fotos para tu receta. Puedes elegir una foto principal.</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 relative">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  disabled={uploading}
                />
                <button className="bg-[#1e8b4d] hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50" disabled={uploading}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  {uploading ? 'Subiendo...' : 'Subir fotos'}
                </button>
                <button onClick={() => navigate(`/edit/${id}`)} className="bg-white border-2 border-gray-800 text-gray-800 hover:bg-gray-100 font-bold py-2.5 px-6 rounded-full transition-colors relative z-20">
                  Volver al editor
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 h-full flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">Tus fotos</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center mb-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group relative">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp" 
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    disabled={uploading}
                  />
                  <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-500 group-hover:text-gray-700 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <p className="text-gray-800 font-bold mb-1">Haz clic o arrastra imágenes aquí para subir</p>
                  <p className="text-gray-500 text-sm font-medium">Formatos recomendados: JPG/PNG/WEBP.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 flex-grow content-start overflow-y-auto custom-scrollbar pr-2">
                  {photos.length === 0 && <p className="text-gray-400 font-medium col-span-full">No hay fotos subidas todavía.</p>}
                  {photos.map(photo => (
                    <div key={photo.id} className={`relative aspect-square rounded-2xl overflow-hidden group border-4 cursor-pointer transition-all ${photo.is_primary ? 'border-yellow-400' : 'border-transparent hover:border-gray-200'}`} onClick={() => handleSetPrimary(photo.id)}>
                      <img src={photo.url} alt="Recipe Thumbnail" className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-black/40 transition-opacity ${photo.is_primary ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSetPrimary(photo.id); }}
                            className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:text-yellow-500 shadow-sm"
                            title="Marcar como principal"
                          >
                            <svg className={`w-4 h-4 ${photo.is_primary ? 'text-yellow-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }}
                            className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 shadow-sm"
                            title="Eliminar foto"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </div>
                      {photo.is_primary && (
                        <div className="absolute bottom-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
                          Principal
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col h-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">Vista previa</h2>
                {primaryPhoto ? (
                  <div className="flex flex-col h-full">
                    <div className="w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden shadow-sm mb-6 bg-gray-100">
                      <img src={primaryPhoto.url} alt="Vista previa principal" className="w-full h-full object-cover" />
                    </div>
                    <div className="mb-8">
                      <p className="text-gray-800 font-bold text-lg flex items-center gap-2">
                        Foto seleccionada: 
                        {primaryPhoto.is_primary ? (
                           <span className="text-[#1e8b4d] font-black">Principal</span>
                        ) : (
                           <span className="text-gray-500 font-medium">Secundaria</span>
                        )}
                      </p>
                      <p className="text-gray-500 text-sm font-bold mt-1">Tip: la foto principal es la que aparece en el feed.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-auto">
                      {!primaryPhoto.is_primary && (
                        <button 
                          onClick={() => handleSetPrimary(primaryPhoto.id)}
                          className="bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100 font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                          Marcar como principal
                        </button>
                      )}
                      <button 
                         onClick={() => handleDelete(primaryPhoto.id)}
                         className="bg-white border-2 border-gray-700 text-gray-700 hover:border-red-500 hover:text-red-500 font-bold py-2.5 px-6 rounded-xl transition-colors"
                      >
                        Eliminar foto
                      </button>
                      <button 
                        onClick={() => navigate(`/edit/${id}`)}
                        className="bg-white border-2 border-gray-700 text-gray-700 hover:bg-gray-100 font-bold py-2.5 px-6 rounded-xl transition-colors ml-auto hidden sm:block"
                      >
                        Volver al editor
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-200 rounded-3xl min-h-[300px]">
                    No hay fotos seleccionadas
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeMedia;
