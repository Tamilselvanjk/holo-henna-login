import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './contexts/AuthContext'

// Component imports
import Login from './components/Login/Login'
import Header from './components/Home/Header/Header'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Shop from './pages/Shop'
import UserProfile from './components/UserProfile/UserProfile'
import PrivateRoute from './components/auth/PrivateRoute'
import GoogleCallback from './components/auth/GoogleCallback'

// Styles
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/shop" element={<Shop />} />

              {/* Auth Routes */}
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                } 
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
};

export default App;