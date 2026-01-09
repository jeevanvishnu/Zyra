import React from 'react'
// import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import {Toaster} from "react-hot-toast"
import { Routes , Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage'

const App = () => {
  return (
    <div >
      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App