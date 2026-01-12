import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { userAuthStore } from '@/store/UseUserStore';

const App = () => {
  // Example state for cart and wishlist counts
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(5);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement your search logic here
  };

  const { user , checkAuth} = userAuthStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={handleSearch}
      />

      <Routes>
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
      </Routes>

      <Toaster />
    </div>
  )
}

export default App