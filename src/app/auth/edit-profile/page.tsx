'use client';

import React, { useState, useEffect } from 'react' ;
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { colors } from '../../../constants/colors';
import { useAuth } from '../../../hooks/useAuth';
import { getToken } from '../../../services/authService';
import styles from '../auth.module.css';

export default function EditProfile() {
  const router = useRouter();
  const { user, handleUpdateProfile, loading, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!getToken()) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setWhatsappNumber(user.whatsappNumber || '');
      setPhoneNumber(user.phoneNumber || '');
      if (user.profilePicture?.url) {
        setProfilePreview(user.profilePicture.url);
      }
    }
  }, [user, router]);

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
    setSuccess(false);
    clearError();

    if (!firstName || !lastName || !whatsappNumber) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(whatsappNumber)) {
      setFormError('Please enter a valid WhatsApp number');
      return;
    }

    if (phoneNumber && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phoneNumber)) {
      setFormError('Please enter a valid phone number');
      return;
    }

    try {
      const profileData: any = {
        firstName,
        lastName,
        whatsappNumber,
        phoneNumber: phoneNumber || '',
      };

      if (profilePicture && profilePreview) {
        profileData.profilePictureUrl = profilePreview;
      }

      await handleUpdateProfile(profileData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authCardContent}>
          {/* Left Section - Form */}
          <div className={styles.authCardLeft}>
            <div>
              <h2 className={styles.authTitle}>
                COMPLETE YOUR PROFILE
              </h2>
              <p className={styles.authSubtitle}>Update your personal information</p>
            </div>

            {(formError || error) && (
              <div className={styles.errorMessage} role="alert">
                {formError || error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                Profile updated successfully! Redirecting...
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                  fullWidth
                />

                <Input
                  label="Last Name *"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                  fullWidth
                />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                disabled
                fullWidth
              />

              <Input
                label="WhatsApp Number *"
                type="tel"
                placeholder="+1234567890"
                value={whatsappNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsappNumber(e.target.value)}
                fullWidth
              />

              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                fullWidth
              />

              <Button type="submit" fullWidth className="mt-3" disabled={loading}>
                {loading ? 'UPDATING...' : 'UPDATE PROFILE'}
              </Button>
            </form>
          </div>

          {/* Right Section - Profile Picture */}
          <div className={styles.authCardRight}>
            <div className={styles.fullWidth}>
              <label className={styles.fileInputLabel}>
                Profile Picture (Optional)
              </label>
              <input
                type="file"
                title="Profile picture upload"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className={styles.fileInput}
              />
              {profilePicture && (
                <p className={styles.fileName}>{profilePicture.name}</p>
              )}
            </div>

            {profilePreview && (
              <div className={styles.profileImageContainer}>
                <img 
                  src={profilePreview} 
                  alt="Profile Preview" 
                  className={styles.profileImagePreview}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}