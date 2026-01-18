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

export default function Register() {
  const router = useRouter();
  const { handleRegister, handleGoogleAuth, loading, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (getToken()) {
      // Uncomment to redirect already logged in users
      // router.push('/');
    }
  }, [router]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    // Validation
    if (!firstName || !lastName || !email || !password) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setFormError('Please enter a valid email');
      return;
    }

    // Validate phone numbers
    if (whatsappNumber && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(whatsappNumber)) {
      setFormError('Please enter a valid WhatsApp number');
      return;
    }

    if (phoneNumber && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phoneNumber)) {
      setFormError('Please enter a valid phone number');
      return;
    }

    try {
      const userData: any = {
        firstName,
        lastName,
        email,
        password,
        whatsappNumber,
        phoneNumber: phoneNumber || '',
      };

      if (profilePicture && profilePreview) {
        userData.profilePictureUrl = profilePreview;
      }

      await handleRegister(userData);
      // Email/password registration goes directly to home
      router.push('/');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const googleRegister = useGoogleLogin({
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
          throw new Error(data.message || 'Google registration failed');
        }

        saveToken(data.token);
        saveUser(data.user);
        
        // Redirect based on profile completion
        if (data.needsProfileCompletion) {
          router.push('/auth/edit-profile');
        } else {
          router.push('/');
        }
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Google sign-up failed');
      }
    },
    onError: () => {
      setFormError('Google sign-up failed');
    },
    flow: 'implicit',
  });

  return (
    <div className={styles.authContainer}>
      <div className={`${styles.authCard} ${styles.authCardWithImage}`}>
        {/* Left Section - Image */}
        <div className={styles.authImageSection}>
          {profilePreview ? (
            <img src={profilePreview} alt="Profile" />
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-sm">Profile Image Preview</p>
            </div>
          )}
        </div>

        {/* Right Section - Form */}
        <div className={styles.authFormSection}>
          <h2 className={styles.authTitle}>
            REGISTRATION FORM
          </h2>

          {(formError || error) && (
            <div className={styles.errorMessage} role="alert">
              {formError || error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                required
              />

              <Input
                label="Last Name"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                required
              />
            </div>

            <Input
              label="Email Addresses"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              fullWidth
              required
            />

            <Input
              label="WhatsApp Number (Optional)"
              type="tel"
              placeholder="WhatsApp Number"
              value={whatsappNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsappNumber(e.target.value)}
              fullWidth
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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              fullWidth
              required
            />

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Profile Picture (Optional)
              </label>
              <Input
                type="file"
                title="Profile picture upload"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="w-full px-2 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#cb4154] transition-colors cursor-pointer"
              />
              {profilePicture && (
                <p className="text-xs text-gray-600 mt-1">{profilePicture.name}</p>
              )}
            </div>

            <Button type="submit" fullWidth variant="primary" className="mt-6 text-sm" disabled={loading}>
              {loading ? 'REGISTERING...' : 'REGISTER'}
            </Button>
          </form>

          <div className={styles.dividerLargeMargin}>Or register with</div>

          <div className={styles.socialButtons}>
            <button
              type="button"
              onClick={() => googleRegister()}
              className={styles.socialButton}
              disabled={loading}
              title="Register with Google"
            >
              <svg className={styles.googleIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? 'SIGNING UP...' : 'Google'}
            </button>
          </div>

          <p className={`${styles.footer} ${styles.footerWithMargin}`}>
            Already have an account?{' '}
            <Link href="/auth/login" className={styles.primaryLink}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}