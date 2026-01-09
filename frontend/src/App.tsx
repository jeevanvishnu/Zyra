import React from 'react'
// import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import {Toaster} from "react-hot-toast"

const App = () => {
  return (
    <div >
      <LoginPage />
      {/* <SignupPage /> */}

      <Toaster/>
    </div>
  )
}

export default App