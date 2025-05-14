import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config'
import { toast } from 'react-toastify'

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,
  loginWithGoogle: async () => {},
  handleGoogleCallback: async () => {},
  fetchUserProfile: async () => {},
  logout: () => {},
  clearAuthError: () => {},
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  const clearAuthError = () => setAuthError(null)

  // Handle Google OAuth callback
  const handleGoogleCallback = async (authData) => {
    try {
      setIsLoading(true);
      clearAuthError();

      if (!authData.token || !authData.user) {
        throw new Error('Invalid authentication data');
      }

      // Set auth headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
      
      // Update auth state
      setUser(authData.user);
      setIsAuthenticated(true);

      return { success: true, user: authData.user };
    } catch (error) {
      console.error('Google callback error:', error);
      setAuthError('Authentication failed');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return { success: false, error: 'Authentication failed' };
    } finally {
      setIsLoading(false);
    }
  }

  // Add token interceptor
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          setUser(null)
          setIsAuthenticated(false)
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
          toast.error('Session expired. Please login again.')
        }
        return Promise.reject(error)
      }
    )

    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  // Add function to get user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_BASE_URL}/auth/me`);

      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
    toast.info('Logged out successfully')
  }

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.PROFILE}`
        )
        setUser(response.data)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        authError,
        clearAuthError,
        handleGoogleCallback,
        fetchUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
