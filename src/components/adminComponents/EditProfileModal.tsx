'use client';

import React, { useState } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorMode?: 'light' | 'dark';
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  colorMode = 'light',
}) => {
  const colorScheme = colors[colorMode];
  const [profile, setProfile] = useState({
    firstName: 'Robert',
    lastName: 'William',
    email: 'robert.william@lightworldmission.com',
    phone: '+1 (555) 123-4567',
    department: 'Administration',
    bio: 'Admin of Light World Mission',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    console.log('Profile saved:', profile);
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
        className="fixed inset-0 z-50"
        onClick={onClose}
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg shadow-xl z-50 max-h-96 overflow-hidden"
        style={{ backgroundColor: colorScheme.surface }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex justify-between items-center sticky top-0"
          style={{ borderColor: colorScheme.border, backgroundColor: colorScheme.surface }}
        >
          <h3 className="text-lg font-bold">Edit Profile</h3>
          <button
            onClick={onClose}
            className="text-xl leading-none"
            style={{ color: colorScheme.textSecondary }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {isSaved && (
            <div
              className="p-3 rounded-lg text-center text-sm font-medium"
              style={{ backgroundColor: '#d4edda', color: '#155724' }}
            >
              ✓ Profile saved successfully!
            </div>
          )}

          {/* Profile Avatar */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: colorScheme.primary }}
            >
              RW
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <Input
              type="text"
              value={profile.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <Input
              type="text"
              value={profile.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <Input
              type="text"
              value={profile.department}
              onChange={(e) => handleChange('department', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              className="w-full px-4 py-2 border rounded"
              style={{
                borderColor: colorScheme.border,
                backgroundColor: colorScheme.background,
                color: colorScheme.text,
              }}
              rows={3}
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex gap-3 sticky bottom-0"
          style={{ borderColor: colorScheme.border, backgroundColor: colorScheme.surface }}
        >
          <Button
            onClick={handleSave}
            className="flex-1"
            style={{ backgroundColor: colorScheme.primary }}
          >
            Save Changes
          </Button>
          <Button
            onClick={onClose}
            className="flex-1"
            style={{ backgroundColor: colorScheme.secondary }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
