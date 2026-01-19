'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { colors } from '../../../constants/colors';
import { useAuth } from '../../../hooks/useAuth';
import { getToken, saveToken, saveUser } from '../../../services/authService';
import styles from '../auth.module.css';

export default function Login() {
  const router = useRouter();
  const { loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (getToken()) {
      // User already logged in, uncomment to auto-redirect
      // router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setFormError('Please enter a valid email');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      saveToken(data.token);
      saveUser(data.user);
      
      // Role-based navigation with page refresh
      if (data.user?.role === 'admin') {
        window.location.href = '/dashboard';
      } else if (data.user?.role === 'head_of_department') {
        window.location.href = '/auth/select-department';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setFormError('');
        clearError();
        
        const { access_token } = codeResponse;
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken: access_token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Google login failed');
        }

        saveToken(data.token);
        saveUser(data.user);
        
        // Role-based navigation with page refresh
        if (data.user?.role === 'admin') {
          window.location.href = '/dashboard';
        } else if (data.user?.role === 'head_of_department') {
          window.location.href = '/auth/select-department';
        } else {
          window.location.href = '/';
        }
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Google login failed');
      }
    },
    onError: () => {
      setFormError('Google login failed');
    },
    flow: 'implicit',
  });

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authFormSection}>
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center text-[#cb4154] hover:text-[#a83444] transition-colors"
          >
            <span className="mr-2">←</span> Back
          </button>
          <h2 className={styles.authTitle}>
            LOGIN
          </h2>

          {(formError || error) && (
            <div className={styles.errorMessage} role="alert">
              {formError || error}
            </div>
          )}


          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              fullWidth
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Link href="/auth/forgot-password" className={styles.primaryLink}>
              <p className="text-xs hover:underline">Forgot password?</p>
            </Link>

            <Link href="/auth/password-reset" className={styles.primaryLink}>
              <p className="text-xs hover:underline">Reset password (Admin-created account)?</p>
            </Link>

            <Button type="submit" fullWidth variant="primary" className="mt-6 text-sm" disabled={loading}>
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </Button>
          </form>

          <div className={styles.dividerLargeMargin}>Or login with</div>

          <div className={styles.socialButtons}>
            <button
              type="button"
              onClick={() => googleLogin()}
              className={styles.socialButton}
              disabled={loading}
              title="Login with Google"
            >
              <svg className={styles.googleIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? 'SIGNING IN...' : 'Google'}
            </button>
          </div>

          <p className={`${styles.footer} ${styles.footerWithMargin}`}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className={styles.primaryLink}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
