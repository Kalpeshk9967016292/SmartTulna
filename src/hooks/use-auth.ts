"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    onAuthStateChanged, 
    User as FirebaseUser,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile as fbUpdateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

// A more detailed user type, you can expand this based on your needs
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: { displayName: string }) => Promise<{ success: boolean; error?: any; }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const { uid, email, displayName, photoURL } = firebaseUser;
        setUser({ uid, email, displayName, photoURL });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthAction = async (action: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      await action();
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  const loginWithEmail = (email: string, pass: string) => 
    handleAuthAction(() => signInWithEmailAndPassword(auth, email, pass));

  const registerWithEmail = (email: string, pass: string) => 
    handleAuthAction(() => createUserWithEmailAndPassword(auth, email, pass));

  const loginWithGoogle = () =>
    handleAuthAction(() => signInWithPopup(auth, new GoogleAuthProvider()));

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
    router.push('/login');
  };

  const updateUserProfile = async (data: { displayName: string }) => {
    setLoading(true);
    setError(null);
    if (!auth.currentUser) {
        const err = "Not authenticated";
        setError(err);
        setLoading(false);
        return { success: false, error: err };
    }
    try {
        await fbUpdateProfile(auth.currentUser, { displayName: data.displayName });
        // Manually update the user state, as onAuthStateChanged might not fire for profile updates
        setUser(auth.currentUser);
        setLoading(false);
        return { success: true };
    } catch (err: any) {
        setError(err.message);
        setLoading(false);
        return { success: false, error: err.message };
    }
};

  const value = { user, loading, error, loginWithEmail, loginWithGoogle, registerWithEmail, logout, updateUserProfile };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
