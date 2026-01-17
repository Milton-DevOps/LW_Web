'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: { url: string };
  whatsappNumber: string;
  phoneNumber?: string;
  authProvider: string;
  role?: 'admin' | 'head_of_department' | 'member' | 'user';
  department?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string;
  isAuthenticated: boolean;
  handleLogin: (credentials: { email: string; password: string }) => Promise<any>;
  handleRegister: (userData: any) => Promise<any>;
  handleGoogleAuth: (idToken: string) => Promise<any>;
  handleRequestPasswordReset: (email: string) => Promise<any>;
  handleVerifyOTP: (email: string, otp: string) => Promise<any>;
  handleResetPassword: (email: string, password: string, confirmPassword: string) => Promise<any>;
  handleLogout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
