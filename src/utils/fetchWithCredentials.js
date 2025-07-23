// Helper function to make fetch requests with credentials included
export const fetchWithCredentials = async (url, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Remove Authorization header if it exists (we're using cookies now)
  if (defaultOptions.headers.Authorization) {
    delete defaultOptions.headers.Authorization;
  }

  return fetch(url, { ...defaultOptions, ...options });
};