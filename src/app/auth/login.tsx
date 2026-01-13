'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { getToken } from '../../services/authService';
import styles from './auth.module.css';

export default function Login() {
  const router = useRouter();
  const { handleLogin, handleGoogleAuth, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (getToken()) {
      router.push('/');
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

    try {
      await handleLogin({ email, password });
      router.push('/');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setFormError('');
        clearError();
        
        // Access token from Google response
        const { access_token } = codeResponse;
        
        // Call backend with the access token
        // The backend will exchange it for user info
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken: access_token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Google authentication failed');
        }

        // Save user data using auth hook
        await handleGoogleAuth(data.token);
        
        // Redirect based on profile completion
        if (data.needsProfileCompletion) {
          router.push('/auth/edit-profile');
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
    // eslint-disable-next-line @next/next/no-css-tags
    <div className={styles.authContainer} style={{ background: colors.light.surface }}>
      <div className={styles.authCard} style={{ borderColor: colors.light.border }}>
        <h2 className={styles.authTitle} style={{ color: colors.light.text }}>
          LOGIN
        </h2>

        {(formError || error) && (
          <div className={styles.errorMessage}>
            {formError || error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            fullWidth
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            fullWidth
          />

          <div className="flex items-center justify-between mt-1 text-xs sm:text-sm">
            <label className="inline-flex items-center text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2 w-4 h-4"
              />
              Remember me
            </label>
            <Link href="/auth/forgot-password" className="text-gray-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth className="mt-3" disabled={loading}>
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </Button>
        </form>

        <div className={styles.divider}>Or login with</div>

        <div className={styles.socialButtons}>
          <button
            type="button"
            onClick={() => googleLogin()}
            className={styles.socialButton}
            style={{ borderColor: colors.light.border, border: `1px solid ${colors.light.border}` }}
            disabled={loading}
          >
            {loading ? 'SIGNING IN...' : 'Google'}
          </button>
        </div>

        <p className={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" style={{ color: colors.light.primary }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
