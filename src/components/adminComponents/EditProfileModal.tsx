'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { useAuthContext } from '@/contexts/AuthContext';
import styles from './EditProfileModal.module.css';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const colorScheme = colors;
  const { user, handleUpdateProfile, loading, error } = useAuthContext();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with current user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        whatsappNumber: user.whatsappNumber || '',
      });
      // Set profile picture from user if available
      if (user.profilePicture?.url) {
        setProfilePreview(user.profilePicture.url);
      } else {
        setProfilePreview(null);
      }
      setProfilePicture(null);
      setIsSaved(false);
      setSaveError('');
    }
  }, [isOpen, user]);

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsSaved(false);
    setSaveError('');
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSaveError('Please select a valid image file');
        return;
      }
      
      setProfilePicture(file);
      setIsSaved(false);
      setSaveError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaveError('');
      setIsSaving(true);

      // Prepare profile data
      const profileData: any = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        whatsappNumber: profile.whatsappNumber,
      };

      // Handle profile picture - if it's a file, convert to base64
      if (profilePicture) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          profileData.profilePictureUrl = event.target?.result as string;
          try {
            await handleUpdateProfile(profileData);
            setIsSaved(true);
            setTimeout(() => {
              setIsSaved(false);
              onClose();
            }, 1500);
          } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Failed to update profile');
          } finally {
            setIsSaving(false);
          }
        };
        reader.readAsDataURL(profilePicture);
      } else {
        // No new profile picture, just update other fields
        await handleUpdateProfile(profileData);
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
          onClose();
        }, 1500);
        setIsSaving(false);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile');
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const getInitials = () => {
    return `${user?.firstName?.charAt(0) || 'U'}${user?.lastName?.charAt(0) || 'S'}`;
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className={styles.backdrop}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.headerTitle}>Edit Profile</h3>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            ✕
          </button>
        </div>

        {/* Main Content Container */}
        <div className={styles.contentContainer}>
          {/* Form Section - Left Side */}
          <div className={styles.formSection}>
            {isSaved && (
            <div className={styles.successMessage}>
              ✓ Profile saved successfully!
            </div>
          )}

          {saveError && (
            <div className={styles.errorMessage}>
              ✗ {saveError}
            </div>
          )}

          {/* Form Fields */}
          <form className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name</label>
                <Input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Last Name</label>
                <Input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email (Read-only)</label>
              <Input
                type="email"
                value={profile.email}
                disabled={true}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <Input
                type="tel"
                value={profile.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>WhatsApp Number</label>
              <Input
                type="tel"
                value={profile.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Profile Picture (Optional)
              </label>
              <input
                type="file"
                title="Profile picture upload"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className={styles.fileInput}
                disabled={isSaving}
              />
              {profilePicture && (
                <p className={styles.fileName}>{profilePicture.name}</p>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className={styles.footer}>
            <Button
              onClick={handleSave}
              className={styles.buttonPrimary}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              onClick={onClose}
              className={styles.buttonSecondary}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>

            {/* Image Section - Right Side (Circular) */}
            <div className={styles.imageSection}>
              <div className={styles.circularImageContainer}>
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile" className={styles.circularImage} />
                ) : (
                  <div className={styles.circularImagePlaceholder}>
                    <p>Profile Image</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
