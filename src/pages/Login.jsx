import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import chefImg from '../assets/abuelita.png';
import { api } from '../api/axios';
import tomateImg from '../assets/tomate.png';
import customLogo from '../assets/logo.png';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/my-recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#ffb800] relative overflow-hidden flex flex-col font-sans">
      
      {/* Top Header Franja Naranja */}
      <header className="relative z-50 w-full h-24 bg-[#ffb800] px-8 flex justify-between items-center flex-shrink-0 shadow-md">
        <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center h-full">
          {/* Left Side: Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center group gap-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner transform group-hover:scale-105 transition-transform overflow-hidden p-2">
                <img src={tomateImg} alt="Tomate Logo" className="w-full h-full object-contain" />
              </div>
                <img src={customLogo} alt="Salsa de Tomate" style={{width: '250px', marginTop: '8px'}} />
            </Link>
          </div>
          
          {/* Navigation Buttons (Pill style) */}
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2.5 bg-white text-[#ffb800] font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors">
              Ingresar
            </Link>
            <Link to="/register" className="px-6 py-2.5 outline outline-2 outline-white text-white font-black text-lg md:text-xl rounded-full hover:bg-white/10 transition-colors">
              Regístrate
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area (Background Blobs & Split Layout) */}
      <div className="relative flex-grow flex items-center justify-center w-full overflow-hidden bg-[#faf9f6]">
        
        {/* BLOB 1: Blanco/crema grande a la izquierda */}
        <div 
          className="absolute top-[-10%] left-[-5%] w-[120%] md:w-[65%] h-[120%] bg-white z-0 shadow-sm" 
          style={{ borderBottomRightRadius: '900px 700px', borderTopRightRadius: '200px' }}
          aria-hidden="true"
        ></div>
        
        {/* BLOB 2: Único naranja grande en la derecha superior */}
        <div 
          className="absolute top-0 right-0 w-[80%] md:w-[45%] h-[60%] md:h-[70%] bg-[#ffb800]/80 z-0"
          style={{ borderBottomLeftRadius: '100% 70%' }}
          aria-hidden="true"
        ></div>

        {/* BLOB 3: Único naranja pequeño en la esquina inferior derecha */}
        <div 
          className="absolute bottom-[-5%] right-[-5%] w-[40%] md:w-[35%] h-[15%] md:h-[20%] bg-[#ffb800]/80 z-0"
          style={{ borderTopLeftRadius: '100% 120%' }}
          aria-hidden="true"
        ></div>

        {/* Inner Content */}
        <main className="relative z-10 flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto w-full px-6 py-6 gap-12">
        
        {/* Left Side: Chef Image */}
        <div className="hidden md:flex w-1/2 justify-center items-center relative">
          <img 
            src={chefImg} 
            alt="Chef sonriente con ingredientes" 
            className="w-full max-w-lg object-contain drop-shadow-2xl z-10"
            style={{ mixBlendMode: 'multiply' }} // Ayuda a que los fondos blancos de la IA se mezclen
          />
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
          <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-8 md:p-12 max-w-md w-full flex flex-col relative overflow-hidden">
            
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Iniciar sesión</h2>
            <p className="text-gray-500 mb-8 font-medium">
              ¡Bienvenido de nuevo! Ingresa tus credenciales para continuar.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              
              {/* Email Input */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-2 text-sm">Correo electrónico</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-orange">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </span>
                  <input 
                    type="email" 
                    placeholder="tu@correo.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-yellow-100 transition shadow-sm text-gray-700 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-2 text-sm">Contraseña</label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-yellow-100 transition shadow-sm text-gray-700 font-bold tracking-widest"
                    required
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end mt-1">
                <a href="#" className="text-sm font-semibold text-[#5c7a33] hover:text-[#4a6328] transition">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 py-4 bg-[#ffb800] hover:bg-[#e0a200] text-white text-lg font-bold rounded-xl shadow-md transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            {/* Signup Link */}
            <p className="text-center mt-6 text-gray-500 font-medium">
              ¿No tienes una cuenta? <Link to="/register" className="text-[#5c7a33] font-bold hover:underline">Regístrate</Link>
            </p>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-400 text-sm font-medium">O continúa con</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="flex justify-center gap-4 mb-2">
              <button className="flex-1 flex items-center justify-center py-3 bg-[#3b5998] hover:bg-[#344e86] text-white rounded-xl shadow-sm transition hover:shadow-md">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className="flex-1 flex items-center justify-center py-3 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm transition hover:shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
              </button>
              <button className="flex-1 flex items-center justify-center py-3 bg-black hover:bg-gray-800 text-white rounded-xl shadow-sm transition hover:shadow-md">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"/></svg>
              </button>
            </div>
          </div>
        </div>

        </main>
      </div>
    </div>
  );
}
