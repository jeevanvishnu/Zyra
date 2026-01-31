import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductsPage from './users/pages/Products';
import Home from './users/pages/Home';
import LoginPage from './users/pages/LoginPage';
import SignupPage from './users/pages/SignupPage';
import AdminLoginPage from './admin/pages/LoginPage';
import AdminLayout from './admin/components/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Products from './admin/pages/Products';
import Orders from './admin/pages/Orders';
import Banners from './admin/pages/Banners';
import ProductDetails from './users/pages/ProductDetails';
import CartPage from './users/pages/Cart';
import { userAuthStore } from '@/store/UseUserStore';

const App = () => {
  // Example state for cart and wishlist counts
  const { user, checkAuth, cart } = userAuthStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [wishlistCount] = useState(5);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement your search logic here
  };
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isAdminRoute && (
        <Navbar
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          onSearch={handleSearch}
        />
      )}

      <div className="flex-grow">
        <Routes>
          {/* User Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/login' element={!user ? <LoginPage /> : <Navigate to={'/'} />} />
          <Route path='/signup' element={!user ? <SignupPage /> : <Navigate to={'/'} />} />
          <Route path='/cart' element={<CartPage />} />
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
      </div>

      {!isAdminRoute && <Footer />}

      <Toaster />
    </div>
  )
}

export default App;