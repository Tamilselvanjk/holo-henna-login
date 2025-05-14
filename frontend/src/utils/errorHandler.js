export const handleAuthError = (error) => {
  if (!error.response) {
    return 'Network error. Please check your connection.'
  }

  const { status, data } = error.response

  switch (status) {
    case 400:
      return data?.error || 'Invalid request. Please try again.'
    case 401:
      return 'Authentication failed. Please login again.'
    case 403:
      return 'Access denied. Please check your permissions.'
    default:
      return 'Something went wrong. Please try again later.'
  }
}
