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
      // Avoid redirect loops on the login page itself
      if (!window.location.pathname.includes('/login')) {
         // You could also trigger a logout function here from a global state
         console.warn("Session expired. Redirecting...");
         window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;