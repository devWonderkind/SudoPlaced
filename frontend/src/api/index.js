import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 and if we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh') : null;

        if (refreshToken) {
          // Attempt to refresh the token using a clean axios instance to avoid loops
          // We use the same base URL and credentials
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}auth/jwt/refresh/`,
            { refresh: refreshToken },
            { withCredentials: true }
          );

          // If refresh succeeds, the HttpOnly cookie 'access_token' is updated.
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed (token expired or invalid)
        if (typeof window !== 'undefined') {
             localStorage.removeItem('refresh');
             // Only redirect if on protected routes
             if (window.location.pathname.startsWith('/dashboard')) {
                window.location.href = '/login';
             }
        }
        return Promise.reject(refreshError);
      }
    }

    // Fallback for 401 if refresh logic didn't run or failed (though catch block handles failure)
    if (error.response?.status === 401) {
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
             console.warn("Session expired. Redirecting...");
             window.location.href = '/login'; 
        }
    }

    return Promise.reject(error);
  }
);

export default api;