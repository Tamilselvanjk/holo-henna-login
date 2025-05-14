import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const { user, fetchUserProfile, isLoading, handleGoogleCallback } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const authCode = sessionStorage.getItem('google_auth_code');
        
        if (authCode) {
          await handleGoogleCallback({ code: authCode });
          sessionStorage.removeItem('google_auth_code');
        }

        if (!user) {
          await fetchUserProfile();
        }
      } catch (error) {
        console.error('Profile error:', error);
        toast.error('Failed to load profile');
        navigate('/login');
      }
    };

    loadProfile();
  }, [location, fetchUserProfile, user, navigate]);

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="profile-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
              }}
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <h2>{user.name}</h2>
          {user.provider === 'google' && (
            <div className="google-connected">
              <FaGoogle /> Google Account Connected
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <p className="email">{user.email}</p>
          <p className="joined">
            Member since: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;