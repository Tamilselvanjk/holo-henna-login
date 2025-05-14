import { toast } from 'react-toastify'

const isDevelopment = process.env.REACT_APP_NODE_ENV === 'development'

export const GOOGLE_CONFIG = {
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
  scope: 'openid email profile',
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
}

export const generateAuthUrl = () => {
  const params = {
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
    response_type: 'code',
    access_type: 'offline',
    scope: process.env.REACT_APP_GOOGLE_SCOPE || 'email profile openid',
    prompt: 'consent'
  };

  // Validate required parameters
  if (!params.client_id || !params.redirect_uri) {
    throw new Error('Missing required OAuth parameters');
  }

  return `http://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(params)}`;
};

export const initGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    try {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('Google Client ID not found');
      }

      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: response => console.log('Google response:', response)
      });

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};