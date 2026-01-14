import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './users/pages/Home';
import LoginPage from './users/pages/LoginPage';
import SignupPage from './users/pages/SignupPage';
import AdminLoginPage from './admin/pages/LoginPage';
import AdminLayout from './admin/components/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Products from './admin/pages/Products';
import Orders from './admin/pages/Orders';
import Banners from './admin/pages/Banners';
import { userAuthStore } from '@/store/UseUserStore';

const App = () => {
  // Example state for cart and wishlist counts
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(5);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement your search logic here
  };

  const { user, checkAuth } = userAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-background">
      {/* Conditionally render Navbar only for non-admin routes if desired, 
          but current structure suggests global navbar. 
          However, Admin Layout has its own shell. 
          We should probably only show the main Navbar for user routes. 
          But for now, I will keep it simple and just use Routes to control what shows.
          Since Navbar is outside Routes, it shows everywhere. 
          We might want to hide it for admin pages. 
      */}

      <Routes>
        {/* User Routes - Wrapped in a fragment or handled individually to include Navbar? 
            The Navbar is currently outside Routes. Ideally, we should check the path. 
            Or move Navbar inside a layout route for users. 
            Let's keep Navbar consistent for now, but user requirement didn't specify removing it for admin.
            However, usually admin dashboards don't have the user navbar.
        */}
      </Routes>

      {/* Since Navbar is outside, let's conditionally render it if not on admin path? 
          Or better, restructure to use Outlet for user layout.
          Let's try to detect if it's an admin route.
      */}
      {!window.location.pathname.startsWith('/admin') && (
        <Navbar
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          onSearch={handleSearch}
        />
      )}

      <Routes>
        {/* User Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={!user ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path='/signup' element={!user ? <SignupPage /> : <Navigate to={'/'} />} />
        <Route path='/cart' element={
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold">Shopping Cart ({cartCount} items)</h1>
          </div>
        } />
        <Route path='/wishlist' element={
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold">Wishlist ({wishlistCount} items)</h1>
          </div>
        } />

        {/* Admin Routes */}
        <Route path='/admin/login' element={<AdminLoginPage />} />
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='products' element={<Products />} />
          <Route path='orders' element={<Orders />} />
          <Route path='banners' element={<Banners />} />
        </Route>
      </Routes>

      <Toaster />
    </div>
  )
}

export default App;