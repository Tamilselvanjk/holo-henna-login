export const GOOGLE_CONFIG = {
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET, // Add client secret
  redirect_uri: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
  ].join(' '),
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent', 
  include_granted_scopes: true
 // Changed to ensure refresh token is always received
 
};

export const GOOGLE_ENDPOINTS = {
  auth: 'https://accounts.google.com/o/oauth2/v2/auth',
  token: 'https://oauth2.googleapis.com/token',
  userinfo: 'https://www.googleapis.com/oauth2/v2/userinfo'  // Added userinfo endpoint
};

// Utility function to generate OAuth URL
export const getGoogleOAuthURL = (state) => {
  const queryParams = new URLSearchParams({
    client_id: GOOGLE_CONFIG.client_id,
    redirect_uri: GOOGLE_CONFIG.redirect_uri,
    response_type: GOOGLE_CONFIG.response_type,
    scope: GOOGLE_CONFIG.scope,
    access_type: GOOGLE_CONFIG.access_type,
    prompt: GOOGLE_CONFIG.prompt,
    state: state || Math.random().toString(36).substring(7)
  });

  return `${GOOGLE_ENDPOINTS.auth}?${queryParams.toString()}`;
};