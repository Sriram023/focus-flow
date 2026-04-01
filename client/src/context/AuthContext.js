import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log("USER STATE:", user);
  useEffect(() => {
  console.log("Auth init");

  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  console.log("TOKEN:", token);
  console.log("USER:", savedUser);

  if (token && savedUser) {
    setUser(JSON.parse(savedUser));
  }

  setLoading(false);
}, []);

  const loadUserProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to load user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

const login = async (email, password) => {
  console.log("LOGIN FUNCTION TRIGGERED"); // 👈 HERE (first line)

  // 🔥 TEMP HARD-CODE LOGIN
  if (email === "sandhyamurali0326@gmail.com" && password === "Sandhyasriram023") {
    console.log("HARDCODE LOGIN SUCCESS"); // 👈 HERE (inside IF)

    const fakeUser = {
      name: "Sriram",
      email: "Sandhyamurali0326@gmail.com",
      token: "fake-token-123",
    };

    localStorage.setItem("token", fakeUser.token);
    localStorage.setItem("user", JSON.stringify(fakeUser));
    setUser(fakeUser);

    return fakeUser;
  }

  // fallback to real API
  try {
    console.log("API LOGIN CALLED"); // 👈 optional debug

    const { data } = await api.post('/auth/login', { email, password });

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);

    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    setError(message);
    throw new Error(message);
  }
};
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const { data } = await api.put('/auth/profile', updates);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Update failed');
    }
  };

  const refreshUser = async () => {
    await loadUserProfile();
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
