import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaWifi,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { generateAuthUrl, initGoogleAuth } from '../../config/google.config'
import { getEnvConfig } from '../../config/env.config'
import './Login.css'

const validateEnvSetup = () => {
  try {
    const config = getEnvConfig()
    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: error.message }
  }
}

const Login = () => {
  const {  clearAuthError } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const from = location.state?.from || '/profile'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  const loginWithGoogle = () => {
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      redirect_uri: 'http://localhost:5000/auth/google/callback',
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }
  // Update environment check effect
  useEffect(() => {
    try {
      const config = getEnvConfig()
      console.log('Auth configuration loaded:', {
        clientId: config.googleClientId,
        redirectUri: config.googleRedirectUri,
      })
    } catch (error) {
      console.error('Configuration Error:', error)
      setError('Authentication system is temporarily unavailable')
      toast.error(
        'Unable to initialize authentication. Please try again later.'
      )
    }
  }, [])

  // Initialize Google Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const config = getEnvConfig()
        await initGoogleAuth()
        console.log('Google Auth initialized successfully')
      } catch (error) {
        console.error('Auth initialization error:', error)
        setError('Unable to initialize Google authentication')
      }
    }

    initAuth()
  }, [])

  // Handle network status changes
  useEffect(() => {
    const handleOnline = () => {
      console.log('All Environment Variables:', {
        GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        REDIRECT_URI: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
        NODE_ENV: process.env.NODE_ENV,
        // Only public vars starting with REACT_APP_ are available
        ALL_ENV: Object.keys(process.env).filter((key) =>
          key.startsWith('REACT_APP_')
        ),
      })

      setIsOnline(true)
      setError('')
      toast.success('Network connection restored')
    }

    const handleOffline = () => {
      setIsOnline(false)
      setError(
        'Network connection lost. Please check your internet connection.'
      )
      toast.error('Network connection lost')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Handle auth errors from location state
  useEffect(() => {
    const error = location.state?.error
    if (error) {
      toast.error(error)
    }
    return () => clearAuthError()
  }, [location.state, clearAuthError])

  const handleGoogleLogin = async (e) => {
    e.preventDefault()

    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection')
      }

      setIsLoading(true)
      setError('')

      const authUrl = generateAuthUrl()
      if (!authUrl) throw new Error('Failed to generate authentication URL')

      // Store intended destination
      sessionStorage.setItem('auth_redirect', '/profile')

      // Redirect to Google OAuth
      window.location.href = authUrl
    } catch (error) {
      console.error('Google login error:', error)
      setError('Unable to connect to Google. Please try again.')
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!isOnline) {
      toast.error('No internet connection')
      return
    }

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      // Email/password login logic would go here
      toast.error('Email/password login not implemented')
    } catch (error) {
      setError(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="welcome-section">
        <h1>Welcome to Holo Henna</h1>
        <p>Experience the beauty of traditional henna artistry</p>
      </div>
      <div className="auth-section">
        <div className="auth-container">
          <h2>Sign In</h2>

          {!isOnline && (
            <div className="network-error">
              <FaExclamationTriangle className="network-error-icon" />
              <span>No internet connection</span>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className={`form-input ${error ? 'error' : ''}`}
                disabled={!isOnline || isLoading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={!isOnline || isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={!isOnline || isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={!isOnline || isLoading}
                />
                <span>Remember me</span>
              </label>
              <a
                href="#forgot"
                className="forgot-link"
                onClick={(e) => {
                  e.preventDefault()
                  if (!isOnline) {
                    toast.error('No internet connection')
                  }
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={
                !isOnline || isLoading || !formData.email || !formData.password
              }
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="social-buttons">
            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleLogin}
              disabled={!isOnline || isLoading}
            >
              <FaGoogle className="google-icon" />
              <span>
                {isLoading ? 'Connecting...' : 'Continue with Google'}
              </span>
            </button>
          </div>
          <div className="signup-text">
            Don't have an account? <a href="#signup">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
