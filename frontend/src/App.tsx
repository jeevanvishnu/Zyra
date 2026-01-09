import React from 'react'
// import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import {Toaster} from "react-hot-toast"
import { Routes , Route } from 'react-router-dom'

const App = () => {
  return (
    <div >
      <Routes>
        <Route element={'/login'}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App