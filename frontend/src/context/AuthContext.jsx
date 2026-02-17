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
  googleLoginUser 
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
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);