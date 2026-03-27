import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heroBowl from '../assets/plato.png'; 
import { api } from '../api/axios';
import tomateImg from '../assets/tomate.png';
import customLogo from '../assets/logo.png';


export default function LandingPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top 3 latest recipes from Laravel API
    api.get('/recipes?per_page=3')
      .then(response => {
        setRecipes(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark overflow-hidden pb-12 relative">
      
      {/* Background Shape - CSS puro, limpio y curveado */}
      <div 
        className="absolute top-0 right-0 w-[100%] md:w-[65%] h-[750px] md:h-[950px] bg-brand-yellow z-0"
        style={{
          borderBottomLeftRadius: '100% 80%',
        }}
        aria-hidden="true"
      ></div>

      {/* Dynamic Header Section */}
      <header className="relative w-full pt-8 pb-16 md:pt-12 md:pb-24 flex flex-col items-center z-10">
        
        {/* Navigation / Header Actions (Mock for visual presence, optional to extract) */}
        <div className="absolute top-0 left-0 w-full z-50 px-8 h-24 flex items-center">
          <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center h-full">
            <Link to="/" className="flex items-center group gap-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner transform group-hover:scale-105 transition-transform overflow-hidden p-2">
                <img src={tomateImg} alt="Tomate Logo" className="w-full h-full object-contain" />
              </div>
              <img src={customLogo} alt="Salsa de Tomate" style={{width: '250px', marginTop: '8px'}} />
            </Link>
            <nav className="flex gap-4">
              {localStorage.getItem('access_token') ? (
                <>
                  <Link to="/explore" className="px-6 py-2.5 bg-white text-[#ffb800] font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors">Explorar</Link>
                  <Link to="/my-recipes" className="px-6 py-2.5 bg-white text-[#ffb800] font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors">Mis recetas</Link>
                  <button onClick={() => { localStorage.removeItem('access_token'); window.location.href='/login'; }} className="px-6 py-2.5 bg-white text-red-500 font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors border-2 border-red-100 hidden md:block">Salir</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-6 py-2.5 bg-white text-[#ffb800] font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors">Ingresar</Link>
                  <Link to="/register" className="px-6 py-2.5 outline outline-2 outline-white text-white font-black text-lg md:text-xl rounded-full hover:bg-white/10 transition-colors">Regístrate</Link>
                </>
              )}
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between z-20 relative mt-6 md:mt-10">
          
          {/* Text Content */}
          <div className="w-full md:w-[45%] flex flex-col items-start gap-6 pt-10 md:pt-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 relative z-20">
              Inspírate y cocina <br /> con nosotros
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 max-w-md font-medium mt-2 relative z-20">
              Comparte tus mejores recetas y descubre nuevas delicias cada día.
            </p>
            <button 
              onClick={() => navigate('/explore')}
              className="mt-4 px-10 py-4 bg-brand-yellow hover:bg-brand-orange text-white text-xl font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-300 relative z-30 cursor-pointer"
            >
              Explora
            </button>
          </div>

          {/* Hero Image with Floating Elements */}
          <div className="w-full md:w-[50%] mt-12 md:mt-0 flex justify-center relative">
            
            {/* Soft shadow underneath the bowl for depth */}
            <div className="absolute bottom-[-5%] w-[70%] h-[15%] bg-black/20 blur-2xl rounded-[100%]"></div>
            
            {/* Floating Ingredients (Decorations) */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {/* Lettuce */}
                <img src="https://cdn-icons-png.flaticon.com/512/3014/3014541.png" className="absolute top-[10%] left-[10%] w-16 h-16 drop-shadow-lg opacity-90 -rotate-12" alt="" />
                {/* Tomato */}
                <img src="https://cdn-icons-png.flaticon.com/512/1202/1202125.png" className="absolute top-[5%] right-[25%] w-12 h-12 drop-shadow-lg opacity-90 rotate-12" alt="" />
                {/* Corn */}
                <div className="absolute top-[20%] right-[10%] w-6 h-6 bg-yellow-400 rounded-full drop-shadow-md"></div>
                <div className="absolute bottom-[20%] left-[5%] w-5 h-5 bg-yellow-400 rounded-full drop-shadow-md"></div>
                <div className="absolute bottom-[10%] right-[15%] w-7 h-7 bg-yellow-400 rounded-full drop-shadow-md"></div>
                {/* Olives/Beans */}
                <div className="absolute top-[0%] right-[40%] w-6 h-8 bg-gray-900 rounded-[50%] rotate-45 drop-shadow-md"></div>
                <div className="absolute top-[30%] right-[5%] w-5 h-7 bg-gray-900 rounded-[50%] -rotate-45 drop-shadow-md"></div>
                <div className="absolute bottom-[5%] left-[15%] w-6 h-8 bg-gray-900 rounded-[50%] rotate-[60deg] drop-shadow-md"></div>
            </div>
            


            <div className="relative w-full max-w-[650px] aspect-square z-10 hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl bg-white">
                <img 
                  src={heroBowl} 
                  alt="Plato hondo blanco con ensalada fresca de pollo asado" 
                  className="w-full h-full object-cover scale-[1.15]"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Popular Recipes Section */}
      <section className="container mx-auto px-6 max-w-6xl mt-16 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-10">
          Descubre las recetas más populares
        </h2>

        {/* Mock Recipe Grid (Original Figma Design) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
          
          {/* Card 1 */}
          <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 p-3 pb-6 group">
            <div className="w-full h-48 bg-gray-200 rounded-2xl overflow-hidden">
               <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ensalada de pollo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mt-4 px-2 text-gray-900">Ensalada de pollo</h3>
            <div className="flex items-center gap-4 mt-2 px-2">
              <span className="flex items-center text-brand-yellow font-bold text-lg">
                <svg className="w-5 h-5 mr-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                4.3
              </span>
              <span className="text-gray-500 font-medium text-lg flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                29 min
              </span>
            </div>
          </article>

          {/* Card 2 */}
          <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 p-3 pb-6 group">
            <div className="w-full h-48 bg-gray-200 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mole poblano con pollo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mt-4 px-2 text-gray-900">Mole poblano</h3>
            <div className="flex items-center gap-4 mt-2 px-2">
              <span className="flex items-center text-brand-yellow font-bold text-lg">
                <svg className="w-5 h-5 mr-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                4.9
              </span>
              <span className="text-gray-500 font-medium text-lg flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                123 min
              </span>
            </div>
          </article>

          {/* Card 3 */}
          <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 p-3 pb-6 group">
            <div className="w-full h-48 bg-gray-200 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Pan de cazón" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mt-4 px-2 text-gray-900">Pan de cazón</h3>
            <div className="flex items-center gap-4 mt-2 px-2">
              <span className="flex items-center text-brand-yellow font-bold text-lg">
                <svg className="w-5 h-5 mr-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                4.7
              </span>
              <span className="text-gray-500 font-medium text-lg flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                185 min
              </span>
            </div>
          </article>
        </div>

        <button 
          onClick={() => navigate('/explore')}
          className="px-10 py-4 bg-brand-yellow hover:bg-brand-orange text-white text-xl font-bold rounded-xl shadow-md transition-transform hover:scale-105 mb-16 focus:outline-none focus:ring-4 focus:ring-yellow-300 relative z-20 cursor-pointer"
        >
          Ver todas las recetas
        </button>
      </section>
    </div>
  );
}
