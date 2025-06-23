"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user type
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (method: 'email' | 'google') => void;
  logout: () => void;
  register: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock auth functions
const mockUser: User = {
  uid: '12345',
  email: 'user@example.com',
  displayName: 'Test User',
  photoURL: 'https://placehold.co/100x100.png',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state on mount
    const session = sessionStorage.getItem('user');
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const login = (method: 'email' | 'google') => {
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  };

  const register = () => {
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  };
  
  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      sessionStorage.removeItem('user');
      setUser(null);
      setLoading(false);
    }, 500);
  };

  const value = { user, loading, login, logout, register };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
