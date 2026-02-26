import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend says the token is invalid (401)
    if (error.response?.status === 401) {
      // Only redirect if the user is currently on a dashboard page
      if (window.location.pathname.startsWith('/dashboard')) {
         console.warn("Session expired. Redirecting...");
         window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;