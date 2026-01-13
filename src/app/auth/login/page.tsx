'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { colors } from '../../../constants/colors';
import { useAuth } from '../../../hooks/useAuth';
import { getToken } from '../../../services/authService';
import styles from '../auth.module.css';

declare global {
  interface Window {
    google?: any;
  }
}

export default function Login() {
  const router = useRouter();
  const { handleLogin, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [formError, setFormError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (getToken()) {
      // Uncomment to redirect already logged in users
      // router.push('/');
    }
  }, [router]);

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        callback: handleGoogleSignIn,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, []);

  const handleGoogleSignIn = async (response: any) => {
    setGoogleLoading(true);
    try {
      const { handleGoogleAuth } = await import('../../../hooks/useAuth');
      // This will be called from the hook through router navigation
      const result = await (window as any).authHook?.handleGoogleAuth(response.credential);
      if (result?.needsProfileCompletion) {
        router.push('/auth/edit-profile');
      } else {
        router.push('/');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

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
      await handleLogin({ email, password });
      if (remember) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      router.push('/');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className={styles.authContainer} style={{ background: colors.light.surface }}>
      <div className={styles.authCard} style={{ borderColor: colors.light.border }}>
        <div className={styles.authCardLeft}>
          <div>
            <h2 className={styles.authTitle} style={{ color: colors.light.text }}>
              LOGIN
            </h2>
          </div>

          {(formError || error) && (
            <div className={styles.errorMessage} role="alert">
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
            <div id="google-signin-button" className="w-full"></div>
          </div>

          <p className={styles.footer}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" style={{ color: colors.light.primary }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}