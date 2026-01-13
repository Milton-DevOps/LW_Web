import { useState, useCallback } from 'react';
import {
  loginUser,
  registerUser,
  googleAuth,
  requestPasswordReset,
  verifyOTP,
  resetPassword,
  updateUserProfile,
  saveToken,
  saveUser,
  removeToken,
  getToken,
  getUser,
} from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());

  const handleLogin = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      const response = await loginUser(credentials);
      saveToken(response.token);
      saveUser(response.user);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (userData: any) => {
    setLoading(true);
    setError('');
    try {
      const response = await registerUser(userData);
      saveToken(response.token);
      saveUser(response.user);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGoogleAuth = useCallback(async (idToken: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await googleAuth(idToken);
      saveToken(response.token);
      saveUser(response.user);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google authentication failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRequestPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await requestPasswordReset(email);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request password reset';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVerifyOTP = useCallback(async (email: string, otp: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await verifyOTP(email, otp);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OTP verification failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResetPassword = useCallback(async (email: string, password: string, confirmPassword: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await resetPassword(email, password, confirmPassword);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateProfile = useCallback(async (profileData: any) => {
    setLoading(true);
    setError('');
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await updateUserProfile(token, profileData);
      saveUser(response.user);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleLogout = useCallback(() => {
    removeToken();
    setToken(null);
    setUser(null);
    setError('');
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    user,
    token,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleGoogleAuth,
    handleRequestPasswordReset,
    handleVerifyOTP,
    handleResetPassword,
    handleUpdateProfile,
    handleLogout,
    clearError,
    isAuthenticated: !!token,
  };
};
