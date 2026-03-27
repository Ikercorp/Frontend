import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Explore from './pages/Explore'
import RecipeDetail from './pages/RecipeDetail'
import RecipeEditor from './pages/RecipeEditor'
import MyRecipes from './pages/MyRecipes'
import Categories from './pages/Categories'
import RecipeMedia from './pages/RecipeMedia'
import './index.css'
import { ToastProvider } from './components/Toast'


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        
        {/* Protected Routes */}
        <Route path="/create" element={<ProtectedRoute><RecipeEditor /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><RecipeEditor /></ProtectedRoute>} />
        <Route path="/my-recipes" element={<ProtectedRoute><MyRecipes /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/edit/:id/media" element={<ProtectedRoute><RecipeMedia /></ProtectedRoute>} />
      </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
