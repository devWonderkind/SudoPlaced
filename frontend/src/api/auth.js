import api from './index';

// Standard Auth
export const loginUser = (data) => api.post('auth/jwt/create/', data);
export const registerUser = (data) => api.post('auth/users/', data);
export const fetchMe = () => api.get('auth/users/me/');
export const logoutUser = () => api.post('auth/logout/');

// Social Auth
export const googleLoginUser = (accessToken) =>
  api.post('auth/google/simple/', { access_token: accessToken });

// Account Activation
export const activateUser = (uid, token) => api.post('auth/users/activation/', { uid, token });

// Password Management
export const requestPasswordReset = (email) =>
  api.post('auth/users/reset_password/', { email });

export const confirmPasswordReset = (uid, token, new_password, re_new_password) =>
  api.post('auth/users/reset_password_confirm/', { uid, token, new_password, re_new_password });

export const changePassword = (current_password, new_password, re_new_password) =>
  api.post('auth/users/set_password/', { current_password, new_password, re_new_password });

// For Google-only accounts that have no password yet
export const setInitialPassword = (new_password, re_new_password) =>
  api.post('auth/set-initial-password/', { new_password, re_new_password });

// Profile
export const updateProfile = (data) => api.patch('auth/users/me/', data);
export const uploadProfilePic = (formData) =>
  api.patch('auth/users/me/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Connect Google to an existing authenticated account (enforces email match on backend)
export const connectGoogleAccount = (accessToken) =>
  api.post('auth/connect-google/', { access_token: accessToken });
