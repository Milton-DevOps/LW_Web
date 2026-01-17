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
      // (No profile completion needed as all info was provided during registration)
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
        
        // Access token from Google response
        const { access_token } = codeResponse;
        
        // Call backend with the access token
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

        // Save user data directly (don't call handleGoogleAuth as it would make another API call)
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

          <form className="space-y-3" onSubmit={handleSubmit}>
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
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Profile Picture (Optional)
              </label>
              <input
                type="file"
                title="Profile picture upload"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#cb4154] transition-colors cursor-pointer"
              />
              {profilePicture && (
                <p className="text-xs text-gray-600 mt-1">{profilePicture.name}</p>
              )}
            </div>

            <Button type="submit" fullWidth variant="primary" className="mt-4 text-sm" disabled={loading}>
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
            >
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