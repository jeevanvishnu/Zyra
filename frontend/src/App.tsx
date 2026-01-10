import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import { Toaster } from "react-hot-toast"
import { Routes, Route , Navigate} from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import Navbar from './components/Navbar'
import { userAuthStore } from '@/store/UseUserStore';

const App = () => {
  // Example state for cart and wishlist counts
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(5);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement your search logic here
  };

  const {user} = userAuthStore()

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={handleSearch}
      />

      <Routes>
        <Route path='/' element={
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Welcome to Zyra
            </h1>
            <p className="text-center text-muted-foreground mt-4">
              Your one-stop shop for everything you need!
            </p>
          </div>
        } />
        <Route path='/login' element={!user ?<LoginPage /> : <Navigate to={'/'}/> }/>
        <Route path='/signup' element={! user ? <SignupPage /> : <Navigate to={'/'}/>} />
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