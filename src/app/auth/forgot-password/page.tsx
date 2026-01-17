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
import utils from '../utilities.module.css';

export default function Register() {
  const router = useRouter();
  const { handleRegister, loading, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (getToken()) {
      // Uncomment to redirect already logged in users
      // router.push('/');
    }
  }, [router]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size must be less than 5MB');
        return;
      }

      setProfilePicture(file);
      setFormError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.onerror = () => {
        setFormError('Failed to load image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfilePicture(null);
    setProfilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    // Validation
    if (!firstName || !lastName || !email || !password || !whatsappNumber || !gender) {
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
        gender,
      };

      if (profilePicture && profilePreview) {
        userData.profilePictureUrl = profilePreview;
      }

      await handleRegister(userData);
      router.push('/');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={`${styles.authCard} ${styles.authCardWithImage}`}>
        {/* Left Section - Image Preview */}
        <div 
          className={`${styles.authImageSection} ${utils.imageContainer}`}
          onClick={handleImageClick}
        >
          {profilePreview ? (
            <>
              <img 
                src={profilePreview} 
                alt="Profile" 
                className={utils.imagePreview}
              />
              <div
                className={utils.closeButton}
                onClick={handleRemoveImage}
                title="Remove image"
              >
                ✕
              </div>
            </>
          ) : (
            <div className={utils.uploadContainer}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p className={utils.uploadPlaceholder}>Click to upload photo</p>
              <p className={utils.uploadSubtext}>or drag and drop</p>
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

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className={utils.hiddenFileInput}
            aria-label="Upload profile picture"
          />

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
              label="Email Address"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              fullWidth
              required
            />

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select 
                title="Gender selection"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#cb4154] transition-colors bg-white"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

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

            <Input
              label="WhatsApp Number"
              type="tel"
              placeholder="+1234567890"
              value={whatsappNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsappNumber(e.target.value)}
              fullWidth
              required
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              fullWidth
            />

            <Button type="submit" fullWidth variant="primary" className="mt-4 text-sm" disabled={loading}>
              {loading ? 'REGISTERING...' : 'REGISTER'}
            </Button>
          </form>

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