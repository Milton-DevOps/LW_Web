'use client';

import React, { useState, useEffect } from 'react' ;
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { colors } from '../../../constants/colors';
import { useAuth } from '../../../hooks/useAuth';
import { getToken, getUser } from '../../../services/authService';
import styles from '../auth.module.css';

export default function EditProfile() {
  const router = useRouter();
  const { handleUpdateProfile, loading, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalProfilePicture, setOriginalProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    const token = getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Get user data from localStorage (async storage)
    const userData = getUser();
    
    if (userData) {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setEmail(userData.email || '');
      setWhatsappNumber(userData.whatsappNumber || '');
      setPhoneNumber(userData.phoneNumber || '');
      if (userData.profilePicture?.url) {
        setProfilePreview(userData.profilePicture.url);
        setOriginalProfilePicture(userData.profilePicture.url);
      }
    }
    
    setIsLoading(false);
  }, [router]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Profile picture must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file');
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
        setFormError('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePreview(null);
  };

  const handleResetProfilePicture = () => {
    setProfilePicture(null);
    setProfilePreview(originalProfilePicture);
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

      // Only include profile picture if it was changed
      if (profilePicture && profilePreview && profilePreview !== originalProfilePicture) {
        profileData.profilePictureUrl = profilePreview;
      }

      await handleUpdateProfile(profileData);
      
      // Update stored user data if profile picture was changed
      if (profileData.profilePictureUrl) {
        const userData = getUser();
        if (userData) {
          userData.profilePicture = { url: profilePreview };
          const { saveUser } = await import('../../../services/authService');
          saveUser(userData);
          setOriginalProfilePicture(profilePreview);
        }
      }
      
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
      {isLoading ? (
        <div className={`${styles.authCard} ${styles.authCardWithImage}`}>
          <div className={styles.authFormSection}>
            <p className="text-center text-gray-500">Loading your profile...</p>
          </div>
        </div>
      ) : (
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
            COMPLETE YOUR PROFILE
          </h2>

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
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              disabled
              fullWidth
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
              {loading ? 'UPDATING...' : 'UPDATE PROFILE'}
            </Button>
          </form>
        </div>
      </div>
      )}
    </div>
  );
}