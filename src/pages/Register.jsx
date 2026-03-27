import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import chefImg from '../assets/abuelita.png';
import { api } from '../api/axios';
import tomateImg from '../assets/tomate.png';
import customLogo from '../assets/logo.png';
import { useToast } from '../components/Toast';



export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        password, 
        password_confirmation: passwordConfirmation 
      });
      localStorage.setItem('access_token', response.data.access_token);
      toast.success('¡Registro exitoso! Bienvenido.');
      navigate('/my-recipes');

    } catch (err) {
      console.error("DEBUG ERR:", err.response?.data);
      const errorMsg = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message || 'Error en el registro';
      toast.error(errorMsg);

      setError(err.response?.data?.message || 'Error en el registro. Verifica los datos.');
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
        
        {/* BLOB 1: Blanco/crema grande a la derecha */}
        <div 
          className="absolute top-[-10%] right-[-5%] w-[120%] md:w-[65%] h-[120%] bg-white z-0 shadow-sm" 
          style={{ borderBottomLeftRadius: '900px 700px', borderTopLeftRadius: '200px' }}
          aria-hidden="true"
        ></div>
        
        {/* BLOB 2: Único naranja grande en la izquierda superior */}
        <div 
          className="absolute top-0 left-0 w-[80%] md:w-[45%] h-[60%] md:h-[70%] bg-[#ffb800]/80 z-0"
          style={{ borderBottomRightRadius: '100% 70%' }}
          aria-hidden="true"
        ></div>

        {/* BLOB 3: Único naranja pequeño en la esquina inferior izquierda */}
        <div 
          className="absolute bottom-[-5%] left-[-5%] w-[40%] md:w-[35%] h-[15%] md:h-[20%] bg-[#ffb800]/80 z-0"
          style={{ borderTopRightRadius: '100% 120%' }}
          aria-hidden="true"
        ></div>

        {/* Inner Content Reversed for Register */}
        <main className="relative z-10 flex flex-col md:flex-row-reverse items-center justify-center max-w-7xl mx-auto w-full px-6 py-6 gap-12">
        
        {/* Right Side: Chef Image */}
        <div className="hidden md:flex w-1/2 justify-center items-center relative">
          <img 
            src={chefImg} 
            alt="Chef con ingredientes" 
            className="w-full max-w-lg object-contain drop-shadow-2xl z-10 scale-95"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>

        {/* Left Side: Register Card */}
        <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
          <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-8 md:p-12 max-w-md w-full flex flex-col relative overflow-hidden border border-gray-50">
            
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Crear cuenta</h2>
            <p className="text-gray-500 mb-6 font-medium">
              ¡Únete a nuestra comunidad de amantes de la cocina!
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              
              {/* Name Input */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1 text-sm">Nombre completo</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Tu nombre" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-yellow-100 transition shadow-sm text-gray-700 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1 text-sm">Correo electrónico</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="tu@correo.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-yellow-100 transition shadow-sm text-gray-700 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1 text-sm">Contraseña</label>
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

              {/* Confirm Password Input */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1 text-sm">Confirmar Contraseña</label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-yellow-100 transition shadow-sm text-gray-700 font-bold tracking-widest"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 py-4 bg-[#ffb800] hover:bg-[#e0a200] text-white text-lg font-bold rounded-xl shadow-md transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? 'Registrando...' : 'Regístrate'}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center mt-6 text-gray-500 font-medium">
              ¿Ya tienes una cuenta? <Link to="/login" className="text-[#5c7a33] font-bold hover:underline">Iniciar sesión</Link>
            </p>

          </div>
        </div>

        </main>
      </div>
    </div>
  );
}
