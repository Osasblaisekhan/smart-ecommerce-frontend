import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useCart } from './CartContext';

interface User {
  _id: string;
  email: string;
  name?: string;
  role?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  navigate: (path: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => ({}),
  signIn: async () => ({}),
  signOut: async () => {},
  navigate: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();
  const [navigateFn, setNavigateFn] = useState<((path: string) => void) | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('smarthome_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const navigate = useCallback((path: string) => {
    if (navigateFn) {
      navigateFn(path);
    }
  }, [navigateFn]);

  // Expose navigate function via custom event
  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      window.location.href = e.detail;
    };
    window.addEventListener('auth-navigate' as any, handleNavigate);
    return () => window.removeEventListener('auth-navigate' as any, handleNavigate);
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const res = await api.register({ email, password, name: name || email.split('@')[0] });
      if (res.success && res.data) {
        const u = res.data;
        setUser(u);
        localStorage.setItem('smarthome_user', JSON.stringify(u));
        localStorage.setItem('smarthome_token', u.token || '');
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Sign up failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        const u = res.data;
        setUser(u);
        localStorage.setItem('smarthome_user', JSON.stringify(u));
        localStorage.setItem('smarthome_token', u.token || '');
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Sign in failed' };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('smarthome_user');
    localStorage.removeItem('smarthome_token');
    clearCart();
    window.dispatchEvent(new CustomEvent('auth-navigate', { detail: '/' }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, navigate }}>
      {children}
    </AuthContext.Provider>
  );
};
