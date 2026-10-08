import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'asa_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const clearError = () => setError('');

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed.');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Signup failed.');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setError('');
  };

  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, clearError, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
