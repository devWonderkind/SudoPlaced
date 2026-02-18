'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// Centralized API imports
import {
  fetchMe,
  loginUser,
  registerUser,
  logoutUser,
  googleLoginUser,
  changePassword as changePasswordApi,
  setInitialPassword as setInitialPasswordApi,
  updateProfile,
  uploadProfilePic,
  connectGoogleAccount,
} from '@/api/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await fetchMe();
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (values) => {
    const res = await loginUser(values);
    const { data } = await fetchMe();
    setUser(data);
    router.push('/dashboard');
    return res;
  };

  const signup = async (values) => {
    const res = await registerUser(values);
    toast.success('Registration successful! Please check your email.');
    return res;
  };

  const googleLogin = async (accessToken) => {
    try {
      const res = await googleLoginUser(accessToken);
      // Depending on your backend response, you might need to call fetchMe() 
      // here too if the social login only returns tokens and not user data.
      setUser(res.data.user || res.data); 
      toast.success('Welcome! Signed in with Google.');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Google authentication failed.');
    }
  };

  // Connect Google to an existing account (from profile page)
  // Uses the dedicated endpoint that enforces email matching on the backend
  const connectGoogle = async (accessToken) => {
    try {
      const res = await connectGoogleAccount(accessToken);
      // Patch google_profile_pic into local user state immediately
      setUser((prev) => ({
        ...prev,
        google_profile_pic: res.data.google_profile_pic,
      }));
      toast.success('Google account connected!');
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        'Failed to connect Google account. Make sure you select the Google account that matches your email here.';
      toast.error(msg);
    }
  };

  const changePassword = async (current_password, new_password, re_new_password) => {
    await changePasswordApi(current_password, new_password, re_new_password);
  };

  const setInitialPassword = async (new_password, re_new_password) => {
    await setInitialPasswordApi(new_password, re_new_password);
    // After setting a password, refresh user so has_usable_password updates
    const { data } = await fetchMe();
    setUser(data);
  };

  const updateUser = async (formData, isMultipart = false) => {
    const res = isMultipart
      ? await uploadProfilePic(formData)
      : await updateProfile(formData);
    setUser(res.data);
    return res;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, signup, googleLogin, connectGoogle, changePassword, setInitialPassword, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);