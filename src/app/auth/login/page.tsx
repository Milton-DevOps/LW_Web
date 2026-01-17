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
      
      // Debug logging
      console.log('Login response:', data);
      console.log('User role:', data.user?.role);
      
      // Role-based navigation
      if (data.user?.role === 'admin') {
        console.log('Redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log('Redirecting to home');
        router.push('/');
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
        
        // Role-based navigation
        if (data.user?.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/');
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
          <h2 className={styles.authTitle}>
            LOGIN
          </h2>

          {(formError || error) && (
            <div className={styles.errorMessage} role="alert">
              {formError || error}
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit}>
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

            <Button type="submit" fullWidth variant="primary" className="mt-4 text-sm" disabled={loading}>
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
            >
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