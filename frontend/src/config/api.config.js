export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  GOOGLE_AUTH: '/auth/google',
  GOOGLE_CALLBACK: '/auth/google/callback',
  PROFILE: '/auth/me',
};

export const AUTH_PATHS = {
  CALLBACK: '/profile',
  LOGIN: '/login',
  PROFILE: '/profile'
};
