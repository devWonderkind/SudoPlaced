import api from './index';

// Standard Auth
export const loginUser = (data) => api.post('auth/jwt/create/', data);
export const registerUser = (data) => api.post('auth/users/', data);
export const fetchMe = () => api.get('auth/users/me/');
export const logoutUser = () => api.post('auth/logout/');

// Social Auth
export const googleLoginUser = (accessToken) => 
  api.post('auth/google/simple/', { access_token: accessToken });

export const activateUser = (uid, token) => api.post('auth/users/activation/', { uid, token });