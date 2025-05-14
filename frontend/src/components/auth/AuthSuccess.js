// src/components/auth/AuthSuccess.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUserProfile } = useAuth();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          throw new Error('No authentication token received');
        }

        // Save token
        localStorage.setItem('token', token);
        
        // Fetch user profile
        await fetchUserProfile();
        
        toast.success('Successfully logged in!');
        navigate('/profile');
      } catch (error) {
        console.error('Auth success error:', error);
        toast.error('Authentication failed');
        navigate('/login');
      }
    };

    handleAuthSuccess();
  }, [navigate, location, fetchUserProfile]);

  return (
    <div className="auth-loading">
      <div className="spinner"></div>
      <p>Completing authentication...</p>
    </div>
  );
};

export default AuthSuccess;
