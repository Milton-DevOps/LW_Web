'use client';

import React, { useState } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
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
  const [profile, setProfile] = useState({
    firstName: 'Robert',
    lastName: 'William',
    email: 'robert.william@lightworldmission.com',
    phone: '+1 (555) 123-4567',
    department: 'Administration',
    bio: 'Admin of Light World Mission',
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsSaved(false);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return;
      }
      
      setProfilePicture(file);
      setIsSaved(false);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('Profile saved:', profile);
    if (profilePicture) {
      console.log('Profile picture:', profilePicture);
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

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

        {/* Content */}
        <div className={styles.content}>
          {isSaved && (
            <div className={styles.successMessage}>
              ✓ Profile saved successfully!
            </div>
          )}

          {/* Profile Avatar */}
          <div className={styles.avatarContainer}>
            {profilePreview ? (
              <img 
                src={profilePreview} 
                alt="Profile" 
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarInitials}>
                RW
              </div>
            )}
          </div>

          {/* Form Fields */}
          <form className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name</label>
                <Input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Last Name</label>
                <Input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Department</label>
              <Input
                type="text"
                value={profile.department}
                onChange={(e) => handleChange('department', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Bio</label>
              <textarea
                title="Bio"
                placeholder="Enter your bio"
                className={styles.textarea}
                rows={3}
                value={profile.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
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
              />
              {profilePicture && (
                <p className={styles.fileName}>{profilePicture.name}</p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button
            onClick={handleSave}
            className={styles.buttonPrimary}
          >
            Save Changes
          </Button>
          <Button
            onClick={onClose}
            className={styles.buttonSecondary}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
