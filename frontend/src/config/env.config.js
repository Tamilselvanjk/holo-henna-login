export const getEnvConfig = () => {
  const config = {
    googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID?.trim(),
    googleRedirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI?.trim(),
    apiUrl: process.env.REACT_APP_API_URL?.trim(),
    googleScope:
      process.env.REACT_APP_GOOGLE_SCOPE?.trim() || 'email profile openid',
  }

  // Validate each required variable
  const required = ['googleClientId', 'googleRedirectUri', 'apiUrl']
  const missing = required.filter((key) => !config[key])

  if (missing.length > 0) {
    console.error('Missing environment variables:', missing)
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }

  return config
}

// Helper to validate environment setup
export const validateEnvSetup = () => {
  try {
    const config = getEnvConfig()
    return { isValid: true, config }
  } catch (error) {
    return { isValid: false, error: error.message }
  }
}
