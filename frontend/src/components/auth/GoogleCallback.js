import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AUTH_PATHS } from '../../config/api.config';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      // Store code temporarily
      sessionStorage.setItem('google_auth_code', code);
      navigate(AUTH_PATHS.PROFILE, { replace: true });
    } else {
      toast.error('Authentication failed');
      navigate(AUTH_PATHS.LOGIN, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="auth-loading">
      <div className="spinner"></div>
      <p>Completing authentication...</p>
    </div>
  );
};

export default GoogleCallback;